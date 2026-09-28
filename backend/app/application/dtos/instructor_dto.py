from pydantic import BaseModel, EmailStr, Field


class InstructorBase(BaseModel):
    numero_documento: str = Field(
        min_length=3,
        max_length=30
    )

    nombres: str = Field(
        min_length=2,
        max_length=100
    )

    apellidos: str = Field(
        min_length=2,
        max_length=100
    )

    especialidad: str = Field(
        min_length=2,
        max_length=150
    )

    telefono: str = Field(
        min_length=5,
        max_length=30
    )

    correo_electronico: EmailStr

    estado_instructor: str = "ACTIVO"


class InstructorCreate(InstructorBase):
    pass


class InstructorUpdate(InstructorBase):
    pass


class InstructorResponse(InstructorBase):
    id: int

    model_config = {
        "from_attributes": True
    }