from fastapi import FastAPI

from app.core.middlewares import configurar_middlewares

from app.infrastructure.database.base import Base
from app.infrastructure.database.session import engine


# MODELOS
from app.infrastructure.models.curso_model import CursoModel
from app.infrastructure.models.participante_model import ParticipanteModel
from app.infrastructure.models.inscripcion_model import InscripcionModel
from app.infrastructure.models.pago_model import PagoModel
from app.infrastructure.models.instructor_model import InstructorModel
from app.infrastructure.models.aula_model import AulaModel
from app.infrastructure.models.asignacion_model import AsignacionModel
from app.infrastructure.models.certificado_model import CertificadoModel
from app.infrastructure.models.usuario_model import (UsuarioModel,)

# ROUTERS
from app.presentation.api.curso_router import (
    router as curso_router,
)

from app.presentation.api.participante_router import (
    router as participante_router,
)

from app.presentation.api.inscripcion_router import (
    router as inscripcion_router,
)

from app.presentation.api.pago_router import (
    router as pago_router,
)

from app.presentation.api.instructor_router import (
    router as instructor_router,
)

from app.presentation.api.aula_router import (
    router as aula_router,
)

from app.presentation.api.asignacion_router import (
    router as asignacion_router,
)

from app.presentation.api.certificado_router import (
    router as certificado_router,
)

from app.presentation.api.auth_router import (
    router as auth_router,
)

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Sistema de Gestión de Cursos Cortos",
    description=(
        "API para la gestión de cursos, participantes, "
        "inscripciones, pagos, instructores, aulas, "
        "asignaciones y certificados."
    ),
    version="1.0.0",
)


configurar_middlewares(app)


app.include_router(curso_router)
app.include_router(participante_router)
app.include_router(inscripcion_router)
app.include_router(pago_router)
app.include_router(instructor_router)
app.include_router(aula_router)
app.include_router(asignacion_router)
app.include_router(certificado_router)
app.include_router(auth_router)

@app.get("/")
def inicio():

    return {
        "mensaje":
        "API del Sistema de Gestión de Cursos Cortos funcionando correctamente"
    }


@app.get("/health")
def health():

    return {
        "status": "ok"
    }