from sqlalchemy import (
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
)

from app.infrastructure.database.base import Base


class PagoModel(Base):
    __tablename__ = "pagos"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    inscripcion_id = Column(
        Integer,
        ForeignKey("inscripciones.id"),
        nullable=False,
    )

    fecha_pago = Column(
        Date,
        nullable=False,
    )

    monto = Column(
        Float,
        nullable=False,
    )

    metodo_pago = Column(
        String(30),
        nullable=False,
    )

    referencia_pago = Column(
        String(100),
        nullable=True,
    )

    estado_pago = Column(
        String(30),
        nullable=False,
        default="PENDIENTE",
    )