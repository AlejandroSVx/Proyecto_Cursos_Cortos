from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class Pago:
    id: Optional[int]
    inscripcion_id: int
    fecha_pago: date
    monto: float
    metodo_pago: str
    referencia_pago: Optional[str]
    estado_pago: str