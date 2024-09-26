---
title: "Documentação das rotas e schemas do projeto"
sidebar_position: 2
description: Nessa secção irei explicar como realizei a construção das rotas, models e schemas do projeto.
---

# Documentação do Backend

## Introdução

&emsp;Esta seção da documentação é dedicada a descrever as funcionalidades e o funcionamento do backend do projeto. O backend é responsável por gerenciar as operações de registro, consulta, atualização e exclusão em cada diferente tabela do banco de dados que registram as ações realizadas durante a utilização da plataforma.

## Roteamento do backend

### Arquivo main.py

&emsp;O arquivo `main.py` é a espinha dorsal do sistema de roteamento do backend. Ele centraliza e organiza todas as rotas da aplicação, garantindo que cada módulo específico de funcionalidade (como usuários, logs e predict) tenha seu próprio roteador, o que facilita a manutenção e a escalabilidade do código.

### Estrutura e Funcionalidade:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, user, logs
import uvicorn


app = FastAPI()

app.include_router(predict.router)
app.include_router(user.router)
app.include_router(logs.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "working"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
```

&emsp;Ao organizar as rotas dessa maneira, conseguimos modularizar nosso código, o que melhora a clareza e a manutenção. Cada módulo pode ser desenvolvido e testado separadamente, e qualquer mudança ou adição de novas rotas pode ser feita sem impactar diretamente outras partes da aplicação. Além disso, o uso de APIRouter do FastAPI nos permite criar um sistema de roteamento robusto e eficiente, adequado para aplicações de médio e grande porte.

&emsp;A abordagem utilizada no main.py oferece uma estrutura clara e escalável para o gerenciamento das rotas do backend, facilitando tanto o desenvolvimento quanto a manutenção do sistema. 

## Schema e Route's da tabela log:

### Schema Log

&emsp;O schema logs define a estrutura dos dados transferidos entre o cliente e o banco de dados, ou seja, apenas colunas que recebem dados do servidor e inputam no banco:

```python
from pydantic import BaseModel

class LogCreate(BaseModel):
    date: str
    username_log: str
    action: str
    user_id: int

class LogUpdate(BaseModel):
    username_log: str
    action: str 
```

- `date`: Coluna que recebe a data e horário.
- `username_log`: Nomde do usuário que estava logado na aplicação no momento do log.
- `action`: Descrição da ação registrada. É uma string com no máximo 100 caracteres.
- `user_id`: Id do usuário em questão que vem da tabela `users`.

&emsp;Como eu estou trabalhando com payloads diferentes e utilizando-os em locais diferentes da aplicação preferi separa-los para melhor aplicabilidade.

### Rotas de Logs

&emsp;As rotas para a tabela `logs` permitem a criação, listagem, consulta individual, atualização e exclusão de logs. Abaixo estão as rotas definidas no arquivo `routes/logs.py`:

```python
import ormar
import ormar.exceptions
from fastapi import APIRouter, HTTPException
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

async def create_log(username_log: str, action: str, user_id: int = None):
    supabase = create_supabase_client()

    try:
        log_data = {
            "username_log": username_log,
            "action": action,
            "date": get_formatted_datetime()
        }

        if user_id is not None:
            log_data["user_id"] = user_id

        response = supabase.table('logs').insert(log_data).execute()

        return response.data

    except Exception as e:
        error_trace = traceback.format_exc()
        print(f"Full error trace: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Erro ao registrar log: {str(e)}")

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
```

&emsp;Explicação um pouco mais detalhada de cada rota em específico:

- `POST /register` --> **async def create_log()**:
    - Cria um novo log com os dados fornecidos.
    - Retorna sucesso (201) ou erro (500).
    - Escolhi formatar em uma função essa rota para poder utilizar em outras rotas com maior flexibilidade.

- `GET /list`:
    - Lista todos os logs.
    - Formata os dados antes de retornar.
    - Retorna sucesso (200) com logs ou erro (404/500).

- `GET /list/{log_id}`:
    - Consulta um log específico pelo ID.
    - Formata os dados antes de retornar.
    - Retorna sucesso (200) com o log ou erro (404/500).

- `PUT /update`:
    - Atualiza um log existente com os dados fornecidos.
    - Retorna sucesso (200) ou erro (500).

- `DELETE /delete/{log_id}`:
    - Deleta um log específico pelo ID.
    - Retorna sucesso (200) ou erro (404/500).

## Schema e Route's da tabela predict:

### Schema predict

&emsp;O schema predict define a estrutura dos dados transferidos entre o cliente e o banco de dados, ou seja, apenas colunas que recebem dados do servidor e inputam no banco:

```python
from pydantic import BaseModel, Field

class Predict(BaseModel):
    username: str
    forecast: bool
    forecast_result: str
    days: int
    user_id: int 

class Predict_update(BaseModel):
    username: str
    forecast: bool
    forecast_result: str
```

- `username`: Nome do usuário que utilizou os serviços de predição.
- `forecast`: Boleana que passa a ser True quando o usuário solicita a predição.
- `forecast_result`: JSON que armazena a quantidade de dias e a respectiva predição.
- `days`: Dias que o usuário quer prever a frente.
- `user_id`: ID do usuário que utilizou os serviços de predição.

&emsp;Como eu estou trabalhando com payloads diferentes e utilizando-os em locais diferentes da aplicação preferi separa-los para melhor aplicabilidade.

### Rotas de predict

&emsp;As rotas para a tabela `predict` permitem a criação, listagem, consulta individual, atualização e exclusão de mídias. Abaixo estão as rotas definidas no arquivo `routes/predicts.py`:

```python
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
```

&emsp;Explicação um pouco mais detalhada de cada rota em específico:

- `POST /register`:
    - Cria uma nova predição com os dados fornecidos.
    - Retorna sucesso (201) ou erro (500).

- `GET /list`:
    - Lista todas as predições.
    - Formata os dados antes de retornar.
    - Retorna sucesso (200) com as predições ou erro (404/500).

- `GET /get/{predict_id}`:
    - Consulta uma predição específica pelo ID.
    - Formata os dados antes de retornar.
    - Retorna sucesso (200) com a predição ou erro (404/500).

- `PUT /update`:
    - Atualiza uma predição existente com os dados fornecidos.
    - Retorna sucesso (200) ou erro (500).

- `DELETE /delete/{predict_id}`:
    - Deleta uma predição específica pelo ID.
    - Retorna sucesso (200) ou erro (404/500).

## Schema e Route's da tabela users:
### Schema Users

&emsp;O schema users define a estrutura dos dados armazenados na tabela users e é utilizado para validação e serialização dos dados no FastAPI. Abaixo está o código do schema users:

```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
```

- `username`: Nome do usuário. É uma string com no máximo 100 caracteres.
- `password`: É uma HASH com a senha que é convertida em uma das funções abaixo.

### Rotas de Users

&emsp;As rotas para a tabela users permitem a criação, listagem, consulta individual, atualização e exclusão de users. Abaixo estão as rotas definidas no arquivo routes/users.py:

```python
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
```

&emsp;Explicação um pouco mais detalhada de cada rota em específico:

- `POST /register`:
    - Cria um novo usuáro com os dados fornecidos e transforma sua senha em HASH para armazenar no banco de dados.
    - Retorna sucesso (201) ou erro (500).

- `GET /list`:
    - Lista todos os users.
    - Retorna sucesso (200) com users ou erro (500).

- `GET /get/{user_id}`:
    - Consulta um usuário específico pelo ID.
    - Retorna sucesso (200) com o user ou erro (404/500).

- `PUT /update`:
    - Atualiza um usuário existente com os dados fornecidos.
    - Retorna sucesso (200) ou erro (404/500).

- `DELETE /delete/{user_id}`:
    - Deleta um usuário específico pelo ID.
    - Retorna sucesso (200) ou erro (404/500).

## Conclusão

&emsp;O desenvolvimento do backend deste projeto foi fundamentado em uma estrutura organizada e eficiente, proporcionando rotas claras para realizar operações essenciais como registro, consulta, atualização e exclusão de dados. A definição de modelos e schemas permitiu que as informações armazenadas no banco de dados fossem gerenciadas de maneira eficaz, garantindo a integridade dos dados e a consistência das operações.

&emsp;A documentação das rotas e schemas descrita nesta seção serve como uma base sólida para compreender o fluxo de dados e os pontos de integração da API. Esse processo possibilita que futuros desenvolvedores possam escalar e modificar o projeto com facilidade, mantendo a qualidade e o desempenho da aplicação.
