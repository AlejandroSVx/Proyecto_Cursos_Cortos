from sqlalchemy import (
    Column,
    Date,
    Float,
    Integer,
    String,
)

from app.infrastructure.database.base import Base


class CursoModel(Base):
    __tablename__ = "cursos"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    nombre = Column(
        String(150),
        nullable=False,
    )

    tipo_actividad = Column(
        String(50),
        nullable=False,
    )

    fecha_inicio = Column(
        Date,
        nullable=False,
    )

    fecha_fin = Column(
        Date,
        nullable=False,
    )

    horario = Column(
        String(100),
        nullable=False,
    )

    costo = Column(
        Float,
        nullable=False,
        default=0,
    )

    cupo_minimo = Column(
        Integer,
        nullable=False,
    )

    cupo_maximo = Column(
        Integer,
        nullable=False,
    )

    estado = Column(
        String(30),
        nullable=False,
        default="ACTIVO",
    )