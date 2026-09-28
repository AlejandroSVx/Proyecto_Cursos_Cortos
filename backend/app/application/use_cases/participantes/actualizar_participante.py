from app.domain.entities.participante import Participante
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)


class ActualizarParticipanteUseCase:

    def __init__(
        self,
        repository: ParticipanteRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        participante_id: int,
        participante: Participante
    ) -> Participante:

        actualizado = self.repository.actualizar(
            participante_id,
            participante
        )

        if not actualizado:
            raise ValueError(
                "Participante no encontrado"
            )

        return actualizado