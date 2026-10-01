from app.domain.entities.inscripcion import (
    Inscripcion,
)

from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)

from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)

from app.domain.repositories.curso_repository import (
    CursoRepository,
)


class ActualizarInscripcionUseCase:

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

        self.curso_repository = (
            curso_repository
        )

    def ejecutar(
        self,
        inscripcion_id: int,
        inscripcion: Inscripcion
    ) -> Inscripcion:

        participante = (
            self.participante_repository
            .obtener_por_id(
                inscripcion.participante_id
            )
        )

        if not participante:
            raise ValueError(
                "Participante no encontrado"
            )

        curso = (
            self.curso_repository
            .obtener_por_id(
                inscripcion.curso_id
            )
        )

        if not curso:
            raise ValueError(
                "Curso no encontrado"
            )

        duplicada = (
            self.inscripcion_repository
            .existe_inscripcion_activa(
                participante_id=(
                    inscripcion.participante_id
                ),
                curso_id=(
                    inscripcion.curso_id
                ),
                excluir_inscripcion_id=(
                    inscripcion_id
                ),
            )
        )

        if (
            inscripcion.estado
            != "CANCELADA"
            and duplicada
        ):
            raise ValueError(
                "El participante ya se encuentra "
                "inscrito en este curso"
            )

        actualizada = (
            self.inscripcion_repository
            .actualizar(
                inscripcion_id,
                inscripcion
            )
        )

        if not actualizada:
            raise ValueError(
                "Inscripción no encontrada"
            )

        return actualizada