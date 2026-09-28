from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)


class EliminarParticipanteUseCase:

    def __init__(
        self,
        repository: ParticipanteRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        participante_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            participante_id
        )

        if not eliminado:
            raise ValueError(
                "Participante no encontrado"
            )