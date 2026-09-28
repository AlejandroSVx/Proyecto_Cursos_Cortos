from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.instructor import Instructor


class InstructorRepository(ABC):

    @abstractmethod
    def crear(
        self,
        instructor: Instructor
    ) -> Instructor:
        pass

    @abstractmethod
    def listar(self) -> List[Instructor]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        instructor_id: int
    ) -> Optional[Instructor]:
        pass

    @abstractmethod
    def obtener_por_documento(
        self,
        numero_documento: str
    ) -> Optional[Instructor]:
        pass

    @abstractmethod
    def actualizar(
        self,
        instructor_id: int,
        instructor: Instructor
    ) -> Optional[Instructor]:
        pass

    @abstractmethod
    def eliminar(
        self,
        instructor_id: int
    ) -> bool:
        pass