from pydantic import BaseModel, Field

class User(BaseModel):
    id: int = Field(default=None, gt=0)
    user: str = Field(default=None)
    password: str = Field(default=None)
