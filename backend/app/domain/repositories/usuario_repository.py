from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.usuario import Usuario


class UsuarioRepository(ABC):

    @abstractmethod
    def crear(
        self,
        usuario: Usuario
    ) -> Usuario:
        pass

    @abstractmethod
    def obtener_por_username(
        self,
        username: str
    ) -> Optional[Usuario]:
        pass