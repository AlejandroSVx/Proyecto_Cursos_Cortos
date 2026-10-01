from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.asignacion import (
    Asignacion,
)


class AsignacionRepository(ABC):

    @abstractmethod
    def crear(
        self,
        asignacion: Asignacion
    ) -> Asignacion:
        pass

    @abstractmethod
    def listar(
        self
    ) -> List[Asignacion]:
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

    @abstractmethod
    def existe_conflicto_horario(
        self,
        curso_id: int,
        instructor_id: int,
        aula_id: int,
        excluir_asignacion_id: int | None = None,
    ) -> tuple[bool, str | None]:
        pass

    @abstractmethod
    def existe_asignacion_activa_curso(
        self,
        curso_id: int,
        excluir_asignacion_id: int | None = None,
    ) -> bool:
        pass