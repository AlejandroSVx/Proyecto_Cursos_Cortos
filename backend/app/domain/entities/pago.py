class Pago:

    def __init__(
        self,
        id: int | None,
        inscripcion_id: int,
        fecha_pago,
        monto: float,
        metodo_pago: str,
        referencia_pago: str | None,
        estado_pago: str,
    ):
        self.id = id
        self.inscripcion_id = inscripcion_id
        self.fecha_pago = fecha_pago
        self.monto = monto
        self.metodo_pago = metodo_pago
        self.referencia_pago = referencia_pago
        self.estado_pago = estado_pago