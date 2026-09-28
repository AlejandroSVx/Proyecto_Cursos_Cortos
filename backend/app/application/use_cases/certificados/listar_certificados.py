from typing import List

from app.domain.entities.certificado import Certificado
from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)


class ListarCertificadosUseCase:

    def __init__(
        self,
        repository: CertificadoRepository
    ):
        self.repository = repository

    def ejecutar(self) -> List[Certificado]:
        return self.repository.listar()