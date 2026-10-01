from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.application.dtos.curso_dto import (
    CursoCreate,
    CursoResponse,
    CursoUpdate,
)

from app.application.dtos.curso_dto import (
    CursoCreate,
    CursoResponse,
    CursoUpdate,
    CursoConInstructorResponse,
)
from app.application.use_cases.cursos.crear_curso import (
    CrearCursoUseCase,
)

from app.application.use_cases.cursos.listar_cursos import (
    ListarCursosUseCase,
)

from app.application.use_cases.cursos.listar_cursos_con_instructor import (
    ListarCursosConInstructorUseCase,
)

from app.application.use_cases.cursos.obtener_curso import (
    ObtenerCursoUseCase,
)

from app.application.use_cases.cursos.actualizar_curso import (
    ActualizarCursoUseCase,
)

from app.application.use_cases.cursos.eliminar_curso import (
    EliminarCursoUseCase,
)

from app.core.dependencies import (
    get_current_user,
    get_db,
)
from app.domain.entities.curso import Curso
from app.infrastructure.repositories.curso_repository_impl import (
    CursoRepositoryImpl,
)


router = APIRouter(
    prefix="/cursos",
    tags=["Cursos"],
    dependencies=[
        Depends(get_current_user)
    ],
)


def get_repository(
    db: Session = Depends(get_db)
):
    return CursoRepositoryImpl(db)


@router.post(
    "/",
    response_model=CursoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_curso(
    data: CursoCreate,
    repository=Depends(get_repository),
):
    try:
        curso = Curso(
            id=None,
            **data.model_dump()
        )

        use_case = CrearCursoUseCase(
            repository
        )

        return use_case.ejecutar(curso)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[CursoResponse],
)
def listar_cursos(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user),
):
    repository = CursoRepositoryImpl(db)

    use_case = ListarCursosUseCase(
        repository
    )

    return use_case.ejecutar()

@router.get(
    "/con-instructor",
    response_model=list[
        CursoConInstructorResponse
    ],
)
def listar_cursos_con_instructor(
    db: Session = Depends(get_db),
):
    use_case = (
        ListarCursosConInstructorUseCase(
            db
        )
    )

    return use_case.ejecutar()

@router.get(
    "/{curso_id}",
    response_model=CursoResponse,
)
def obtener_curso(
    curso_id: int,
    repository=Depends(get_repository),
):
    try:
        use_case = ObtenerCursoUseCase(
            repository
        )

        return use_case.ejecutar(
            curso_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{curso_id}",
    response_model=CursoResponse,
)
def actualizar_curso(
    curso_id: int,
    data: CursoUpdate,
    repository=Depends(get_repository),
):
    try:
        curso = Curso(
            id=curso_id,
            **data.model_dump()
        )

        use_case = ActualizarCursoUseCase(
            repository
        )

        return use_case.ejecutar(
            curso_id,
            curso
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{curso_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_curso(
    curso_id: int,
    repository=Depends(get_repository),
):
    try:
        use_case = EliminarCursoUseCase(
            repository
        )

        use_case.ejecutar(
            curso_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )