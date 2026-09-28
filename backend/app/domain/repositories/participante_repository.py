from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.participante import Participante


class ParticipanteRepository(ABC):

    @abstractmethod
    def crear(
        self,
        participante: Participante
    ) -> Participante:
        pass

    @abstractmethod
    def listar(self) -> List[Participante]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        participante_id: int
    ) -> Optional[Participante]:
        pass

    @abstractmethod
    def obtener_por_documento(
        self,
        numero_documento: str
    ) -> Optional[Participante]:
        pass

    @abstractmethod
    def actualizar(
        self,
        participante_id: int,
        participante: Participante
    ) -> Optional[Participante]:
        pass

    @abstractmethod
    def eliminar(
        self,
        participante_id: int
    ) -> bool:
        pass