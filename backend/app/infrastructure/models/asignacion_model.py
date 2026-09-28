from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
)

from app.infrastructure.database.base import Base


class AsignacionModel(Base):
    __tablename__ = "asignaciones"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    curso_id = Column(
        Integer,
        ForeignKey("cursos.id"),
        nullable=False,
    )

    instructor_id = Column(
        Integer,
        ForeignKey("instructores.id"),
        nullable=False,
    )

    aula_id = Column(
        Integer,
        ForeignKey("aulas.id"),
        nullable=False,
    )

    fecha_asignacion = Column(
        Date,
        nullable=False,
    )

    estado_asignacion = Column(
        String(30),
        nullable=False,
        default="ACTIVA",
    )