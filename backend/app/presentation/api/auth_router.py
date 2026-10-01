from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    OAuth2PasswordRequestForm,
)

from sqlalchemy.orm import Session

from app.application.dtos.auth_dto import (
    TokenResponse,
    UsuarioCreate,
    UsuarioResponse,
)

from app.application.use_cases.auth.registrar_usuario import (
    RegistrarUsuarioUseCase,
)

from app.application.use_cases.auth.login_usuario import (
    LoginUsuarioUseCase,
)

from app.core.dependencies import get_db

from app.infrastructure.repositories.usuario_repository_impl import (
    UsuarioRepositoryImpl,
)


router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"],
)


@router.post(
    "/register",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def registrar(
    data: UsuarioCreate,
    db: Session = Depends(get_db),
):

    try:
        repository = (
            UsuarioRepositoryImpl(db)
        )

        use_case = (
            RegistrarUsuarioUseCase(
                repository
            )
        )

        return use_case.ejecutar(
            data.username,
            data.password,
            data.rol,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    form_data:
        OAuth2PasswordRequestForm
        = Depends(),
    db: Session = Depends(get_db),
):

    try:
        repository = (
            UsuarioRepositoryImpl(db)
        )

        use_case = LoginUsuarioUseCase(
            repository
        )

        token = use_case.ejecutar(
            form_data.username,
            form_data.password,
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
            headers={
                "WWW-Authenticate":
                    "Bearer"
            },
        )