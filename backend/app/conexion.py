import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv(".env")

DB_USERNAME = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

# Abrir la conexión a la base de datos PostgreSQL
DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

try:
    engine = create_engine(DATABASE_URL)
    print("Conexión exitosa a la base de datos: {DATABASE_URL}")
except Exception as e:
    engine = None
    print("URL: {DATABASE_URL}")
    print(f"Error al conectar a la base de datos: {e}")
