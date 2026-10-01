from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.application.dtos.asignacion_dto import (
    AsignacionCreate,
    AsignacionResponse,
    AsignacionUpdate,
)

from app.application.use_cases.asignaciones.crear_asignacion import (
    CrearAsignacionUseCase,
)

from app.application.use_cases.asignaciones.listar_asignaciones import (
    ListarAsignacionesUseCase,
)

from app.application.use_cases.asignaciones.obtener_asignacion import (
    ObtenerAsignacionUseCase,
)

from app.application.use_cases.asignaciones.actualizar_asignacion import (
    ActualizarAsignacionUseCase,
)

from app.application.use_cases.asignaciones.eliminar_asignacion import (
    EliminarAsignacionUseCase,
)

from app.core.dependencies import (
    get_current_user,
    get_db,
)

from app.domain.entities.asignacion import (
    Asignacion,
)

from app.infrastructure.repositories.asignacion_repository_impl import (
    AsignacionRepositoryImpl,
)

from app.infrastructure.repositories.curso_repository_impl import (
    CursoRepositoryImpl,
)

from app.infrastructure.repositories.instructor_repository_impl import (
    InstructorRepositoryImpl,
)

from app.infrastructure.repositories.aula_repository_impl import (
    AulaRepositoryImpl,
)


router = APIRouter(
    prefix="/asignaciones",
    tags=["Asignaciones"],
    dependencies=[
        Depends(get_current_user)
    ],
)


@router.post(
    "/",
    response_model=AsignacionResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_asignacion(
    data: AsignacionCreate,
    db: Session = Depends(get_db),
):
    try:
        asignacion = Asignacion(
            id=None,
            **data.model_dump()
        )

        use_case = CrearAsignacionUseCase(
            AsignacionRepositoryImpl(db),
            CursoRepositoryImpl(db),
            InstructorRepositoryImpl(db),
            AulaRepositoryImpl(db),
        )

        return use_case.ejecutar(
            asignacion
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[
        AsignacionResponse
    ],
)
def listar_asignaciones(
    db: Session = Depends(get_db),
):
    return (
        ListarAsignacionesUseCase(
            AsignacionRepositoryImpl(
                db
            )
        )
        .ejecutar()
    )


@router.get(
    "/{asignacion_id}",
    response_model=AsignacionResponse,
)
def obtener_asignacion(
    asignacion_id: int,
    db: Session = Depends(get_db),
):
    try:
        return (
            ObtenerAsignacionUseCase(
                AsignacionRepositoryImpl(
                    db
                )
            )
            .ejecutar(
                asignacion_id
            )
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{asignacion_id}",
    response_model=AsignacionResponse,
)
def actualizar_asignacion(
    asignacion_id: int,
    data: AsignacionUpdate,
    db: Session = Depends(get_db),
):
    try:
        asignacion = Asignacion(
            id=asignacion_id,
            **data.model_dump()
        )

        use_case = ActualizarAsignacionUseCase(
            AsignacionRepositoryImpl(db),
            CursoRepositoryImpl(db),
            InstructorRepositoryImpl(db),
            AulaRepositoryImpl(db),
        )

        return use_case.ejecutar(
            asignacion_id,
            asignacion
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{asignacion_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_asignacion(
    asignacion_id: int,
    db: Session = Depends(get_db),
):
    try:
        EliminarAsignacionUseCase(
            AsignacionRepositoryImpl(
                db
            )
        ).ejecutar(
            asignacion_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )