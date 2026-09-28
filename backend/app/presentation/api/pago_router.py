from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.application.dtos.pago_dto import (
    PagoCreate,
    PagoResponse,
    PagoUpdate,
)

from app.application.use_cases.pagos.crear_pago import (
    CrearPagoUseCase,
)
from app.application.use_cases.pagos.listar_pagos import (
    ListarPagosUseCase,
)
from app.application.use_cases.pagos.obtener_pago import (
    ObtenerPagoUseCase,
)
from app.application.use_cases.pagos.actualizar_pago import (
    ActualizarPagoUseCase,
)
from app.application.use_cases.pagos.eliminar_pago import (
    EliminarPagoUseCase,
)

from app.core.dependencies import get_db
from app.domain.entities.pago import Pago

from app.infrastructure.repositories.pago_repository_impl import (
    PagoRepositoryImpl,
)
from app.infrastructure.repositories.inscripcion_repository_impl import (
    InscripcionRepositoryImpl,
)


router = APIRouter(
    prefix="/pagos",
    tags=["Pagos"],
)


@router.post(
    "/",
    response_model=PagoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_pago(
    data: PagoCreate,
    db: Session = Depends(get_db),
):
    try:
        pago_repository = PagoRepositoryImpl(db)

        inscripcion_repository = (
            InscripcionRepositoryImpl(db)
        )

        use_case = CrearPagoUseCase(
            pago_repository,
            inscripcion_repository,
        )

        pago = Pago(
            id=None,
            **data.model_dump()
        )

        return use_case.ejecutar(pago)

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[PagoResponse],
)
def listar_pagos(
    db: Session = Depends(get_db),
):
    repository = PagoRepositoryImpl(db)

    use_case = ListarPagosUseCase(
        repository
    )

    return use_case.ejecutar()


@router.get(
    "/{pago_id}",
    response_model=PagoResponse,
)
def obtener_pago(
    pago_id: int,
    db: Session = Depends(get_db),
):
    try:
        repository = PagoRepositoryImpl(db)

        use_case = ObtenerPagoUseCase(
            repository
        )

        return use_case.ejecutar(
            pago_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{pago_id}",
    response_model=PagoResponse,
)
def actualizar_pago(
    pago_id: int,
    data: PagoUpdate,
    db: Session = Depends(get_db),
):
    try:
        repository = PagoRepositoryImpl(db)

        use_case = ActualizarPagoUseCase(
            repository
        )

        pago = Pago(
            id=pago_id,
            **data.model_dump()
        )

        return use_case.ejecutar(
            pago_id,
            pago
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{pago_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_pago(
    pago_id: int,
    db: Session = Depends(get_db),
):
    try:
        repository = PagoRepositoryImpl(db)

        use_case = EliminarPagoUseCase(
            repository
        )

        use_case.ejecutar(
            pago_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )