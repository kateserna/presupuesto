from datetime import datetime
from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, sql, Column, Integer, String
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from uuid import uuid4

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

# Definición del modelo de datos para el usuario
class Usuario(BaseModel):
    id: int
    usuario: str  # TODO: usar Optional[str] cuando no se requiera el campo
    correo_electronico: str
    contrasena: str
    fecha_creacion: datetime

# Abrir la conexión a la base de datos PostgreSQL
#DATABASE_URL = "postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
DATABASE_URL = "postgresql://postgres:31109806@localhost/presupuestodb"
engine = create_engine(DATABASE_URL)
# Create the statement for the login query
stmt_login = sql.text("""
                      SELECT * FROM usuario
                      WHERE
                      usuario = :user_del_sqlalchemy
                      AND
                      contrasena = :pass_del_sqlalchemy
                      """)
stmt_activos = sql.text("SELECT * FROM transacciones")

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
async def get_usuarios():
    """
    Get all users from the database.
    """
    # Run a query to select all users
    return {"message": "Users retrieved successfully", "input": 200}

#result = tabla de transcciones
@app.get("/activos")
async def get_activos():
    with engine.connect() as conn:
        result = conn.execute(
            stmt_activos
        ).fetchall()
        print(result)
        return result



# endpoint para iniciar sesión, autenticar usuario con l nombre y contraseña proporconados
@app.post("/login")
# OAuth2PasswordRequestForm es un formulario que contiene los campos de nombre de usuario y contraseña
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    with engine.connect() as conn:
        result = conn.execute(
            stmt_login,
            {"user_del_sqlalchemy": form_data.username, "pass_del_sqlalchemy": form_data.password}
        ).fetchall()

        # Check if the result is empty
        if not result:
            return {"message": "Login failed", "status": 401}

        # Generate a session token (for simplicity, using a timestamp-based token)
        session_token = str(uuid4())

        # Optionally, you can store the session token in a database or cache for validation later
        # For example, you could create a Session table in your database and insert the token there
        # session = Session(token=session_token, user_id=result[0][0], created_at=datetime.now())
        # conn.execute(session.insert())
        # conn.commit()

        tokens.append({"user": form_data.username, "token": session_token})
        # Here you can also set the session token in a cookie or return it in the response
        # For example, you could set a cookie like this:
        # response.set_cookie(key="session_token", value=session_token, httponly=True)
        # Or return it in the response
        # response = JSONResponse(content={"message": "Login successful", "status": 200})
        # response.set_cookie(key="session_token", value=session_token, httponly=True)
        # return response

        # For now, we will just return it in the response
        # return {"message": "Login successful", "status": 200, "token": session_token}
        return {
            "access_token": session_token,
            "token_type": "bearer",
            "message": "Login successful",
            "status": 200}

# endpoint para cerrar sesión
@app.post("/logout")
async def logout(token: str):
    """
    Logout the user by invalidating the session token.
    """
    # Invalidate the session token (for simplicity, just remove it from the list)
    for t in tokens:
        if t["token"] == token:
            tokens.remove(t)
            return {"message": "Logout successful", "status": 200}

    return {"message": "Invalid token", "status": 401}

# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
