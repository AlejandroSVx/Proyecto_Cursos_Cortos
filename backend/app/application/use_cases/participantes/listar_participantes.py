from typing import List

from app.domain.entities.participante import Participante
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)


class ListarParticipantesUseCase:

    def __init__(
        self,
        repository: ParticipanteRepository
    ):
        self.repository = repository


    def ejecutar(self) -> List[Participante]:
        return self.repository.listar()