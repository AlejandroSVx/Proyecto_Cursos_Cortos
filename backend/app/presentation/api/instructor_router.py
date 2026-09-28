from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.application.dtos.instructor_dto import (
    InstructorCreate,
    InstructorResponse,
    InstructorUpdate,
)

from app.application.use_cases.instructores.crear_instructor import (
    CrearInstructorUseCase,
)
from app.application.use_cases.instructores.listar_instructores import (
    ListarInstructoresUseCase,
)
from app.application.use_cases.instructores.obtener_instructor import (
    ObtenerInstructorUseCase,
)
from app.application.use_cases.instructores.actualizar_instructor import (
    ActualizarInstructorUseCase,
)
from app.application.use_cases.instructores.eliminar_instructor import (
    EliminarInstructorUseCase,
)

from app.core.dependencies import get_db
from app.domain.entities.instructor import Instructor

from app.infrastructure.repositories.instructor_repository_impl import (
    InstructorRepositoryImpl,
)


router = APIRouter(
    prefix="/instructores",
    tags=["Instructores"],
)


def get_repository(
    db: Session = Depends(get_db)
):
    return InstructorRepositoryImpl(db)


@router.post(
    "/",
    response_model=InstructorResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_instructor(
    data: InstructorCreate,
    repository=Depends(get_repository),
):
    try:
        instructor = Instructor(
            id=None,
            **data.model_dump()
        )

        use_case = CrearInstructorUseCase(
            repository
        )

        return use_case.ejecutar(
            instructor
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[InstructorResponse],
)
def listar_instructores(
    repository=Depends(get_repository),
):
    return ListarInstructoresUseCase(
        repository
    ).ejecutar()


@router.get(
    "/{instructor_id}",
    response_model=InstructorResponse,
)
def obtener_instructor(
    instructor_id: int,
    repository=Depends(get_repository),
):
    try:
        return ObtenerInstructorUseCase(
            repository
        ).ejecutar(
            instructor_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{instructor_id}",
    response_model=InstructorResponse,
)
def actualizar_instructor(
    instructor_id: int,
    data: InstructorUpdate,
    repository=Depends(get_repository),
):
    try:
        instructor = Instructor(
            id=instructor_id,
            **data.model_dump()
        )

        return ActualizarInstructorUseCase(
            repository
        ).ejecutar(
            instructor_id,
            instructor
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{instructor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_instructor(
    instructor_id: int,
    repository=Depends(get_repository),
):
    try:
        EliminarInstructorUseCase(
            repository
        ).ejecutar(
            instructor_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )