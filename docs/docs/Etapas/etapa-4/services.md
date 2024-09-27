---
title: Services
sidebar_position: 1
slug: "/services"
---

# Serviços da aplicação

## Introdução: Por que estou utilizando esses serviços isoladamente das rotas?

&emsp;A escolha de separar os serviços das rotas permite uma melhor organização do código e facilita a reutilização dos mesmos em diferentes partes da aplicação. Ao desacoplar as funcionalidades essenciais, como predição de séries temporais e manipulação de senhas, evitamos a complexidade excessiva nas rotas, tornando o desenvolvimento mais modular e mantendo o código mais limpo e fácil de manter.

## Serviço de predição

&emsp;Este serviço realiza predições de séries temporais usando dois tipos de redes neurais: LSTM e GRU. Ambos os modelos são eficazes para trabalhar com dados sequenciais e prever tendências futuras.

### LSTM (Long Short-Term Memory)

&emsp;A rede LSTM é um tipo de rede neural recorrente projetada para aprender dependências de longo prazo em dados sequenciais. Ela é ideal para previsão de séries temporais, como valores de ações ou para cryptos como estou utilizando.

- **Código do Serviço**

```python
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import MinMaxScaler
import os
from keras.models import load_model

# Função para carregar o modelo
def load_model(model_path: str):
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

# Função para criar sequências de dados (janelas de tempo)
def create_sequences(data, time_steps=60):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i + time_steps, 0])  
        y.append(data[i + time_steps, 0])    
    return np.array(X), np.array(y)

# Função para prever múltiplos dias no futuro
def predict_future_days(model, last_sequence, num_days, scaler):
    future_predictions = []
    current_sequence = last_sequence

    for _ in range(num_days):
        next_prediction = model.predict(current_sequence)
        
        future_predictions.append(next_prediction[0, 0])
        
        next_prediction_reshaped = np.reshape(next_prediction, (1, 1, 1))
        
        current_sequence = np.append(current_sequence[:, 1:, :], next_prediction_reshaped, axis=1)

    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    return future_predictions

# Função principal para carregar dados, fazer a previsão e retornar o resultado formatado
def main(csv_file_path: str, model_path: str, forecast_days: int):
    if not os.path.exists(csv_file_path):
        print(f"CSV file not found: {csv_file_path}")
        raise FileNotFoundError(f"Arquivo CSV não encontrado: {csv_file_path}")

    df = pd.read_csv(csv_file_path)
    print(f"DataFrame loaded from CSV: {df.head()}")

    if 'Close' not in df.columns:
        print("Column 'Close' is missing in the CSV file.")
        raise ValueError("Arquivo CSV deve conter a coluna 'Close'.")

    df = df[['Close']].dropna()

    # Normalizar os dados (entre 0 e 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)
    print(f"Scaled data: {scaled_data[:5]}")  # Mostrando os primeiros 5 valores escalados

    # Criar as sequências de dados
    time_steps = 60
    X, y = create_sequences(scaled_data, time_steps)

    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    print(f"X shape: {X.shape}, y shape: {y.shape}")

    # Carregar o modelo
    model = load_model(model_path)
    print("Model loaded successfully.")

    # Prever os próximos `forecast_days` dias
    last_sequence = scaled_data[-time_steps:].reshape(1, time_steps, 1)
    future_prices = predict_future_days(model, last_sequence, forecast_days, scaler)

    future_dates = [datetime.now() + timedelta(days=i) for i in range(1, forecast_days + 1)]
    forecast_list = [
        {
            "date": future_dates[i].strftime("%Y-%m-%d 17:00:00"),  
            "predicted_value": float(future_prices[i])  
        }
        for i in range(forecast_days)
    ]

    return forecast_list
```

### GRU (Gated Recurrent Unit)

&emsp;A rede GRU é uma variante simplificada da LSTM. Ela possui menos parâmetros, o que pode resultar em um tempo de treinamento mais rápido, mantendo um bom desempenho para séries temporais.

- **Código do Serviço**

```python
from datetime import datetime, timedelta
import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import MinMaxScaler
import os
from keras.models import load_model 

# Função para carregar o modelo GRU
def load_model(model_path: str):
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

# Função para criar sequências de dados (janelas de tempo)
def create_sequences(data, time_steps=60):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i + time_steps, 0])  
        y.append(data[i + time_steps, 0])    
    return np.array(X), np.array(y)

# Função para prever múltiplos dias no futuro com GRU
def predict_future_days(model, last_sequence, num_days, scaler):
    future_predictions = []
    current_sequence = last_sequence

    for _ in range(num_days):     
        next_prediction = model.predict(current_sequence)
        
        future_predictions.append(next_prediction[0, 0])
        
        next_prediction_reshaped = np.reshape(next_prediction, (1, 1, 1))
        
        current_sequence = np.append(current_sequence[:, 1:, :], next_prediction_reshaped, axis=1)

    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    return future_predictions

# Função principal para carregar dados, fazer a previsão e retornar o resultado formatado
def main(csv_file_path: str, model_path: str, forecast_days: int):
    if not os.path.exists(csv_file_path):
        raise FileNotFoundError(f"Arquivo CSV não encontrado: {csv_file_path}")

    df = pd.read_csv(csv_file_path)

    if 'Close' not in df.columns:
        raise ValueError("Arquivo CSV deve conter a coluna 'Close'.")

    df = df[['Close']].dropna()

    # Normalizar os dados (entre 0 e 1) para facilitar o aprendizado do GRU
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    # Criar as sequências de dados
    time_steps = 60
    X, y = create_sequences(scaled_data, time_steps)

    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    # Carregar o modelo GRU
    model = load_model(model_path)

    # Prever os próximos `forecast_days` dias
    last_sequence = scaled_data[-time_steps:].reshape(1, time_steps, 1)
    future_prices = predict_future_days(model, last_sequence, forecast_days, scaler)

    # Criar um vetor de tempo para as previsões futuras
    future_dates = [datetime.now() + timedelta(days=i) for i in range(1, forecast_days + 1)]

    # Formatar a previsão para incluir o horário de fechamento (17:00) e os valores previstos
    forecast_list = [
        {
            "date": future_dates[i].strftime("%Y-%m-%d 17:00:00"),  
            "predicted_value": float(future_prices[i])  
        }
        for i in range(forecast_days)
    ]

    return forecast_list  
```

## Serviço de Hash para senhas

&emsp;Este serviço lida com a geração e verificação de senhas utilizando o algoritmo de hash bcrypt. Além disso, ele também fornece funcionalidades para a criação de tokens JWT, usados para autenticação segura.

- **Código do Serviço**

```python
import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext

load_dotenv('./.env')

JWT_SECRET: str = os.environ.get('JWT_SECRET') or "secret"
CRYPT_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return CRYPT_CONTEXT.verify(plain_password, hashed_password)

def get_password_hash(password):
    return CRYPT_CONTEXT.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")

    return encoded_jwt
```

# Conclusão

&emsp;Esses serviços formam a base da lógica de predição e autenticação da aplicação. Separá-los das rotas permite maior modularidade, além de facilitar a manutenção e evolução da aplicação ao longo do tempo.
