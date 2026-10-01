from sqlalchemy.orm import Session

from app.infrastructure.models.curso_model import (
    CursoModel,
)

from app.infrastructure.models.asignacion_model import (
    AsignacionModel,
)

from app.infrastructure.models.instructor_model import (
    InstructorModel,
)

from app.infrastructure.models.aula_model import (
    AulaModel,
)


class ListarCursosConInstructorUseCase:

    def __init__(
        self,
        db: Session
    ):
        self.db = db

    def ejecutar(self):

        resultados = (
            self.db
            .query(
                CursoModel,
                AsignacionModel,
                InstructorModel,
                AulaModel,
            )
            .join(
                AsignacionModel,
                AsignacionModel.curso_id
                == CursoModel.id,
            )
            .join(
                InstructorModel,
                InstructorModel.id
                == AsignacionModel.instructor_id,
            )
            .join(
                AulaModel,
                AulaModel.id
                == AsignacionModel.aula_id,
            )
            .filter(
                AsignacionModel.estado_asignacion
                == "ACTIVA"
            )
            .order_by(
                CursoModel.id
            )
            .all()
        )

        return [
            {
                "curso_id": curso.id,

                "curso": curso.nombre,

                "horario": curso.horario,

                "instructor_id":
                    instructor.id,

                "instructor": (
                    instructor.nombres
                    + " "
                    + instructor.apellidos
                ),

                "aula_id":
                    aula.id,

                "aula":
                    aula.nombre_aula,

                "estado_asignacion":
                    asignacion.estado_asignacion,
            }

            for (
                curso,
                asignacion,
                instructor,
                aula
            ) in resultados
        ]