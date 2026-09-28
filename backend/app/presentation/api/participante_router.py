from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.application.dtos.participante_dto import (
    ParticipanteCreate,
    ParticipanteResponse,
    ParticipanteUpdate,
)

from app.application.use_cases.participantes.crear_participante import (
    CrearParticipanteUseCase,
)

from app.application.use_cases.participantes.listar_participantes import (
    ListarParticipantesUseCase,
)

from app.application.use_cases.participantes.obtener_participante import (
    ObtenerParticipanteUseCase,
)

from app.application.use_cases.participantes.actualizar_participante import (
    ActualizarParticipanteUseCase,
)

from app.application.use_cases.participantes.eliminar_participante import (
    EliminarParticipanteUseCase,
)

from app.core.dependencies import get_db
from app.domain.entities.participante import Participante
from app.infrastructure.repositories.participante_repository_impl import (
    ParticipanteRepositoryImpl,
)


router = APIRouter(
    prefix="/participantes",
    tags=["Participantes"],
)


def get_repository(
    db: Session = Depends(get_db)
):
    return ParticipanteRepositoryImpl(db)


@router.post(
    "/",
    response_model=ParticipanteResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_participante(
    data: ParticipanteCreate,
    repository=Depends(get_repository),
):
    try:
        participante = Participante(
            id=None,
            **data.model_dump()
        )

        use_case = CrearParticipanteUseCase(
            repository
        )

        return use_case.ejecutar(
            participante
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[ParticipanteResponse],
)
def listar_participantes(
    repository=Depends(get_repository),
):
    use_case = ListarParticipantesUseCase(
        repository
    )

    return use_case.ejecutar()


@router.get(
    "/{participante_id}",
    response_model=ParticipanteResponse,
)
def obtener_participante(
    participante_id: int,
    repository=Depends(get_repository),
):
    try:
        use_case = ObtenerParticipanteUseCase(
            repository
        )

        return use_case.ejecutar(
            participante_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{participante_id}",
    response_model=ParticipanteResponse,
)
def actualizar_participante(
    participante_id: int,
    data: ParticipanteUpdate,
    repository=Depends(get_repository),
):
    try:
        participante = Participante(
            id=participante_id,
            **data.model_dump()
        )

        use_case = ActualizarParticipanteUseCase(
            repository
        )

        return use_case.ejecutar(
            participante_id,
            participante
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{participante_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_participante(
    participante_id: int,
    repository=Depends(get_repository),
):
    try:
        use_case = EliminarParticipanteUseCase(
            repository
        )

        use_case.ejecutar(
            participante_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )