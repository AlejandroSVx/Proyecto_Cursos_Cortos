from abc import ABC, abstractmethod
from typing import List, Optional

from app.domain.entities.certificado import Certificado


class CertificadoRepository(ABC):

    @abstractmethod
    def crear(
        self,
        certificado: Certificado
    ) -> Certificado:
        pass

    @abstractmethod
    def listar(self) -> List[Certificado]:
        pass

    @abstractmethod
    def obtener_por_id(
        self,
        certificado_id: int
    ) -> Optional[Certificado]:
        pass

    @abstractmethod
    def obtener_por_inscripcion(
        self,
        inscripcion_id: int
    ) -> Optional[Certificado]:
        pass

    @abstractmethod
    def actualizar(
        self,
        certificado_id: int,
        certificado: Certificado
    ) -> Optional[Certificado]:
        pass

    @abstractmethod
    def eliminar(
        self,
        certificado_id: int
    ) -> bool:
        pass