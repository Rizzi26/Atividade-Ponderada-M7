from fastapi import APIRouter, HTTPException, Depends, status
# from utils.predict import prediction
from schemas.predict import Predict, Predict_update
from supabase import Client
from database.supabase import create_supabase_client
from typing import Any
from fastapi.responses import JSONResponse
import traceback


router = APIRouter(
    prefix="/predicts",
    tags=["predicts"],
)

# @router.post("/predict/")
# async def predict_knr(data: Predict, supabase: Client = Depends(create_supabase_client)) -> Any:
#     # Extraindo dados da requisição
#     username = data.username
#     user_id = data.user_id
#     forecast = data.forecast

#     if forecast:
#         prediction()

#     # Chamando a função de previsão com os parâmetros adequados
#     try:
#         prediction_result = prediction(username=username, user_id=user_id, supabase=supabase)
#         return {"success": True, "prediction": prediction_result}
#     except Exception as e:
#         return {"success": False, "error": str(e)}

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
                "forecast_result": predict_update.forecast
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