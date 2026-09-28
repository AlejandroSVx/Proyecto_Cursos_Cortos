from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.asignacion import Asignacion


class AsignacionRepository(ABC):

    @abstractmethod
    def crear(
        self,
        asignacion: Asignacion
    ) -> Asignacion:
        pass

    @abstractmethod
    def listar(self) -> List[Asignacion]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        asignacion_id: int
    ) -> Optional[Asignacion]:
        pass

    @abstractmethod
    def actualizar(
        self,
        asignacion_id: int,
        asignacion: Asignacion
    ) -> Optional[Asignacion]:
        pass

    @abstractmethod
    def eliminar(
        self,
        asignacion_id: int
    ) -> bool:
        pass