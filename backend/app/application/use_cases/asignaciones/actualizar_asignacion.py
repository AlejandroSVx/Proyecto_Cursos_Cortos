from app.domain.entities.asignacion import (
    Asignacion,
)

from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)

from app.domain.repositories.curso_repository import (
    CursoRepository,
)

from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)

from app.domain.repositories.aula_repository import (
    AulaRepository,
)


class ActualizarAsignacionUseCase:

    def __init__(
        self,
        asignacion_repository: AsignacionRepository,
        curso_repository: CursoRepository,
        instructor_repository: InstructorRepository,
        aula_repository: AulaRepository,
    ):
        self.asignacion_repository = asignacion_repository
        self.curso_repository = curso_repository
        self.instructor_repository = instructor_repository
        self.aula_repository = aula_repository

    def ejecutar(
        self,
        asignacion_id: int,
        asignacion: Asignacion
    ) -> Asignacion:

        curso = (
            self.curso_repository
            .obtener_por_id(
                asignacion.curso_id
            )
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        instructor = (
            self.instructor_repository
            .obtener_por_id(
                asignacion.instructor_id
            )
        )

        if not instructor:
            raise ValueError(
                "Instructor no encontrado"
            )

        if instructor.estado_instructor != "ACTIVO":
            raise ValueError(
                "El instructor no se encuentra activo"
            )

        aula = (
            self.aula_repository
            .obtener_por_id(
                asignacion.aula_id
            )
        )

        if not aula:
            raise ValueError(
                "Aula no encontrada"
            )

        if aula.estado_aula != "DISPONIBLE":
            raise ValueError(
                "El aula no se encuentra disponible"
            )

        if aula.capacidad < curso.cupo_maximo:
            raise ValueError(
                "La capacidad del aula es "
                "insuficiente para el curso"
            )

        if (
            asignacion.fecha_asignacion
            >= curso.fecha_inicio
        ):
            raise ValueError(
                "La asignación debe realizarse "
                "antes de la fecha de inicio "
                "del curso"
            )

        estados_validos = [
            "ACTIVA",
            "MODIFICADA",
            "CANCELADA",
        ]

        if (
            asignacion.estado_asignacion
            not in estados_validos
        ):
            raise ValueError(
                "Estado de asignación no válido"
            )

        if (
            asignacion.estado_asignacion
            == "ACTIVA"
        ):
            existe_activa = (
                self.asignacion_repository
                .existe_asignacion_activa_curso(
                    curso_id=asignacion.curso_id,
                    excluir_asignacion_id=(
                        asignacion_id
                    ),
                )
            )

            if existe_activa:
                raise ValueError(
                    "El curso ya tiene una "
                    "asignación activa"
                )

        conflicto, mensaje = (
            self.asignacion_repository
            .existe_conflicto_horario(
                curso_id=asignacion.curso_id,
                instructor_id=asignacion.instructor_id,
                aula_id=asignacion.aula_id,
                excluir_asignacion_id=(
                    asignacion_id
                ),
            )
        )

        if conflicto:
            raise ValueError(
                mensaje
            )

        actualizada = (
            self.asignacion_repository
            .actualizar(
                asignacion_id,
                asignacion
            )
        )

        if not actualizada:
            raise ValueError(
                "Asignación no encontrada"
            )

        return actualizada