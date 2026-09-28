from typing import List

from app.domain.entities.inscripcion import Inscripcion
from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)


class ListarInscripcionesUseCase:

    def __init__(
        self,
        repository: InscripcionRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Inscripcion]:
        return self.repository.listar()