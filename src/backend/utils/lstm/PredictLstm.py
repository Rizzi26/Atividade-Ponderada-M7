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

