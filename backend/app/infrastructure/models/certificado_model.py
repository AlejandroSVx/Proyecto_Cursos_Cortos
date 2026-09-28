from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
)

from app.infrastructure.database.base import Base


class CertificadoModel(Base):
    __tablename__ = "certificados"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    inscripcion_id = Column(
        Integer,
        ForeignKey("inscripciones.id"),
        nullable=False,
        unique=True,
    )

    codigo_certificado = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    fecha_emision = Column(
        Date,
        nullable=False,
    )

    estado_certificado = Column(
        String(30),
        nullable=False,
        default="GENERADO",
    )