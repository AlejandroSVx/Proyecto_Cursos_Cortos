from datetime import date

from pydantic import BaseModel


class AsignacionBase(BaseModel):
    curso_id: int
    instructor_id: int
    aula_id: int
    fecha_asignacion: date
    estado_asignacion: str = "ACTIVA"


class AsignacionCreate(AsignacionBase):
    pass


class AsignacionUpdate(AsignacionBase):
    pass


class AsignacionResponse(AsignacionBase):
    id: int

    model_config = {
        "from_attributes": True
    }