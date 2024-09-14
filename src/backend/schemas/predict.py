from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class Predict(BaseModel):
    id: int = Field(default=None, gt=0)
    date: Optional[datetime] = Field(default=None)
    username: str = Field(default=None)
    user_id: int = Field(default=None)