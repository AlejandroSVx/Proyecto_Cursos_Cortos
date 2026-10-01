from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.inscripcion import (
    Inscripcion,
)

from app.domain.repositories.inscripcion_repository import (
    InscripcionRepository,
)

from app.infrastructure.models.inscripcion_model import (
    InscripcionModel,
)


class InscripcionRepositoryImpl(
    InscripcionRepository
):

    def __init__(
        self,
        db: Session
    ):
        self.db = db

    def crear(
        self,
        inscripcion: Inscripcion
    ) -> Inscripcion:

        modelo = InscripcionModel(
            participante_id=inscripcion.participante_id,
            curso_id=inscripcion.curso_id,
            fecha_inscripcion=inscripcion.fecha_inscripcion,
            estado=inscripcion.estado,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(
        self
    ) -> List[Inscripcion]:

        modelos = (
            self.db
            .query(InscripcionModel)
            .order_by(
                InscripcionModel.id
            )
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        inscripcion_id: int
    ) -> Optional[Inscripcion]:

        modelo = (
            self.db
            .query(InscripcionModel)
            .filter(
                InscripcionModel.id
                == inscripcion_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        inscripcion_id: int,
        inscripcion: Inscripcion
    ) -> Optional[Inscripcion]:

        modelo = (
            self.db
            .query(InscripcionModel)
            .filter(
                InscripcionModel.id
                == inscripcion_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.participante_id = (
            inscripcion.participante_id
        )

        modelo.curso_id = (
            inscripcion.curso_id
        )

        modelo.fecha_inscripcion = (
            inscripcion.fecha_inscripcion
        )

        modelo.estado = (
            inscripcion.estado
        )

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        inscripcion_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(InscripcionModel)
            .filter(
                InscripcionModel.id
                == inscripcion_id
            )
            .first()
        )

        if not modelo:
            return False

        self.db.delete(modelo)
        self.db.commit()

        return True

    def existe_inscripcion_activa(
        self,
        participante_id: int,
        curso_id: int,
        excluir_inscripcion_id: int | None = None,
    ) -> bool:

        query = (
            self.db
            .query(InscripcionModel)
            .filter(
                InscripcionModel.participante_id
                == participante_id,
                InscripcionModel.curso_id
                == curso_id,
                InscripcionModel.estado
                != "CANCELADA",
            )
        )

        if excluir_inscripcion_id is not None:
            query = query.filter(
                InscripcionModel.id
                != excluir_inscripcion_id
            )

        return query.first() is not None

    def contar_inscripciones_activas(
        self,
        curso_id: int
    ) -> int:

        return (
            self.db
            .query(InscripcionModel)
            .filter(
                InscripcionModel.curso_id
                == curso_id,
                InscripcionModel.estado
                != "CANCELADA",
            )
            .count()
        )

    @staticmethod
    def _to_entity(
        modelo: InscripcionModel
    ) -> Inscripcion:

        return Inscripcion(
            id=modelo.id,
            participante_id=modelo.participante_id,
            curso_id=modelo.curso_id,
            fecha_inscripcion=modelo.fecha_inscripcion,
            estado=modelo.estado,
        )