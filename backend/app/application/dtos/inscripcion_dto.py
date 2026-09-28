from datetime import date

from pydantic import BaseModel


class InscripcionBase(BaseModel):
    participante_id: int
    curso_id: int
    fecha_inscripcion: date
    estado: str = "CONFIRMADA"


class InscripcionCreate(InscripcionBase):
    pass


class InscripcionUpdate(InscripcionBase):
    pass


class InscripcionResponse(InscripcionBase):
    id: int

    model_config = {
        "from_attributes": True
    }