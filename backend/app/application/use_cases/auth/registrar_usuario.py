from app.core.security import (
    hash_password,
)

from app.domain.entities.usuario import (
    Usuario,
)

from app.domain.repositories.usuario_repository import (
    UsuarioRepository,
)


class RegistrarUsuarioUseCase:

    def __init__(
        self,
        repository: UsuarioRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        username: str,
        password: str,
        rol: str,
    ) -> Usuario:

        existente = (
            self.repository
            .obtener_por_username(
                username
            )
        )

        if existente:
            raise ValueError(
                "El usuario ya existe"
            )

        usuario = Usuario(
            id=None,
            username=username,
            password_hash=
                hash_password(
                    password
                ),
            rol=rol,
        )

        return self.repository.crear(
            usuario
        )