from app.domain.entities.aula import Aula
from app.domain.repositories.aula_repository import AulaRepository


class ActualizarAulaUseCase:

    def __init__(
        self,
        repository: AulaRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        aula_id: int,
        aula: Aula
    ) -> Aula:

        estados_validos = [
            "DISPONIBLE",
            "OCUPADA",
            "INACTIVA",
        ]

        if aula.estado_aula not in estados_validos:
            raise ValueError(
                "Estado de aula no válido"
            )

        actualizada = self.repository.actualizar(
            aula_id,
            aula
        )

        if not actualizada:
            raise ValueError(
                "Aula no encontrada"
            )

        return actualizada