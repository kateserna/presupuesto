from datetime import datetime
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, sql, Column, Integer, String
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# Habilitar CORS
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:4200",  # Example frontend URL
    "http://127.0.0.1:4200",  # Example frontend URL
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

class Usuario(BaseModel):
    id: int
    usuario: str  # TODO: usar Optional[str] cuando no se requiera el campo
    correo_electronico: str
    contrasena: str
    fecha_creacion: datetime


# Abrir la conexión a la base de datos PostgreSQL
DATABASE_URL = "postgresql://postgres:31109806@localhost/presupuestodb"
engine = create_engine(DATABASE_URL)
stmt_login = sql.text("SELECT * FROM usuario WHERE usuario = :user_del_sqlalchemy and contrasena = :pass_del_sqlalchemy")

"""
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

# endpoint de prueba
@app.get("/usuarios")
def get_usuarios():
    """
    Get all users from the database.
    """
    # Run a query to select all users
    return {"message": "Users retrieved successfully", "input": 200}

# endpoint para iniciar sesión
@app.post("/login")
# OAuth2PasswordRequestForm es un formulario que contiene los campos de nombre de usuario y contraseña
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticate user based on the provided username and password.
    """

    with engine.connect() as conn:
        result = conn.execute(
            stmt_login,
            {"user_del_sqlalchemy": form_data.username, "pass_del_sqlalchemy": form_data.password}
        ).fetchall()

        usuarios = [
            Usuario(
                id=row[0],
                usuario=row[1],
                correo_electronico=row[2],
                contrasena=row[3],
                fecha_creacion=row[4]
            )
            for row in result
        ]

        # Check if the result is empty
        if not usuarios:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {"message": "Login successful", "user": usuarios[0]}

# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
