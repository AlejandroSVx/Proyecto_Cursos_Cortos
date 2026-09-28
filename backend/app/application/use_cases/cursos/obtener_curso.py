from app.domain.entities.curso import Curso
from app.domain.repositories.curso_repository import CursoRepository


class ObtenerCursoUseCase:

    def __init__(
        self,
        repository: CursoRepository
    ):
        self.repository = repository


    def ejecutar(
        self,
        curso_id: int
    ) -> Curso:

        curso = self.repository.obtener_por_id(
            curso_id
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        return curso