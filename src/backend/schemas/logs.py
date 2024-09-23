from pydantic import BaseModel

class LogCreate(BaseModel):
    date: str
    username_log: str
    action: str
    user_id: int

class LogUpdate(BaseModel):
    username_log: str
    action: str 

