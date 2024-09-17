import ormar
import ormar.exceptions
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from schemas.logs import LogCreate, LogUpdate
import pytz 
from datetime import datetime
from database.supabase import create_supabase_client
import traceback

SAO_PAULO_TZ = pytz.timezone('America/Sao_Paulo')

router = APIRouter(
    prefix="/logs",
    tags=["logs"],
)

def get_formatted_datetime():
    now = datetime.now(SAO_PAULO_TZ)
    return now.strftime('%d/%m/%Y_%Hh%M')

@router.post("/register/")
async def create_log(log: LogCreate):
    supabase = create_supabase_client()

    try:
        response = supabase.table('logs').insert({
            "username_log": log.username_log,
            "action": log.action,
            "user_id": log.user_id,
            "date": get_formatted_datetime()
        }).execute()

        return response.data
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")

        return JSONResponse(content={"error": str(e), "trace": error_trace}, status_code=400)
    

@router.get("/list/")
async def list_logs():
    supabase = create_supabase_client()

    try:
        response = supabase.table('logs').select("*").execute()

        if response.data:
            return {"message": "Lista de logs na base", "logs": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum log encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)


@router.get("/get/{log_id}")
async def get_log(log_id: int):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('logs').select("*").eq("id", log_id).execute()

        if response.data:
            return {"message": "Log requisitado", "log": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum log encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)


@router.put("/update/{log_id}")
async def update_user(log_id: int, log_update: LogUpdate):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('logs').select("*").eq("id", log_id).execute()

        if response.data:
            response = supabase.table('logs').update({
                "username_log": log_update.username_log,
                "action": log_update.action,
            }).eq("id", log_id).execute()

            return {"message": "Log atualizado com sucesso", "log": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum log encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)

    

@router.delete("/delete/{log_id}")
async def delete_user(log_id: int):
    supabase = create_supabase_client()

    try:
        response = supabase.table('logs').select("*").eq("id", log_id).execute()

        if response.data:
            response = supabase.table('logs').delete().eq("id", log_id).execute()

            return JSONResponse(content={
                "error": False,
                "message": "Log deletado com sucesso"
            }, status_code=200)
        else:
            return JSONResponse(content={
                "error": True,
                "message": "Log não encontrado"
            }, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}",
            "trace": error_trace
        }, status_code=500)

