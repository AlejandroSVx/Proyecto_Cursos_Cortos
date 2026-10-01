from app.core.security import (
    crear_token,
    verificar_password,
)

from app.domain.repositories.usuario_repository import (
    UsuarioRepository,
)


class LoginUsuarioUseCase:

    def __init__(
        self,
        repository: UsuarioRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        username: str,
        password: str,
    ) -> str:

        usuario = (
            self.repository
            .obtener_por_username(
                username
            )
        )

        if not usuario:
            raise ValueError(
                "Credenciales inválidas"
            )

        if not verificar_password(
            password,
            usuario.password_hash,
        ):
            raise ValueError(
                "Credenciales inválidas"
            )

        return crear_token(
            usuario.username,
            usuario.rol,
        )