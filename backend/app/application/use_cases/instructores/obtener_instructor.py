from app.domain.entities.instructor import Instructor
from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)


class ObtenerInstructorUseCase:

    def __init__(
        self,
        repository: InstructorRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        instructor_id: int
    ) -> Instructor:

        instructor = (
            self.repository.obtener_por_id(
                instructor_id
            )
        )

        if not instructor:
            raise ValueError(
                "Instructor no encontrado"
            )

        return instructor