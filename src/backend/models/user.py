from database.postgres import base_ormar_config
from ormar import Integer, Model, String


class User(Model):
    ormar_config = base_ormar_config.copy(tablename="user")

    id = Integer(primary_key=True, autoincrement=True)
    user = String(max_length=100)
    password = String(max_length=100)
    