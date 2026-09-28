from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)


class EliminarInscripcionUseCase:

    def __init__(
        self,
        repository: InscripcionRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        inscripcion_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            inscripcion_id
        )

        if not eliminado:
            raise ValueError(
                "Inscripción no encontrada"
            )