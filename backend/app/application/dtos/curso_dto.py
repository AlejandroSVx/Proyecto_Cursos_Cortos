from datetime import date

from pydantic import BaseModel, Field


class CursoBase(BaseModel):
    nombre: str
    tipo_actividad: str
    fecha_inicio: date
    fecha_fin: date
    horario: str
    costo: float = Field(ge=0)
    cupo_minimo: int = Field(ge=0)
    cupo_maximo: int = Field(gt=0)
    estado: str = "ACTIVO"


class CursoCreate(CursoBase):
    pass


class CursoUpdate(CursoBase):
    pass


class CursoResponse(CursoBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class CursoConInstructorResponse(BaseModel):
    curso_id: int
    curso: str
    horario: str

    instructor_id: int
    instructor: str

    aula_id: int
    aula: str

    estado_asignacion: str