from dataclasses import dataclass
from typing import Optional


@dataclass
class Instructor:
    id: Optional[int]
    numero_documento: str
    nombres: str
    apellidos: str
    especialidad: str
    telefono: str
    correo_electronico: str
    estado_instructor: str