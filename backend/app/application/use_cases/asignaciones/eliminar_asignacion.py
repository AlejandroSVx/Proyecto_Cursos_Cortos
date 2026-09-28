from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)


class EliminarAsignacionUseCase:

    def __init__(
        self,
        repository: AsignacionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        asignacion_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            asignacion_id
        )

        if not eliminado:
            raise ValueError(
                "Asignación no encontrada"
            )