from typing import List

from app.domain.entities.asignacion import Asignacion
from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)


class ListarAsignacionesUseCase:

    def __init__(
        self,
        repository: AsignacionRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Asignacion]:
        return self.repository.listar()