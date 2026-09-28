from app.domain.entities.pago import Pago
from app.domain.repositories.pago_repository import (
    PagoRepository,
)


class ObtenerPagoUseCase:

    def __init__(
        self,
        repository: PagoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        pago_id: int
    ) -> Pago:

        pago = self.repository.obtener_por_id(
            pago_id
        )

        if not pago:
            raise ValueError(
                "Pago no encontrado"
            )

        return pago