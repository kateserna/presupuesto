from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, DateTime, text
import uvicorn

class Usuario(BaseModel):
    id: int
    usuario: str  # TODO: usar Optional[str] cuando no se requiera el campo
    correo_electronico: str
    contrasena: str
    fecha_creacion: datetime


# Open the PostgreSQL database connection
DATABASE_URL = "postgresql://postgres:31109806@localhost/presupuestodb"
engine = create_engine(DATABASE_URL)


with engine.connect() as connection:
    sql_query = "SELECT * FROM usuario"
    result = connection.execute(text(sql_query))
    
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


app = FastAPI()

@app.get("/usuarios", response_model=List[Usuario])
def get_usuarios():
    """
    Get all users from the database.
    """
    # Run a query to select all users
    return usuarios


# Run the FastAPI application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
