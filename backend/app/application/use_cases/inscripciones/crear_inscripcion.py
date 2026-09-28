from app.domain.entities.inscripcion import Inscripcion
from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)
from app.domain.repositories.curso_repository import (
    CursoRepository,
)


class CrearInscripcionUseCase:

    def __init__(
        self,
        inscripcion_repository: InscripcionRepository,
        participante_repository: ParticipanteRepository,
        curso_repository: CursoRepository,
    ):
        self.inscripcion_repository = (
            inscripcion_repository
        )
        self.participante_repository = (
            participante_repository
        )
        self.curso_repository = curso_repository

    def ejecutar(
        self,
        inscripcion: Inscripcion
    ) -> Inscripcion:

        participante = (
            self.participante_repository.obtener_por_id(
                inscripcion.participante_id
            )
        )

        if not participante:
            raise ValueError(
                "Participante no encontrado"
            )

        curso = (
            self.curso_repository.obtener_por_id(
                inscripcion.curso_id
            )
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        if curso.estado != "ACTIVO":
            raise ValueError(
                "El curso no se encuentra activo"
            )

        duplicada = (
            self.inscripcion_repository
            .existe_inscripcion_activa(
                inscripcion.participante_id,
                inscripcion.curso_id,
            )
        )

        if duplicada:
            raise ValueError(
                "El participante ya tiene una inscripción activa en este curso"
            )

        inscritos = (
            self.inscripcion_repository
            .contar_inscripciones_activas(
                inscripcion.curso_id
            )
        )

        if inscritos >= curso.cupo_maximo:
            raise ValueError(
                "El curso alcanzó el cupo máximo"
            )

        return self.inscripcion_repository.crear(
            inscripcion
        )