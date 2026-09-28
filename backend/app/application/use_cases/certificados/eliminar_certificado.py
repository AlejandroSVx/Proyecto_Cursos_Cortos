from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)


class EliminarCertificadoUseCase:

    def __init__(
        self,
        repository: CertificadoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        certificado_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            certificado_id
        )

        if not eliminado:
            raise ValueError(
                "Certificado no encontrado"
            )