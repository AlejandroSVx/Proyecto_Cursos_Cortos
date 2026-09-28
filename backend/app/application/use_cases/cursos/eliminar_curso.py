from app.domain.repositories.curso_repository import CursoRepository


class EliminarCursoUseCase:

    def __init__(
        self,
        repository: CursoRepository
    ):
        self.repository = repository


    def ejecutar(
        self,
        curso_id: int
    ) -> None:

        eliminado = self.repository.eliminar(
            curso_id
        )

        if not eliminado:
            raise ValueError(
                "Curso no encontrado"
            )