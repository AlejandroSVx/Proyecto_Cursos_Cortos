from datetime import (
    datetime,
    timedelta,
    timezone,
)

from jose import jwt

from passlib.context import CryptContext


SECRET_KEY = (
    "proyecto_cursos_cortos_2026"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(
    password: str
) -> str:

    return pwd_context.hash(
        password
    )


def verificar_password(
    password: str,
    password_hash: str
) -> bool:

    return pwd_context.verify(
        password,
        password_hash
    )


def crear_token(
    username: str,
    rol: str
) -> str:

    expiracion = (
        datetime.now(
            timezone.utc
        )
        + timedelta(
            minutes=
            ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    payload = {
        "sub": username,
        "rol": rol,
        "exp": expiracion,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )