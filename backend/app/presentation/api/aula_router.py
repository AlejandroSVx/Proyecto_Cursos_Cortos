from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.application.dtos.aula_dto import (
    AulaCreate,
    AulaResponse,
    AulaUpdate,
)

from app.application.use_cases.aulas.crear_aula import CrearAulaUseCase
from app.application.use_cases.aulas.listar_aulas import ListarAulasUseCase
from app.application.use_cases.aulas.obtener_aula import ObtenerAulaUseCase
from app.application.use_cases.aulas.actualizar_aula import ActualizarAulaUseCase
from app.application.use_cases.aulas.eliminar_aula import EliminarAulaUseCase

from app.core.dependencies import (
    get_current_user,
    get_db,
)

from app.domain.entities.aula import Aula

from app.infrastructure.repositories.aula_repository_impl import (
    AulaRepositoryImpl,
)


router = APIRouter(
    prefix="/aulas",
    tags=["Aulas"],
    dependencies=[
        Depends(get_current_user)
    ],
)


def get_repository(
    db: Session = Depends(get_db)
):
    return AulaRepositoryImpl(db)


@router.post(
    "/",
    response_model=AulaResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_aula(
    data: AulaCreate,
    repository=Depends(get_repository),
):
    try:
        aula = Aula(
            id=None,
            **data.model_dump()
        )

        return CrearAulaUseCase(
            repository
        ).ejecutar(aula)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[AulaResponse],
)
def listar_aulas(
    repository=Depends(get_repository),
):
    return ListarAulasUseCase(
        repository
    ).ejecutar()


@router.get(
    "/{aula_id}",
    response_model=AulaResponse,
)
def obtener_aula(
    aula_id: int,
    repository=Depends(get_repository),
):
    try:
        return ObtenerAulaUseCase(
            repository
        ).ejecutar(aula_id)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{aula_id}",
    response_model=AulaResponse,
)
def actualizar_aula(
    aula_id: int,
    data: AulaUpdate,
    repository=Depends(get_repository),
):
    try:
        aula = Aula(
            id=aula_id,
            **data.model_dump()
        )

        return ActualizarAulaUseCase(
            repository
        ).ejecutar(
            aula_id,
            aula
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{aula_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_aula(
    aula_id: int,
    repository=Depends(get_repository),
):
    try:
        EliminarAulaUseCase(
            repository
        ).ejecutar(aula_id)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )