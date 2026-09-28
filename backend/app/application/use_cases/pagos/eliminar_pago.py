from app.domain.repositories.pago_repository import (
    PagoRepository,
)


class EliminarPagoUseCase:

    def __init__(
        self,
        repository: PagoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        pago_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            pago_id
        )

        if not eliminado:
            raise ValueError(
                "Pago no encontrado"
            )