from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Certificado:
    id: Optional[int]
    inscripcion_id: int
    codigo_certificado: str
    fecha_emision: date
    estado_certificado: str