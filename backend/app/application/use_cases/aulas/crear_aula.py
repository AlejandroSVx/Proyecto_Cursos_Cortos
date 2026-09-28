from app.domain.entities.aula import Aula
from app.domain.repositories.aula_repository import AulaRepository


class CrearAulaUseCase:

    def __init__(
        self,
        repository: AulaRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
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

        return self.repository.crear(aula)