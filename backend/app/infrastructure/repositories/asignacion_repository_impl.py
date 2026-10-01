from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.asignacion import (
    Asignacion,
)

from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)

from app.infrastructure.models.asignacion_model import (
    AsignacionModel,
)

from app.infrastructure.models.curso_model import (
    CursoModel,
)


class AsignacionRepositoryImpl(
    AsignacionRepository
):

    def __init__(
        self,
        db: Session
    ):
        self.db = db

    def crear(
        self,
        asignacion: Asignacion
    ) -> Asignacion:

        modelo = AsignacionModel(
            curso_id=asignacion.curso_id,
            instructor_id=asignacion.instructor_id,
            aula_id=asignacion.aula_id,
            fecha_asignacion=asignacion.fecha_asignacion,
            estado_asignacion=asignacion.estado_asignacion,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(
        self
    ) -> List[Asignacion]:

        modelos = (
            self.db
            .query(AsignacionModel)
            .order_by(
                AsignacionModel.id
            )
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        asignacion_id: int
    ) -> Optional[Asignacion]:

        modelo = (
            self.db
            .query(AsignacionModel)
            .filter(
                AsignacionModel.id
                == asignacion_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        asignacion_id: int,
        asignacion: Asignacion
    ) -> Optional[Asignacion]:

        modelo = (
            self.db
            .query(AsignacionModel)
            .filter(
                AsignacionModel.id
                == asignacion_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.curso_id = (
            asignacion.curso_id
        )

        modelo.instructor_id = (
            asignacion.instructor_id
        )

        modelo.aula_id = (
            asignacion.aula_id
        )

        modelo.fecha_asignacion = (
            asignacion.fecha_asignacion
        )

        modelo.estado_asignacion = (
            asignacion.estado_asignacion
        )

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        asignacion_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(AsignacionModel)
            .filter(
                AsignacionModel.id
                == asignacion_id
            )
            .first()
        )

        if not modelo:
            return False

        self.db.delete(modelo)
        self.db.commit()

        return True

    def existe_conflicto_horario(
        self,
        curso_id: int,
        instructor_id: int,
        aula_id: int,
        excluir_asignacion_id: int | None = None,
    ) -> tuple[bool, str | None]:

        curso = (
            self.db
            .query(CursoModel)
            .filter(
                CursoModel.id
                == curso_id
            )
            .first()
        )

        if not curso:
            return False, None

        query = (
            self.db
            .query(AsignacionModel)
            .join(
                CursoModel,
                CursoModel.id
                == AsignacionModel.curso_id,
            )
            .filter(
                AsignacionModel.estado_asignacion
                == "ACTIVA",
                CursoModel.horario
                == curso.horario,
            )
        )

        if excluir_asignacion_id is not None:
            query = query.filter(
                AsignacionModel.id
                != excluir_asignacion_id
            )

        asignaciones = query.all()

        for asignacion in asignaciones:

            if (
                asignacion.instructor_id
                == instructor_id
            ):
                return (
                    True,
                    "El instructor ya tiene "
                    "un curso asignado en "
                    "el mismo horario",
                )

            if (
                asignacion.aula_id
                == aula_id
            ):
                return (
                    True,
                    "El aula ya está ocupada "
                    "en el mismo horario",
                )

        return False, None

    def existe_asignacion_activa_curso(
        self,
        curso_id: int,
        excluir_asignacion_id: int | None = None,
    ) -> bool:

        query = (
            self.db
            .query(AsignacionModel)
            .filter(
                AsignacionModel.curso_id
                == curso_id,
                AsignacionModel.estado_asignacion
                == "ACTIVA",
            )
        )

        if excluir_asignacion_id is not None:
            query = query.filter(
                AsignacionModel.id
                != excluir_asignacion_id
            )

        return query.first() is not None

    @staticmethod
    def _to_entity(
        modelo: AsignacionModel
    ) -> Asignacion:

        return Asignacion(
            id=modelo.id,
            curso_id=modelo.curso_id,
            instructor_id=modelo.instructor_id,
            aula_id=modelo.aula_id,
            fecha_asignacion=modelo.fecha_asignacion,
            estado_asignacion=modelo.estado_asignacion,
        )