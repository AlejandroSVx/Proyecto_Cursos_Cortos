from pydantic import BaseModel, Field


class AulaBase(BaseModel):
    nombre_aula: str = Field(
        min_length=2,
        max_length=100
    )

    capacidad: int = Field(
        gt=0
    )

    ubicacion: str = Field(
        min_length=2,
        max_length=150
    )

    estado_aula: str = "DISPONIBLE"


class AulaCreate(AulaBase):
    pass


class AulaUpdate(AulaBase):
    pass


class AulaResponse(AulaBase):
    id: int

    model_config = {
        "from_attributes": True
    }