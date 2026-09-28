from app.domain.entities.instructor import Instructor
from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)


class ActualizarInstructorUseCase:

    def __init__(
        self,
        repository: InstructorRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        instructor_id: int,
        instructor: Instructor
    ) -> Instructor:

        if instructor.estado_instructor not in [
            "ACTIVO",
            "INACTIVO",
        ]:
            raise ValueError(
                "Estado de instructor no válido"
            )

        actualizado = self.repository.actualizar(
            instructor_id,
            instructor
        )

        if not actualizado:
            raise ValueError(
                "Instructor no encontrado"
            )

        return actualizado