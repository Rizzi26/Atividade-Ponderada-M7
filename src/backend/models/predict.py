from datetime import datetime
from typing import Optional
from database.postgres import base_ormar_config
from ormar import Boolean, DateTime, ForeignKey, Integer, Model, String
from models.user import User

class Predict(Model):
    ormar_config = base_ormar_config.copy(tablename="predict")

    id = Integer(primary_key=True, autoincrement=True)
    date = DateTime(default=datetime.now)
    username = String(max_length=100)
    user_id: Optional[User] = ForeignKey(User)
