from datetime import datetime
from typing import Optional
from dataclasses import dataclass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, sql
from uvicorn import run

# Habilitar CORS
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:4200",  # Example frontend URL
    "http://127.0.0.1:4200",  # Example frontend URL
    "http://localhost:8000",  # Example frontend URL
    "http://127.0.0.1:8000",
]

app = FastAPI()

# Cors middleware para manejar intercambio de datos entre frontend y backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], #TODO: cambiar a ["GET", "POST", "DELETE", "PUT"] cuando se implemente el login
    allow_headers=["*"],
)

class Transacciones(BaseModel):
    usuario: str
    correo_electronico: str
    valor: int
    fecha_transaccion: datetime
    descripcion: Optional[str] 
    nombre_categoria: str
    tipo: str

@dataclass
class resultado:
    result: str
    message: list
    status: int


# Abrir la conexión a la base de datos PostgreSQL
#DATABASE_URL = "postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
DATABASE_URL = "postgresql://postgres:31109806@localhost/presupuestodb"
engine = create_engine(DATABASE_URL)

def create_stmt(filter = ""):
    basic_stmt = """
                SELECT usuario, correo_electronico, valor, fecha_transaccion, descripcion, nombre_categoria, tipo 
                FROM transacciones
                INNER JOIN categoria ON categoria_id = categoria.id
                INNER JOIN usuario ON usuario_id = usuario.id 
                """
    return sql.text(basic_stmt + filter)


"""
# Create the statement for the login query
stmt_login = sql.text("
                      SELECT * FROM usuario
                      WHERE
                      usuario = :user_del_sqlalchemy
                      AND
                      contrasena = :pass_del_sqlalchemy
                      ")

with engine.connect() as conn:
    user_del_front = "Katerine"
    pass_del_front = "369852147"
    result = conn.execute(stmt_login, {"user_del_sqlalchemy": user_del_front, "pass_del_sqlalchemy": pass_del_front}).fetchall()
    
    # usuarios = [Usuario(id=row[0], usuario=row[1], correo_electronico=row[2], contrasena=row[3], fecha_creacion=str(row[4])) for row in result]
    usuarios = []
    for row in result:
        usuarios.append(
            Usuario(
                id=row[0],
                usuario=row[1],
                correo_electronico=row[2],
                contrasena=row[3],
                fecha_creacion=row[4])
        )
    # Check if the result is empty
    if not usuarios:
        raise HTTPException(status_code=404, detail="No users found")
"""

def abc(correo_electronico: str, tipo: str) -> resultado:
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt(f"WHERE tipo = '{tipo}' AND correo_electronico = '{correo_electronico}'")).fetchall()

    # Check if the result is empty
    if len(result) == 0:
        return resultado(f"No se encontraron {tipo}", [], 204)

    print(f"{tipo}:{result}.")
    lista_transacciones = []
    for row in result:
        lista_transacciones.append(
            Transacciones(
                usuario = row[0],
                correo_electronico = row[1],
                valor = row[2],
                fecha_transaccion = row[3],
                descripcion = row [4],
                nombre_categoria = row[5],
                tipo = row[6],
            )
        )
    
    return resultado(f"Se encontraron {len(lista_transacciones)} {tipo}", lista_transacciones, 200)


@app.get("/activos/{correo_electronico}")
async def get_activos(correo_electronico: str):
    return abc(correo_electronico, "activos")

@app.get("/pasivos/{correo_electronico}")
async def get_pasivos(correo_electronico: str):
    return abc(correo_electronico, "pasivos")

@app.get("/ingresos/{correo_electronico}")
async def get_ingresos(correo_electronico: str):
    return abc(correo_electronico, "ingresos")

@app.get("/egresos/{correo_electronico}")
async def get_egresos(correo_electronico: str):
    return abc(correo_electronico, "egresos")

# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8000)
