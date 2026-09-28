from app.domain.entities.pago import Pago
from app.domain.repositories.pago_repository import (
    PagoRepository,
)
from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)


class CrearPagoUseCase:

    def __init__(
        self,
        pago_repository: PagoRepository,
        inscripcion_repository: InscripcionRepository,
    ):
        self.pago_repository = pago_repository
        self.inscripcion_repository = (
            inscripcion_repository
        )

    def ejecutar(
        self,
        pago: Pago
    ) -> Pago:

        inscripcion = (
            self.inscripcion_repository.obtener_por_id(
                pago.inscripcion_id
            )
        )

        if not inscripcion:
            raise ValueError(
                "Inscripción no encontrada"
            )

        metodos_validos = [
            "EFECTIVO",
            "TRANSFERENCIA",
            "DEPOSITO",
            "OTRO",
        ]

        if pago.metodo_pago not in metodos_validos:
            raise ValueError(
                "Método de pago no válido"
            )

        estados_validos = [
            "PENDIENTE",
            "CONFIRMADO",
            "RECHAZADO",
        ]

        if pago.estado_pago not in estados_validos:
            raise ValueError(
                "Estado de pago no válido"
            )

        return self.pago_repository.crear(
            pago
        )