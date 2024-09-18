import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
import os

# Função para carregar o modelo
def load_model(model_path: str):
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    return model

# Função para criar sequências de dados (janelas de tempo)
def create_sequences(data, time_steps=60):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i + time_steps, 0])  # Features: sequências de preços passados
        y.append(data[i + time_steps, 0])    # Labels: preço futuro (próximo passo)
    return np.array(X), np.array(y)

# Função para prever múltiplos dias no futuro
def predict_future_days(model, last_sequence, num_days, scaler):
    future_predictions = []
    current_sequence = last_sequence

    for _ in range(num_days):
        # Fazer a previsão para o próximo dia
        next_prediction = model.predict(current_sequence)
        
        # Armazenar a previsão
        future_predictions.append(next_prediction[0, 0])
        
        # Redimensionar a previsão para ser compatível com a sequência de entrada
        next_prediction_reshaped = np.reshape(next_prediction, (1, 1, 1))
        
        # Atualizar a sequência com o valor previsto (remover o valor mais antigo e adicionar o novo)
        current_sequence = np.append(current_sequence[:, 1:, :], next_prediction_reshaped, axis=1)

    # Desfazer a normalização dos valores previstos
    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    return future_predictions

# Função principal de processamento e previsão
def main(csv_file_path: str, model_path: str, forecast_days: int):
    # Verificar se o arquivo CSV existe
    if not os.path.exists(csv_file_path):
        raise FileNotFoundError(f"Arquivo CSV não encontrado: {csv_file_path}")

    # Carregar dados históricos do CSV
    df = pd.read_csv(csv_file_path)

    # Verificar se o DataFrame tem as colunas esperadas
    if 'Close' not in df.columns:
        raise ValueError("Arquivo CSV deve conter a coluna 'Close'.")

    # Remover valores ausentes
    df = df[['Close']].dropna()

    # Normalizar os dados (entre 0 e 1) para facilitar o aprendizado da LSTM
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    # Criar as sequências de dados
    time_steps = 60
    X, y = create_sequences(scaled_data, time_steps)

    # Reshape dos dados para [samples, time_steps, features] como exigido pela LSTM
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    # Carregar o modelo
    model = load_model(model_path)

    # Prever os próximos `forecast_days` dias
    last_sequence = scaled_data[-time_steps:].reshape(1, time_steps, 1)
    future_prices = predict_future_days(model, last_sequence, forecast_days, scaler)

    # Criar um vetor de tempo para as previsões futuras
    future_dates = [datetime.now() + timedelta(days=i) for i in range(1, forecast_days + 1)]

    # Formatar a previsão
    forecast_df = pd.DataFrame({
        "date": future_dates,
        "predicted_value": future_prices.flatten()
    })

    # Salvar previsões em um arquivo CSV
    forecast_csv_path = 'future_predictions_lstm.csv'
    forecast_df.to_csv(forecast_csv_path, index=False)

    print(f"Previsões salvas em '{forecast_csv_path}'")

# Exemplo de uso

csv_file_path = 'utils/eth_historical_data.csv'  # Caminho atualizado para o CSV
model_path = 'utils/lstm/model_lstm.pkl'           # Atualize com o caminho para o seu modelo
forecast_days = 7                         # Número de dias para previsão

main(csv_file_path, model_path, forecast_days)
