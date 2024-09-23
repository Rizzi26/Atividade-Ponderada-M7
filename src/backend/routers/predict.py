from fastapi import APIRouter
from utils.lstm.PredictLstm import main
from schemas.predict import Predict, Predict_update
from database.supabase import create_supabase_client
from typing import Any
from fastapi.responses import JSONResponse
import traceback
import pytz 
from datetime import datetime
from routers.logs import create_log 

SAO_PAULO_TZ = pytz.timezone('America/Sao_Paulo')

router = APIRouter(
    prefix="/predicts",
    tags=["predicts"],
)

def get_formatted_datetime():
    now = datetime.now(SAO_PAULO_TZ)
    return now.strftime('%d/%m/%Y_%Hh%M')
                      

@router.post("/predict/{modelo}")
async def predict_knr(modelo: str, data: Predict):
    supabase = create_supabase_client()

    print(f"Received data: {data}")
    print(f"Model: {modelo}")

    csv_file_path = 'backend/utils/eth_historical_data.csv'  
    model_path = f'backend/utils/{modelo}/model_{modelo}.pkl'  
    forecast_days = data.days  

    if data.forecast:
        try:
            print('Iniciando previsão...')
            print(f"CSV file path: {csv_file_path}")
            print(f"Model path: {model_path}")
            print(f"Forecast days: {forecast_days}")

            prediction_result = main(csv_file_path, model_path, forecast_days)
            print(f"Prediction result: {prediction_result}")
        except FileNotFoundError:
            print(f"File not found: {csv_file_path} or {model_path}")
            return {"status": "error", "message": f"Modelo '{modelo}' não encontrado."}
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return {"status": "error", "message": str(e)}

    try:
        response = supabase.table('predict').insert({
            "username_predict": data.username,
            "date": get_formatted_datetime(),
            "user_id": data.user_id,
            "forecast": data.forecast,
            "forecast_result": prediction_result,  
            "model": modelo  
        }).execute()

        await create_log(
            username_log=data.username,
            action=f"Predict feita com sucesso com o modelo {modelo}",
            user_id=data.user_id  
        )

        return {"status": "success", "data": response.data}
    except Exception as e:
        print(f"Error inserting data into Supabase: {str(e)}")
        await create_log(
            username_log=data.username,
            action=f"Predict falhou com o modelo {modelo}",
            user_id=data.user_id  
        )

        return {"status": "error", "message": str(e)}

@router.get("/list/")
async def list_predict():
    supabase = create_supabase_client()

    try:
        response = supabase.table('predict').select("*").execute()

        if response.data:
            return {"message": "Lista de predicts na base", "predict": response.data}
        else:
            return JSONResponse(content={"error": "Nenhuma predict encontrada"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)

@router.get("/get/{predict_id}")
async def get_predict(predict_id: int):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('predict').select("*").eq("id", predict_id).execute()

        if response.data:
            return {"message": "Predict requisitada", "user": response.data}
        else:
            return JSONResponse(content={"error": "Nenhuma Predict encontrada"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)


@router.put("/update/{predict_id}")
async def update_user(predict_id: int, predict_update: Predict_update):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('predict').select("*").eq("id", predict_id).execute()

        if response.data:
            response = supabase.table('predict').update({
                "username_predict": predict_update.username,
                "forecast": predict_update.forecast,
                "forecast_result": predict_update.forecast,
                "model": predict_update.model
            }).eq("id", predict_id).execute()

            return {"message": "Predict atualizada com sucesso", "predict": response.data}
        else:
            return JSONResponse(content={"error": "Nenhuma predict encontrada"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)



@router.delete("/delete/{predict_id}")
async def delete_predict(predict_id: int):
    supabase = create_supabase_client()

    try:
        response = supabase.table('predict').select("*").eq("id", predict_id).execute()

        if response.data:
            response = supabase.table('predict').delete().eq("id", predict_id).execute()

            return JSONResponse(content={
                "error": False,
                "message": "Predict deletada com sucesso"
            }, status_code=200)
        else:
            return JSONResponse(content={
                "error": True,
                "message": "Predict não encontrada"
            }, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}",
            "trace": error_trace
        }, status_code=500)