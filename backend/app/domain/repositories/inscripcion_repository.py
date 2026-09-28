from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.inscripcion import Inscripcion


class InscripcionRepository(ABC):

    @abstractmethod
    def crear(
        self,
        inscripcion: Inscripcion
    ) -> Inscripcion:
        pass

    @abstractmethod
    def listar(self) -> List[Inscripcion]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        inscripcion_id: int
    ) -> Optional[Inscripcion]:
        pass

    @abstractmethod
    def existe_inscripcion_activa(
        self,
        participante_id: int,
        curso_id: int
    ) -> bool:
        pass

    @abstractmethod
    def contar_inscripciones_activas(
        self,
        curso_id: int
    ) -> int:
        pass

    @abstractmethod
    def actualizar(
        self,
        inscripcion_id: int,
        inscripcion: Inscripcion
    ) -> Optional[Inscripcion]:
        pass

    @abstractmethod
    def eliminar(
        self,
        inscripcion_id: int
    ) -> bool:
        pass