from app.domain.entities.aula import Aula
from app.domain.repositories.aula_repository import AulaRepository


class ObtenerAulaUseCase:

    def __init__(
        self,
        repository: AulaRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        aula_id: int
    ) -> Aula:

        aula = self.repository.obtener_por_id(
            aula_id
        )

        if not aula:
            raise ValueError(
                "Aula no encontrada"
            )

        return aula