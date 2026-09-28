from app.domain.entities.asignacion import Asignacion
from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)


class ActualizarAsignacionUseCase:

    def __init__(
        self,
        repository: AsignacionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        asignacion_id: int,
        asignacion: Asignacion
    ) -> Asignacion:

        actualizada = self.repository.actualizar(
            asignacion_id,
            asignacion
        )

        if not actualizada:
            raise ValueError(
                "Asignación no encontrada"
            )

        return actualizada