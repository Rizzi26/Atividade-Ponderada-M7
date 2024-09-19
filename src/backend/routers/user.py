import ormar
import ormar.exceptions
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from schemas.user import UserCreate
from utils.crypto import get_password_hash, verify_password
from pytz import timezone
from datetime import datetime
from database.supabase import create_supabase_client
import traceback

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.post("/register/")
async def create_user(user: UserCreate):
    supabase = create_supabase_client()

    # Criptografa a senha do usuário
    hashed_password = get_password_hash(user.password)

    # Cria um novo usuário no Supabase
    try:
        response = supabase.table('users').insert({
            "username": user.username,
            "password": hashed_password
        }).execute()

        return response.data
    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")

        return JSONResponse(content={"error": str(e), "trace": error_trace}, status_code=400)


@router.post("/login/")
async def login(user: UserCreate):
    supabase = create_supabase_client()

    try:
        response = supabase.table('users').select("*").eq("username", user.username).execute()

        if response.data:
            user_data = response.data[0]
            stored_password = user_data['password']

            # Verifica se a senha fornecida corresponde à senha armazenada
            if verify_password(user.password, stored_password):
                print("Senha válida")
                return {"message": "Login bem-sucedido", "user": user_data}
            else:
                return JSONResponse(content={"error": "Senha inválida"}, status_code=400)

        else:
            return JSONResponse(content={"error": "Usuário não encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)
    

@router.get("/list/")
async def list_users():
    supabase = create_supabase_client()

    try:
        response = supabase.table('users').select("*").execute()

        if response.data:
            return {"message": "Lista de usuários na base", "users": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum usuário encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)


@router.get("/get/{username}")
async def get_user(username: str):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('users').select("*").eq("username", username).execute()

        if response.data:
            return {"message": "Usuário requisitado", "user": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum usuário encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)


@router.put("/update/{user_id}")
async def update_user(user_id: int, user: UserCreate):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('users').select("*").eq("id", user_id).execute()

        if response.data:
            hashed_password = get_password_hash(user.password)

            response = supabase.table('users').update({
                "username": user.username,
                "password": hashed_password
            }).eq("id", user_id).execute()

            return {"message": "Usuário atualizado com sucesso", "user": response.data}
        else:
            return JSONResponse(content={"error": "Nenhum usuário encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={"error": "Erro interno do servidor", "trace": error_trace}, status_code=500)

    

@router.delete("/delete/{user_id}")
async def delete_user(user_id: int):
    supabase = create_supabase_client()

    try:
        response = supabase.table('users').select("*").eq("id", user_id).execute()

        if response.data:
            response = supabase.table('users').delete().eq("id", user_id).execute()

            return JSONResponse(content={
                "error": False,
                "message": "Usuário deletado com sucesso"
            }, status_code=200)
        else:
            return JSONResponse(content={
                "error": True,
                "message": "Usuário não encontrado"
            }, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        return JSONResponse(content={
            "error": True,
            "message": f"Erro interno do servidor: {e}",
            "trace": error_trace
        }, status_code=500)

