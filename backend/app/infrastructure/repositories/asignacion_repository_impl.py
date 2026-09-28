from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.asignacion import Asignacion
from app.domain.repositories.asignacion_repository import (
    AsignacionRepository,
)
from app.infrastructure.models.asignacion_model import (
    AsignacionModel,
)


class AsignacionRepositoryImpl(
    AsignacionRepository
):

    def __init__(self, db: Session):
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

    def listar(self) -> List[Asignacion]:

        modelos = (
            self.db
            .query(AsignacionModel)
            .order_by(AsignacionModel.id)
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
                AsignacionModel.id == asignacion_id
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
                AsignacionModel.id == asignacion_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.curso_id = asignacion.curso_id
        modelo.instructor_id = asignacion.instructor_id
        modelo.aula_id = asignacion.aula_id
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
                AsignacionModel.id == asignacion_id
            )
            .first()
        )

        if not modelo:
            return False

        self.db.delete(modelo)
        self.db.commit()

        return True

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