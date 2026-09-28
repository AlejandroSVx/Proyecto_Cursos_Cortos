from app.domain.entities.curso import Curso
from app.domain.repositories.curso_repository import CursoRepository


class CrearCursoUseCase:

    def __init__(
        self,
        repository: CursoRepository
    ):
        self.repository = repository


    def ejecutar(
        self,
        curso: Curso
    ) -> Curso:

        if curso.fecha_fin < curso.fecha_inicio:
            raise ValueError(
                "La fecha fin no puede ser menor que la fecha inicio"
            )

        if curso.cupo_maximo < curso.cupo_minimo:
            raise ValueError(
                "El cupo máximo no puede ser menor que el cupo mínimo"
            )

        return self.repository.crear(curso)