from app.domain.entities.asignacion import Asignacion
from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)


class ObtenerAsignacionUseCase:

    def __init__(
        self,
        repository: AsignacionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        asignacion_id: int
    ) -> Asignacion:

        asignacion = self.repository.obtener_por_id(
            asignacion_id
        )

        if not asignacion:
            raise ValueError(
                "Asignación no encontrada"
            )

        return asignacion