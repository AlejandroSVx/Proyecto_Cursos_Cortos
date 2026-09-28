from datetime import date

from pydantic import BaseModel, Field


class CertificadoBase(BaseModel):
    inscripcion_id: int

    codigo_certificado: str = Field(
        min_length=3,
        max_length=100
    )

    fecha_emision: date

    estado_certificado: str = "GENERADO"


class CertificadoCreate(CertificadoBase):
    pass


class CertificadoUpdate(CertificadoBase):
    pass


class CertificadoResponse(CertificadoBase):
    id: int

    model_config = {
        "from_attributes": True
    }