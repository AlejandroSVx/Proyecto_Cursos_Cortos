from typing import List

from app.domain.entities.curso import Curso
from app.domain.repositories.curso_repository import CursoRepository


class ListarCursosUseCase:

    def __init__(
        self,
        repository: CursoRepository
    ):
        self.repository = repository


    def ejecutar(self) -> List[Curso]:
        return self.repository.listar()