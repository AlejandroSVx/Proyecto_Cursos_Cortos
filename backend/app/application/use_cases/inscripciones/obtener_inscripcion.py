from app.domain.entities.inscripcion import Inscripcion
from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)


class ObtenerInscripcionUseCase:

    def __init__(
        self,
        repository: InscripcionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        inscripcion_id: int
    ) -> Inscripcion:

        inscripcion = (
            self.repository.obtener_por_id(
                inscripcion_id
            )
        )

        if not inscripcion:
            raise ValueError(
                "Inscripción no encontrada"
            )

        return inscripcion