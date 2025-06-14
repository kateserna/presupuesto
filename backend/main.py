from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uvicorn import run

from app.queries import _get_transacciones, get_transaccion, _add_transaccion, _delete_transaccion
from app.models import Transacciones


# Habilitar CORS
origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "https://staging.d19ueo6r87db2f.amplifyapp.com",  # Este es el dominio del frontend en AWS Amplify
    "https://b277-18-223-99-46.ngrok-free.app"
] 


app = FastAPI()

# Cors middleware para manejar intercambio de datos entre frontend y backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "*"
    ],
    allow_headers=["*"],
)


# @app.get("/transacciones")
# async def get_transacciones():
#     return _get_transacciones()


@app.get("/api/activos/{correo_electronico}")
async def get_activos(correo_electronico: str):
    return get_transaccion(correo_electronico, "activos")


@app.get("/api/pasivos/{correo_electronico}")
async def get_pasivos(correo_electronico: str):
    print("backend activos correo:", correo_electronico)
    print("backend activos:", get_transaccion(correo_electronico, "pasivos"))
    
    return get_transaccion(correo_electronico, "pasivos")


@app.get("/api/ingresos/{correo_electronico}")
async def get_ingresos(correo_electronico: str):
    return get_transaccion(correo_electronico, "ingresos")


@app.get("/api/egresos/{correo_electronico}")
async def get_egresos(correo_electronico: str):
    return get_transaccion(correo_electronico, "egresos")


@app.post("/api/transacciones/", status_code=200)
async def add_transaccion(transaccion: Transacciones) -> dict:
    return _add_transaccion(transaccion)


@app.delete("/api/transacciones/{id_transaccion}", status_code=200)
async def delete_transaccion(id_transaccion: int):
    return _delete_transaccion(id_transaccion)


# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    run(app, host="0.0.0.0", port=8000)
