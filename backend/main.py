from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run

from app.conexion import engine
from app.queries import create_stmt_insert, create_stmt_delete, get_transaccion
from app.models import Transacciones


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

"""
@app.get("/activos/{correo_electronico}/")
async def get_activos(correo_electronico: str, fecha: Optional[str] = None):
    print("correo_electronico: ", correo_electronico)
    print("fecha: ", fecha)
    filter_clause = f"AND fecha_transaccion = '{fecha}'" if fecha else ""
    return get_transaccion(correo_electronico, f"activos {filter_clause}")
"""

@app.get("/activos/{correo_electronico}")
async def get_activos(correo_electronico: str):
    return get_transaccion(correo_electronico, "activos")

@app.get("/pasivos/{correo_electronico}")
async def get_pasivos(correo_electronico: str):
    return get_transaccion(correo_electronico, "pasivos")

@app.get("/ingresos/{correo_electronico}")
async def get_ingresos(correo_electronico: str):
    return get_transaccion(correo_electronico, "ingresos")

@app.get("/egresos/{correo_electronico}")
async def get_egresos(correo_electronico: str):
    return get_transaccion(correo_electronico, "egresos")

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
    return {"mensaje":"Nuevo  activo"}

@app.delete("/transacciones/{id_transaccion}", status_code=200)
async def delete_transaccion(id_transaccion: int):
    print("id_transaccion:", id_transaccion)
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        sql = create_stmt_delete(id_transaccion)
        result = conn.execute(sql)
        conn.commit()
    print("Este es el resultado:",result)
    return {"mensaje":"Transacción eliminada"}


# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8000)
