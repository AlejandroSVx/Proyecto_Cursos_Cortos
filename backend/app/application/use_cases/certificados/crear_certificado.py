from app.domain.entities.certificado import Certificado

from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)

from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)

from app.domain.repositories.curso_repository import (
    CursoRepository,
)


class CrearCertificadoUseCase:

    def __init__(
        self,
        certificado_repository: CertificadoRepository,
        inscripcion_repository: InscripcionRepository,
        curso_repository: CursoRepository,
    ):
        self.certificado_repository = (
            certificado_repository
        )

        self.inscripcion_repository = (
            inscripcion_repository
        )

        self.curso_repository = (
            curso_repository
        )

    def ejecutar(
        self,
        certificado: Certificado
    ) -> Certificado:

        # 1. Verificar que exista la inscripción
        inscripcion = (
            self.inscripcion_repository
            .obtener_por_id(
                certificado.inscripcion_id
            )
        )

        if not inscripcion:
            raise ValueError(
                "Inscripción no encontrada"
            )

        # 2. Evitar dos certificados
        # para la misma inscripción
        existe_certificado = (
            self.certificado_repository
            .existe_por_inscripcion(
                certificado.inscripcion_id
            )
        )

        if existe_certificado:
            raise ValueError(
                "La inscripción ya tiene "
                "un certificado emitido"
            )

        # 3. Buscar el curso asociado
        curso = (
            self.curso_repository
            .obtener_por_id(
                inscripcion.curso_id
            )
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        # 4. Solo cursos finalizados
        # pueden emitir certificados
        if curso.estado != "FINALIZADO":
            raise ValueError(
                "El curso aún no ha finalizado"
            )

        # 5. Crear certificado
        return (
            self.certificado_repository
            .crear(
                certificado
            )
        )