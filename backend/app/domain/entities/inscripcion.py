from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Inscripcion:
    id: Optional[int]
    participante_id: int
    curso_id: int
    fecha_inscripcion: date
    estado: str