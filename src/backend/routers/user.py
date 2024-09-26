import ormar
import ormar.exceptions
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schemas.user import UserCreate
from utils.crypto import get_password_hash, verify_password
from database.supabase import create_supabase_client
import traceback
from routers.logs import create_log 
from schemas.logs import LogCreate

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.post("/register/")
async def create_user(user: UserCreate):
    supabase = create_supabase_client()

    hashed_password = get_password_hash(user.password)

    try:
        response = supabase.table('users').insert({
            "username": user.username,
            "password": hashed_password
        }).execute()

        if response.data:
            user_id = response.data[0].get('id')  

            await create_log(
                username_log=user.username,
                action="Usuário criado com sucesso",
                user_id=user_id  
                )
            return {"message": "Usuário criado com sucesso", "user_id": user_id}
        else:
            raise HTTPException(status_code=400, detail="Erro ao criar usuário")
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

            if verify_password(user.password, stored_password):
                await create_log(
                    username_log=user.username,
                    action="Login bem-sucedido",
                    user_id=user_data['id']  
                )
                return {"message": "Login bem-sucedido", "user": user_data}
            else:
                await create_log(
                    username_log=user.username,
                    action="Senha inválida",
                    user_id=user_data['id']
                )
                return JSONResponse(content={"error": "Senha inválida"}, status_code=400)

        else:
            await create_log(
                username_log=user.username,
                action="Usuário não encontrado",
                user_id=user_data['id']
            )
            return JSONResponse(content={"error": "Usuário não encontrado"}, status_code=404)

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")

        await create_log(
            username_log=user.username,
            action="Erro no login",
            user_id=user_data['id']
        )
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
    
@router.get("/get_by_id/{user_id}")
async def get_user_by_id(user_id: int):
    supabase = create_supabase_client()

    try: 
        response = supabase.table('users').select("*").eq("id", user_id).execute()

        if response.data:
            return {"message": "Usuário requisitado", "user": response.data}
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

