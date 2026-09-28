from sqlalchemy import Column, Integer, String

from app.infrastructure.database.base import Base


class ParticipanteModel(Base):
    __tablename__ = "participantes"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    numero_documento = Column(
        String(30),
        nullable=False,
        unique=True,
        index=True,
    )

    nombres = Column(
        String(100),
        nullable=False,
    )

    apellidos = Column(
        String(100),
        nullable=False,
    )

    telefono = Column(
        String(30),
        nullable=False,
    )

    correo_electronico = Column(
        String(150),
        nullable=False,
        unique=True,
        index=True,
    )