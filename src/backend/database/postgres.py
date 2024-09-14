import os
import databases
from dotenv import load_dotenv
from ormar import OrmarConfig
from sqlalchemy.sql.schema import MetaData

# Carregar variáveis de ambiente do .env
load_dotenv("../.env")

# Obter a URL do banco de dados
DATABASE_URL = os.environ.get("DATABASE_URL")
assert DATABASE_URL is not None, "DATABASE_URL is not set"

# Configuração do banco e metadados
metadata = MetaData()
database = databases.Database(DATABASE_URL)

# Configuração do ormar
base_ormar_config = OrmarConfig(
    database=database,
    metadata=metadata
)
