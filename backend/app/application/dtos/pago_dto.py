from datetime import date
from typing import Optional

from pydantic import BaseModel


class PagoBase(BaseModel):
    inscripcion_id: int
    fecha_pago: date
    monto: float
    metodo_pago: str
    referencia_pago: Optional[str] = None
    estado_pago: str = "PENDIENTE"


class PagoCreate(PagoBase):
    pass


class PagoUpdate(PagoBase):
    pass


class PagoResponse(PagoBase):
    id: int

    model_config = {
        "from_attributes": True
    }