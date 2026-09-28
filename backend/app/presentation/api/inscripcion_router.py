from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.application.dtos.inscripcion_dto import (
    InscripcionCreate,
    InscripcionResponse,
    InscripcionUpdate,
)

from app.application.use_cases.inscripciones.crear_inscripcion import (
    CrearInscripcionUseCase,
)
from app.application.use_cases.inscripciones.listar_inscripciones import (
    ListarInscripcionesUseCase,
)
from app.application.use_cases.inscripciones.obtener_inscripcion import (
    ObtenerInscripcionUseCase,
)
from app.application.use_cases.inscripciones.actualizar_inscripcion import (
    ActualizarInscripcionUseCase,
)
from app.application.use_cases.inscripciones.eliminar_inscripcion import (
    EliminarInscripcionUseCase,
)

from app.core.dependencies import get_db
from app.domain.entities.inscripcion import Inscripcion

from app.infrastructure.repositories.inscripcion_repository_impl import (
    InscripcionRepositoryImpl,
)
from app.infrastructure.repositories.participante_repository_impl import (
    ParticipanteRepositoryImpl,
)
from app.infrastructure.repositories.curso_repository_impl import (
    CursoRepositoryImpl,
)


router = APIRouter(
    prefix="/inscripciones",
    tags=["Inscripciones"],
)


@router.post(
    "/",
    response_model=InscripcionResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_inscripcion(
    data: InscripcionCreate,
    db: Session = Depends(get_db),
):
    try:
        inscripcion_repository = InscripcionRepositoryImpl(db)

        participante_repository = ParticipanteRepositoryImpl(db)

        curso_repository = CursoRepositoryImpl(db)

        use_case = CrearInscripcionUseCase(
            inscripcion_repository,
            participante_repository,
            curso_repository,
        )

        inscripcion = Inscripcion(
            id=None,
            **data.model_dump()
        )

        return use_case.ejecutar(inscripcion)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[InscripcionResponse],
)
def listar_inscripciones(
    db: Session = Depends(get_db),
):
    repository = InscripcionRepositoryImpl(db)

    use_case = ListarInscripcionesUseCase(
        repository
    )

    return use_case.ejecutar()


@router.get(
    "/{inscripcion_id}",
    response_model=InscripcionResponse,
)
def obtener_inscripcion(
    inscripcion_id: int,
    db: Session = Depends(get_db),
):
    try:
        repository = InscripcionRepositoryImpl(db)

        use_case = ObtenerInscripcionUseCase(
            repository
        )

        return use_case.ejecutar(
            inscripcion_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{inscripcion_id}",
    response_model=InscripcionResponse,
)
def actualizar_inscripcion(
    inscripcion_id: int,
    data: InscripcionUpdate,
    db: Session = Depends(get_db),
):
    try:
        repository = InscripcionRepositoryImpl(db)

        use_case = ActualizarInscripcionUseCase(
            repository
        )

        inscripcion = Inscripcion(
            id=inscripcion_id,
            **data.model_dump()
        )

        return use_case.ejecutar(
            inscripcion_id,
            inscripcion
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{inscripcion_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_inscripcion(
    inscripcion_id: int,
    db: Session = Depends(get_db),
):
    try:
        repository = InscripcionRepositoryImpl(db)

        use_case = EliminarInscripcionUseCase(
            repository
        )

        use_case.ejecutar(
            inscripcion_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )