from fastapi import (
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    OAuth2PasswordBearer,
)

from jose import (
    JWTError,
    jwt,
)

from sqlalchemy.orm import Session

from app.infrastructure.database.session import (
    SessionLocal,
)

from app.infrastructure.models.usuario_model import (
    UsuarioModel,
)

from app.core.security import (
    ALGORITHM,
    SECRET_KEY,
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(
        oauth2_scheme
    ),
    db: Session = Depends(
        get_db
    ),
):
    credentials_exception = HTTPException(
        status_code=
            status.HTTP_401_UNAUTHORIZED,
        detail=(
            "No se pudieron validar "
            "las credenciales"
        ),
        headers={
            "WWW-Authenticate":
                "Bearer"
        },
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get(
            "sub"
        )

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    usuario = (
        db.query(UsuarioModel)
        .filter(
            UsuarioModel.username
            == username
        )
        .first()
    )

    if usuario is None:
        raise credentials_exception

    return usuario