from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)


class EliminarInstructorUseCase:

    def __init__(
        self,
        repository: InstructorRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        instructor_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            instructor_id
        )

        if not eliminado:
            raise ValueError(
                "Instructor no encontrado"
            )