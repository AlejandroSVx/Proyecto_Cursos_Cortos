from typing import List

from app.domain.entities.aula import Aula
from app.domain.repositories.aula_repository import AulaRepository


class ListarAulasUseCase:

    def __init__(
        self,
        repository: AulaRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Aula]:
        return self.repository.listar()