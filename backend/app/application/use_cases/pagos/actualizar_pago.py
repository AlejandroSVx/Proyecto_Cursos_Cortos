from app.domain.entities.pago import Pago

from app.domain.repositories.pago_repository import (
    PagoRepository,
)


class ActualizarPagoUseCase:

    def __init__(
        self,
        pago_repository: PagoRepository,
    ):
        self.pago_repository = pago_repository

    def ejecutar(
        self,
        pago_id: int,
        pago: Pago
    ) -> Pago:

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

        actualizado = (
            self.pago_repository.actualizar(
                pago_id,
                pago
            )
        )

        if not actualizado:
            raise ValueError(
                "Pago no encontrado"
            )

        return actualizado