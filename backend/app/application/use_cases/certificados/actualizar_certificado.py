from app.domain.entities.certificado import Certificado
from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)


class ActualizarCertificadoUseCase:

    def __init__(
        self,
        repository: CertificadoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        certificado_id: int,
        certificado: Certificado
    ) -> Certificado:

        estados_validos = [
            "GENERADO",
            "ENTREGADO",
            "ANULADO",
        ]

        if certificado.estado_certificado not in estados_validos:
            raise ValueError(
                "Estado de certificado no válido"
            )

        actualizado = self.repository.actualizar(
            certificado_id,
            certificado
        )

        if not actualizado:
            raise ValueError(
                "Certificado no encontrado"
            )

        return actualizado