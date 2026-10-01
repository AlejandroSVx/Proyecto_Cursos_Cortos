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
            self.inscripcion_repository
            .obtener_por_id(
                pago.inscripcion_id
            )
        )

        if not inscripcion:
            raise ValueError(
                "Inscripción no encontrada"
            )

        if pago.monto <= 0:
            raise ValueError(
                "El monto del pago debe ser mayor a cero"
            )

        metodos_validos = [
            "EFECTIVO",
            "TRANSFERENCIA",
            "QR",
        ]

        pago.metodo_pago = (
            pago.metodo_pago
            .strip()
            .upper()
        )

        if pago.metodo_pago not in metodos_validos:
            raise ValueError(
                "Método de pago no válido"
            )

        referencia_invalida = (
            pago.referencia_pago is None
            or str(
                pago.referencia_pago
            ).strip().lower()
            in [
                "",
                "null",
                "none",
            ]
        )

        if (
            pago.metodo_pago
            in [
                "TRANSFERENCIA",
                "QR",
            ]
            and referencia_invalida
        ):
            raise ValueError(
                "La referencia de pago es obligatoria "
                "para pagos por transferencia o QR"
            )

        if pago.metodo_pago == "EFECTIVO":
            pago.referencia_pago = None

        estados_validos = [
            "PENDIENTE",
            "CONFIRMADO",
            "RECHAZADO",
        ]

        pago.estado_pago = (
            pago.estado_pago
            .strip()
            .upper()
        )

        if pago.estado_pago not in estados_validos:
            raise ValueError(
                "Estado de pago no válido"
            )

        return self.pago_repository.crear(
            pago
        )