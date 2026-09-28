from sqlalchemy import Column, Integer, String

from app.infrastructure.database.base import Base


class AulaModel(Base):
    __tablename__ = "aulas"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    nombre_aula = Column(
        String(100),
        nullable=False,
        unique=True,
    )

    capacidad = Column(
        Integer,
        nullable=False,
    )

    ubicacion = Column(
        String(150),
        nullable=False,
    )

    estado_aula = Column(
        String(30),
        nullable=False,
        default="DISPONIBLE",
    )