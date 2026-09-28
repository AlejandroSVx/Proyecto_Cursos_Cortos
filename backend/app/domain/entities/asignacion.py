from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Asignacion:
    id: Optional[int]
    curso_id: int
    instructor_id: int
    aula_id: int
    fecha_asignacion: date
    estado_asignacion: str