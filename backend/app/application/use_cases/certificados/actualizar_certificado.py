from app.domain.entities.certificado import Certificado
from app.domain.repositories.certificado_repository import CertificadoRepository
from app.domain.repositories.inscripcion_repository import InscripcionRepository


class ActualizarCertificadoUseCase:

    def __init__(
        self,
        certificado_repository: CertificadoRepository,
        inscripcion_repository: InscripcionRepository,
    ):
        self.certificado_repository = certificado_repository
        self.inscripcion_repository = inscripcion_repository

    def ejecutar(
        self,
        certificado_id: int,
        certificado: Certificado
    ) -> Certificado:

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

        existe = (
            self.certificado_repository
            .existe_por_inscripcion(
                inscripcion_id=certificado.inscripcion_id,
                excluir_certificado_id=certificado_id,
            )
        )

        if existe:
            raise ValueError(
                "La inscripción ya tiene "
                "un certificado emitido"
            )

        actualizado = (
            self.certificado_repository
            .actualizar(
                certificado_id,
                certificado
            )
        )

        if not actualizado:
            raise ValueError(
                "Certificado no encontrado"
            )

        return actualizado