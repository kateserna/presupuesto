from datetime import datetime
from typing import Optional

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

@app.get("/activos/{correo_electronico}")
async def get_activos(correo_electronico: str):
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt(f"WHERE tipo = 'activos' AND correo_electronico = '{correo_electronico}'")).fetchall()
        activos = []
        for row in result:
            activos.append(
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
        
        # Check if the result is empty
        if not activos:
            return {"message": "No se encontraron activos"}
        print(correo_electronico)
        return {"message": activos}

@app.get("/pasivos/{correo_electronico}")
async def get_pasivos(correo_electronico: str):
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt(f"WHERE tipo = 'pasivos' AND correo_electronico = '{correo_electronico}'")).fetchall()
        pasivos = []
        for row in result:
            pasivos.append(
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
        
        # Check if the result is empty
        if not pasivos:
            return {"message": "No se encontraron pasivos"}
        print(correo_electronico)
        return {"message": pasivos}

@app.get("/ingresos/{correo_electronico}")
async def get_ingresos(correo_electronico: str):
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt(f"WHERE tipo = 'ingresos' AND correo_electronico = '{correo_electronico}'")).fetchall()
        ingresos = []
        for row in result:
            ingresos.append(
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
        
        # Check if the result is empty
        if not ingresos:
            return {"message": "No se encontraron ingresos"}
        print(correo_electronico)
        return {"message": ingresos}

@app.get("/egresos/{correo_electronico}")
async def get_egresos(correo_electronico: str):
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt(f"WHERE tipo = 'egresos' AND correo_electronico = '{correo_electronico}'")).fetchall()
        egresos = []
        for row in result:
            egresos.append(
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
        
        # Check if the result is empty
        if not egresos:
            return {"message": "No se encontraron egresos"}
        print(correo_electronico)
        return {"message": egresos}

# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8000)
