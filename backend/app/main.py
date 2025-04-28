from datetime import datetime, date
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
    fecha_transaccion: str
    descripcion: Optional[str] 
    nombre_categoria: str
    tipo: str

@dataclass
class resultado:
    result: str
    message: list
    status: int
    total: int

# Abrir la conexión a la base de datos PostgreSQL
#DATABASE_URL = "postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
DATABASE_URL = "postgresql://postgres:31109806@localhost/presupuestodb"
engine = create_engine(DATABASE_URL)

def create_stmt_select(filter = ""):
    basic_stmt = """
                SELECT usuario, correo_electronico, valor, fecha_transaccion, descripcion, nombre_categoria, tipo 
                FROM transacciones
                INNER JOIN categoria ON categoria_id = categoria.id
                INNER JOIN usuario ON usuario_id = usuario.id 
                """
    return sql.text(basic_stmt + filter)

def create_stmt_insert(correo_electronico:str, nombre_categoria:str, tipo:str, valor:int, fecha_transaccion: date, descripcion: str):
    basic_stmt =f"""
                INSERT INTO transacciones(
                    id,
                    usuario_id,
                    categoria_id,
                    valor,
                    fecha_transaccion,
                    fecha_creacion,
                    descripcion)
                values(
                    (select max(id)+1 as id from transacciones),
                    (select id from usuario where correo_electronico = '{correo_electronico}' limit 1),
                    (select id from categoria where nombre_categoria = '{nombre_categoria}' and tipo = '{tipo}' limit 1),
                    {valor},
                    '{fecha_transaccion}',
                    CURRENT_TIMESTAMP,
                    '{descripcion}');

                """
    return sql.text(basic_stmt)


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
        result = conn.execute(create_stmt_select(f"WHERE tipo = '{tipo}' AND correo_electronico = '{correo_electronico}'")).fetchall()

    # Check if the result is empty
    if len(result) == 0:
        return resultado(f"No se encontraron {tipo}", [], 204, 0)

    print(f"{tipo}:{result}.")
    lista_transacciones = []
    total = 0

    for row in result:
        lista_transacciones.append(
            Transacciones(
                usuario = row[0],
                correo_electronico = row[1],
                valor = row[2],
                # Convertir a formato 'YYYY-MM' sin leading zeros
                fecha_transaccion = row[3].strftime("%Y-%m-%d").replace('-0', '-'),
                descripcion = row [4],
                nombre_categoria = row[5],
                tipo = row[6],
            )
        )
        total += row[2]
        
    print("total:", total)
    return resultado(f"Se encontraron {len(lista_transacciones)} {tipo}", lista_transacciones, 200, total)

"""
@app.get("/activos/{correo_electronico}/")
async def get_activos(correo_electronico: str, fecha: Optional[str] = None):
    print("correo_electronico: ", correo_electronico)
    print("fecha: ", fecha)
    filter_clause = f"AND fecha_transaccion = '{fecha}'" if fecha else ""
    return abc(correo_electronico, f"activos {filter_clause}")
"""

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

@app.post("/transacciones/", status_code=200)
async def add_transaccion(transaccion: Transacciones):
    print(transaccion)
    print(engine)

    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        sql = create_stmt_insert(transaccion.correo_electronico, transaccion.nombre_categoria, transaccion.tipo, transaccion.valor, transaccion.fecha_transaccion, transaccion.descripcion)
        result = conn.execute(sql)
        conn.commit()
    print("Este es el resultado:",result)

    # Agregar conexión y sql aquí

    return {"mensaje":"Nuevo  activo"}

# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8000)
