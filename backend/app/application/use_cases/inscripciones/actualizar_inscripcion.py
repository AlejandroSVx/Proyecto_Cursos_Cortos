from app.domain.entities.inscripcion import Inscripcion
from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)


class ActualizarInscripcionUseCase:

    def __init__(
        self,
        repository: InscripcionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        inscripcion_id: int,
        inscripcion: Inscripcion
    ) -> Inscripcion:

        actualizada = self.repository.actualizar(
            inscripcion_id,
            inscripcion
        )

        if not actualizada:
            raise ValueError(
                "Inscripción no encontrada"
            )

        return actualizada