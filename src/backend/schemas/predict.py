from pydantic import BaseModel, Field

class Predict(BaseModel):
    id: int
    date: str
    username: str
    forecast: bool
    forecast_result: str
    user_id: int 

class Predict_update(BaseModel):
    username: str
    forecast: bool
    forecast_result: str

