from dataclasses import dataclass
from typing import Optional
from pydantic import BaseModel


# Modelo usado para obtener transacciones
@dataclass
class resultado:
    result: str
    message: list
    status: int
    total: int


# Modelo de transaccion
class Transacciones(BaseModel):
    id: int
    usuario: str
    correo_electronico: str
    valor: int
    fecha_transaccion: str
    descripcion: Optional[str]
    nombre_categoria: str
    tipo: str
