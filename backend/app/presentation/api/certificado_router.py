from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.application.dtos.certificado_dto import (
    CertificadoCreate,
    CertificadoResponse,
    CertificadoUpdate,
)

from app.application.use_cases.certificados.crear_certificado import (
    CrearCertificadoUseCase,
)
from app.application.use_cases.certificados.listar_certificados import (
    ListarCertificadosUseCase,
)
from app.application.use_cases.certificados.obtener_certificado import (
    ObtenerCertificadoUseCase,
)
from app.application.use_cases.certificados.actualizar_certificado import (
    ActualizarCertificadoUseCase,
)
from app.application.use_cases.certificados.eliminar_certificado import (
    EliminarCertificadoUseCase,
)

from app.core.dependencies import get_db
from app.domain.entities.certificado import Certificado

from app.infrastructure.repositories.certificado_repository_impl import (
    CertificadoRepositoryImpl,
)
from app.infrastructure.repositories.inscripcion_repository_impl import (
    InscripcionRepositoryImpl,
)
from app.infrastructure.repositories.curso_repository_impl import (
    CursoRepositoryImpl,
)


router = APIRouter(
    prefix="/certificados",
    tags=["Certificados"],
)


@router.post(
    "/",
    response_model=CertificadoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_certificado(
    data: CertificadoCreate,
    db: Session = Depends(get_db),
):
    try:
        use_case = CrearCertificadoUseCase(
            CertificadoRepositoryImpl(db),
            InscripcionRepositoryImpl(db),
            CursoRepositoryImpl(db),
        )

        certificado = Certificado(
            id=None,
            **data.model_dump()
        )

        return use_case.ejecutar(
            certificado
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[CertificadoResponse],
)
def listar_certificados(
    db: Session = Depends(get_db),
):
    return ListarCertificadosUseCase(
        CertificadoRepositoryImpl(db)
    ).ejecutar()


@router.get(
    "/{certificado_id}",
    response_model=CertificadoResponse,
)
def obtener_certificado(
    certificado_id: int,
    db: Session = Depends(get_db),
):
    try:
        return ObtenerCertificadoUseCase(
            CertificadoRepositoryImpl(db)
        ).ejecutar(
            certificado_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{certificado_id}",
    response_model=CertificadoResponse,
)
def actualizar_certificado(
    certificado_id: int,
    data: CertificadoUpdate,
    db: Session = Depends(get_db),
):
    try:
        certificado = Certificado(
            id=certificado_id,
            **data.model_dump()
        )

        return ActualizarCertificadoUseCase(
            CertificadoRepositoryImpl(db)
        ).ejecutar(
            certificado_id,
            certificado
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{certificado_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def eliminar_certificado(
    certificado_id: int,
    db: Session = Depends(get_db),
):
    try:
        EliminarCertificadoUseCase(
            CertificadoRepositoryImpl(db)
        ).ejecutar(
            certificado_id
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )