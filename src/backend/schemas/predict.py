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


