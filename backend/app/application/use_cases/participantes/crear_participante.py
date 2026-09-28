from app.domain.entities.participante import Participante
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)


class CrearParticipanteUseCase:

    def __init__(
        self,
        repository: ParticipanteRepository
    ):
        self.repository = repository


    def ejecutar(
        self,
        participante: Participante
    ) -> Participante:

        existente = (
            self.repository.obtener_por_documento(
                participante.numero_documento
            )
        )

        if existente:
            raise ValueError(
                "Ya existe un participante con ese documento"
            )

        return self.repository.crear(
            participante
        )