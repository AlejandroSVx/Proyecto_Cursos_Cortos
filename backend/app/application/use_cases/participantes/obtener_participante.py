from app.domain.entities.participante import Participante
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)


class ObtenerParticipanteUseCase:

    def __init__(
        self,
        repository: ParticipanteRepository
    ):
        self.repository = repository


    def ejecutar(
        self,
        participante_id: int
    ) -> Participante:

        participante = (
            self.repository.obtener_por_id(
                participante_id
            )
        )

        if not participante:
            raise ValueError(
                "Participante no encontrado"
            )

        return participante