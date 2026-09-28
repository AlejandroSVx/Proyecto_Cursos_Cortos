from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Curso:
    id: Optional[int]
    nombre: str
    tipo_actividad: str
    fecha_inicio: date
    fecha_fin: date
    horario: str
    costo: float
    cupo_minimo: int
    cupo_maximo: int
    estado: str