from typing import List

from app.domain.entities.instructor import Instructor
from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)


class ListarInstructoresUseCase:

    def __init__(
        self,
        repository: InstructorRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Instructor]:
        return self.repository.listar()