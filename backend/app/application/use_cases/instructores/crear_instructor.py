from app.domain.entities.instructor import Instructor
from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)


class CrearInstructorUseCase:

    def __init__(
        self,
        repository: InstructorRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        instructor: Instructor
    ) -> Instructor:

        existente = (
            self.repository.obtener_por_documento(
                instructor.numero_documento
            )
        )

        if existente:
            raise ValueError(
                "Ya existe un instructor con ese documento"
            )

        if instructor.estado_instructor not in [
            "ACTIVO",
            "INACTIVO",
        ]:
            raise ValueError(
                "Estado de instructor no válido"
            )

        return self.repository.crear(
            instructor
        )