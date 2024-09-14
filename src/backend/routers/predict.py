from datetime import datetime
from uuid import UUID

import ormar
from fastapi import HTTPException
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.predict import Predict as PredictModel
from schemas.predict import Predict
from ormar.exceptions import NoMatch


router = APIRouter(
    prefix="/predicts",
    tags=["predicts"],
)

@router.post("/register")
async def register(predict: Predict):
    try:
        await PredictModel.objects.create(
            date = predict.date,
            emergency_button = predict.emergency_button,
            ia_request = predict.ia_request,
            user_id = predict.user_id
        )
        return JSONResponse(content={
            "error": False,
            "message": "predict criado com sucesso"
        }, status_code=201)
    except Exception as e:
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}"
        }, status_code=500)

@router.get("/list")
async def list_predicts():
    try:
        predicts = await PredictModel.objects.all()
        if not predicts:
            return JSONResponse(content={
                "error": True,
                "message": "Nenhum predict encontrado"
            }, status_code=404)
        
        predict_dicts = []
        for predict in predicts:
            predict_dict = predict.dict()
            for key, value in predict_dict.items():
                if isinstance(value, datetime):
                    predict_dict[key] = value.isoformat()
            predict_dicts.append(predict_dict)

        return JSONResponse(content={
            "error": False,
            "message": "predicts encontrados com sucesso",
            "data": predict_dicts
        }, status_code=200)
    except Exception as e:
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}"
        }, status_code=500)

@router.get("/list/{predict_id}")
async def list(predict_id: int):
    try:
        predict = await PredictModel.objects.get(id=predict_id)
        print(predict)
        return JSONResponse(content={
            "error": False,
            "predict": predict
        }, status_code=200)
    except ormar.NoMatch:
        return JSONResponse(content={
            "error": True,
            "message": "predict não encontrado"
        }, status_code=404)
    except Exception as e:
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}"
        }, status_code=500)

@router.put("/update/{predict_id}")
async def update(predict_id: int, predict_update: Predict):
    try:
        existing_predict = await PredictModel.objects.get_or_none(id=predict_id)
        if existing_predict is None:
            raise HTTPException(status_code=404, detail="predict não encontrado")

        predict_update_data = predict_update.dict(exclude_unset=True)
        for field, value in predict_update_data.items():
            if isinstance(value, datetime):
                predict_update_data[field] = value.isoformat()

        await existing_predict.update(**predict_update_data)

        return {"error": False, "message": "predict atualizado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {e}")



@router.delete("/delete/{predict_id}")
async def delete(predict_id: int):
    try:
        await PredictModel.objects.delete(id=predict_id)
        return JSONResponse(content={
            "error": False,
            "message": "predict deletado com sucesso"
        }, status_code=200)
    except ormar.NoMatch:
        return JSONResponse(content={
            "error": True,
            "message": "predict não encontrado"
        }, status_code=404)
    except Exception as e:
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}"
        }, status_code=500)