from typing import Optional

from sqlalchemy.orm import Session

from app.domain.entities.usuario import Usuario
from app.domain.repositories.usuario_repository import (
    UsuarioRepository,
)

from app.infrastructure.models.usuario_model import (
    UsuarioModel,
)


class UsuarioRepositoryImpl(
    UsuarioRepository
):

    def __init__(
        self,
        db: Session
    ):
        self.db = db

    def crear(
        self,
        usuario: Usuario
    ) -> Usuario:

        modelo = UsuarioModel(
            username=usuario.username,
            password_hash=usuario.password_hash,
            rol=usuario.rol,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def obtener_por_username(
        self,
        username: str
    ) -> Optional[Usuario]:

        modelo = (
            self.db
            .query(UsuarioModel)
            .filter(
                UsuarioModel.username
                == username
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    @staticmethod
    def _to_entity(
        modelo: UsuarioModel
    ) -> Usuario:

        return Usuario(
            id=modelo.id,
            username=modelo.username,
            password_hash=modelo.password_hash,
            rol=modelo.rol,
        )