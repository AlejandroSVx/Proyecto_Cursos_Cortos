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

from app.core.dependencies import (
    get_current_user,
    get_db,
)

from app.domain.entities.inscripcion import (
    Inscripcion,
)

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
    dependencies=[
        Depends(get_current_user)
    ],
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
        inscripcion = Inscripcion(
            id=None,
            **data.model_dump()
        )

        use_case = CrearInscripcionUseCase(
            InscripcionRepositoryImpl(db),
            ParticipanteRepositoryImpl(db),
            CursoRepositoryImpl(db),
        )

        return use_case.ejecutar(
            inscripcion
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[
        InscripcionResponse
    ],
)
def listar_inscripciones(
    db: Session = Depends(get_db),
):
    return (
        ListarInscripcionesUseCase(
            InscripcionRepositoryImpl(
                db
            )
        )
        .ejecutar()
    )


@router.get(
    "/{inscripcion_id}",
    response_model=InscripcionResponse,
)
def obtener_inscripcion(
    inscripcion_id: int,
    db: Session = Depends(get_db),
):
    try:
        return (
            ObtenerInscripcionUseCase(
                InscripcionRepositoryImpl(
                    db
                )
            )
            .ejecutar(
                inscripcion_id
            )
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
        inscripcion = Inscripcion(
            id=inscripcion_id,
            **data.model_dump()
        )

        use_case = ActualizarInscripcionUseCase(
            InscripcionRepositoryImpl(db),
            ParticipanteRepositoryImpl(db),
            CursoRepositoryImpl(db),
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
        EliminarInscripcionUseCase(
            InscripcionRepositoryImpl(
                db
            )
        ).ejecutar(
            inscripcion_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )