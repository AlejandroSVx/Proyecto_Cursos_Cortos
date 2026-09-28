from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
)

from app.infrastructure.database.base import Base


class InscripcionModel(Base):
    __tablename__ = "inscripciones"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    participante_id = Column(
        Integer,
        ForeignKey("participantes.id"),
        nullable=False,
    )

    curso_id = Column(
        Integer,
        ForeignKey("cursos.id"),
        nullable=False,
    )

    fecha_inscripcion = Column(
        Date,
        nullable=False,
    )

    estado = Column(
        String(30),
        nullable=False,
        default="CONFIRMADA",
    )