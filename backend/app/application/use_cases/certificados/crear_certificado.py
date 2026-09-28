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
        self.certificado_repository = certificado_repository
        self.inscripcion_repository = inscripcion_repository
        self.curso_repository = curso_repository

    def ejecutar(
        self,
        certificado: Certificado
    ) -> Certificado:

        inscripcion = (
            self.inscripcion_repository.obtener_por_id(
                certificado.inscripcion_id
            )
        )

        if not inscripcion:
            raise ValueError(
                "Inscripción no encontrada"
            )

        curso = self.curso_repository.obtener_por_id(
            inscripcion.curso_id
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        if curso.estado != "FINALIZADO":
            raise ValueError(
                "El curso todavía no está finalizado"
            )

        existente = (
            self.certificado_repository
            .obtener_por_inscripcion(
                certificado.inscripcion_id
            )
        )

        if existente:
            raise ValueError(
                "La inscripción ya tiene un certificado"
            )

        estados_validos = [
            "GENERADO",
            "ENTREGADO",
            "ANULADO",
        ]

        if certificado.estado_certificado not in estados_validos:
            raise ValueError(
                "Estado de certificado no válido"
            )

        return self.certificado_repository.crear(
            certificado
        )