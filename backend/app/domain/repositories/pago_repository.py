from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.pago import Pago


class PagoRepository(ABC):

    @abstractmethod
    def crear(
        self,
        pago: Pago
    ) -> Pago:
        pass

    @abstractmethod
    def listar(self) -> List[Pago]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        pago_id: int
    ) -> Optional[Pago]:
        pass

    @abstractmethod
    def actualizar(
        self,
        pago_id: int,
        pago: Pago
    ) -> Optional[Pago]:
        pass

    @abstractmethod
    def eliminar(
        self,
        pago_id: int
    ) -> bool:
        pass