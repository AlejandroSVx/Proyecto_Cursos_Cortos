from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.pago import Pago
from app.domain.repositories.pago_repository import (
    PagoRepository,
)
from app.infrastructure.models.pago_model import (
    PagoModel,
)


class PagoRepositoryImpl(
    PagoRepository
):

    def __init__(self, db: Session):
        self.db = db

    def crear(
        self,
        pago: Pago
    ) -> Pago:

        modelo = PagoModel(
            inscripcion_id=pago.inscripcion_id,
            fecha_pago=pago.fecha_pago,
            monto=pago.monto,
            metodo_pago=pago.metodo_pago,
            referencia_pago=pago.referencia_pago,
            estado_pago=pago.estado_pago,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(self) -> List[Pago]:

        modelos = (
            self.db
            .query(PagoModel)
            .order_by(PagoModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        pago_id: int
    ) -> Optional[Pago]:

        modelo = (
            self.db
            .query(PagoModel)
            .filter(
                PagoModel.id == pago_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        pago_id: int,
        pago: Pago
    ) -> Optional[Pago]:

        modelo = (
            self.db
            .query(PagoModel)
            .filter(
                PagoModel.id == pago_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.inscripcion_id = pago.inscripcion_id
        modelo.fecha_pago = pago.fecha_pago
        modelo.monto = pago.monto
        modelo.metodo_pago = pago.metodo_pago
        modelo.referencia_pago = pago.referencia_pago
        modelo.estado_pago = pago.estado_pago

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        pago_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(PagoModel)
            .filter(
                PagoModel.id == pago_id
            )
            .first()
        )

        if not modelo:
            return False

        self.db.delete(modelo)
        self.db.commit()

        return True

    @staticmethod
    def _to_entity(
        modelo: PagoModel
    ) -> Pago:

        return Pago(
            id=modelo.id,
            inscripcion_id=modelo.inscripcion_id,
            fecha_pago=modelo.fecha_pago,
            monto=modelo.monto,
            metodo_pago=modelo.metodo_pago,
            referencia_pago=modelo.referencia_pago,
            estado_pago=modelo.estado_pago,
        )