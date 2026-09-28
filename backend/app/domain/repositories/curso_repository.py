from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.curso import Curso


class CursoRepository(ABC):

    @abstractmethod
    def crear(self, curso: Curso) -> Curso:
        pass

    @abstractmethod
    def listar(self) -> List[Curso]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        curso_id: int
    ) -> Optional[Curso]:
        pass

    @abstractmethod
    def actualizar(
        self,
        curso_id: int,
        curso: Curso
    ) -> Optional[Curso]:
        pass

    @abstractmethod
    def eliminar(
        self,
        curso_id: int
    ) -> bool:
        pass