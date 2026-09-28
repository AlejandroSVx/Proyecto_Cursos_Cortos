from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.aula import Aula


class AulaRepository(ABC):

    @abstractmethod
    def crear(self, aula: Aula) -> Aula:
        pass

    @abstractmethod
    def listar(self) -> List[Aula]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        aula_id: int
    ) -> Optional[Aula]:
        pass

    @abstractmethod
    def actualizar(
        self,
        aula_id: int,
        aula: Aula
    ) -> Optional[Aula]:
        pass

    @abstractmethod
    def eliminar(
        self,
        aula_id: int
    ) -> bool:
        pass