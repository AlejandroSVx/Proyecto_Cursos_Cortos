from app.domain.repositories.aula_repository import AulaRepository


class EliminarAulaUseCase:

    def __init__(
        self,
        repository: AulaRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        aula_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            aula_id
        )

        if not eliminado:
            raise ValueError(
                "Aula no encontrada"
            )