from app.domain.entities.certificado import Certificado
from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)


class ObtenerCertificadoUseCase:

    def __init__(
        self,
        repository: CertificadoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        certificado_id: int
    ) -> Certificado:

        certificado = (
            self.repository.obtener_por_id(
                certificado_id
            )
        )

        if not certificado:
            raise ValueError(
                "Certificado no encontrado"
            )

        return certificado