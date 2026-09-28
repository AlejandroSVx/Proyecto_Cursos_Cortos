from app.domain.entities.pago import Pago
from app.domain.repositories.pago_repository import (
    PagoRepository,
)


class ActualizarPagoUseCase:

    def __init__(
        self,
        repository: PagoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        pago_id: int,
        pago: Pago
    ) -> Pago:

        estados_validos = [
            "PENDIENTE",
            "CONFIRMADO",
            "RECHAZADO",
        ]

        if pago.estado_pago not in estados_validos:
            raise ValueError(
                "Estado de pago no válido"
            )

        actualizado = self.repository.actualizar(
            pago_id,
            pago
        )

        if not actualizado:
            raise ValueError(
                "Pago no encontrado"
            )

        return actualizado