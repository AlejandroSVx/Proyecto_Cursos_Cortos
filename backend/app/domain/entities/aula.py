from dataclasses import dataclass
from typing import Optional


@dataclass
class Aula:
    id: Optional[int]
    nombre_aula: str
    capacidad: int
    ubicacion: str
    estado_aula: str