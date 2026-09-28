from typing import List

from app.domain.entities.pago import Pago
from app.domain.repositories.pago_repository import (
    PagoRepository,
)


class ListarPagosUseCase:

    def __init__(
        self,
        repository: PagoRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Pago]:
        return self.repository.listar()