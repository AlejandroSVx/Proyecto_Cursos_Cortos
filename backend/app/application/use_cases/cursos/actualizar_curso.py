from app.domain.entities.curso import Curso
from app.domain.repositories.curso_repository import (
    CursoRepository,
)


class ActualizarCursoUseCase:

    def __init__(
        self,
        repository: CursoRepository
    ):
        self.repository = repository

    def ejecutar(
        self,
        curso_id: int,
        curso: Curso
    ) -> Curso:

        if curso.fecha_fin <= curso.fecha_inicio:
            raise ValueError(
                "La fecha de finalización debe ser "
                "posterior a la fecha de inicio"
            )

        if curso.cupo_minimo < 0:
            raise ValueError(
                "El cupo mínimo no puede ser negativo"
            )

        if curso.cupo_maximo <= 0:
            raise ValueError(
                "El cupo máximo debe ser mayor a cero"
            )

        if (
            curso.cupo_maximo
            < curso.cupo_minimo
        ):
            raise ValueError(
                "El cupo máximo no puede ser "
                "menor al cupo mínimo"
            )

        actualizado = (
            self.repository.actualizar(
                curso_id,
                curso
            )
        )

        if not actualizado:
            raise ValueError(
                "Curso no encontrado"
            )

        return actualizado