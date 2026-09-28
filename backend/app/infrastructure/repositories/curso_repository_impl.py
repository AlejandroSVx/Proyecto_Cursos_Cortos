from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.curso import Curso
from app.domain.repositories.curso_repository import CursoRepository
from app.infrastructure.models.curso_model import CursoModel


class CursoRepositoryImpl(CursoRepository):

    def __init__(self, db: Session):
        self.db = db


    def crear(self, curso: Curso) -> Curso:

        modelo = CursoModel(
            nombre=curso.nombre,
            tipo_actividad=curso.tipo_actividad,
            fecha_inicio=curso.fecha_inicio,
            fecha_fin=curso.fecha_fin,
            horario=curso.horario,
            costo=curso.costo,
            cupo_minimo=curso.cupo_minimo,
            cupo_maximo=curso.cupo_maximo,
            estado=curso.estado,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)


    def listar(self) -> List[Curso]:

        modelos = (
            self.db
            .query(CursoModel)
            .order_by(CursoModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]


    def obtener_por_id(
        self,
        curso_id: int
    ) -> Optional[Curso]:

        modelo = (
            self.db
            .query(CursoModel)
            .filter(
                CursoModel.id == curso_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)


    def actualizar(
        self,
        curso_id: int,
        curso: Curso
    ) -> Optional[Curso]:

        modelo = (
            self.db
            .query(CursoModel)
            .filter(
                CursoModel.id == curso_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.nombre = curso.nombre
        modelo.tipo_actividad = curso.tipo_actividad
        modelo.fecha_inicio = curso.fecha_inicio
        modelo.fecha_fin = curso.fecha_fin
        modelo.horario = curso.horario
        modelo.costo = curso.costo
        modelo.cupo_minimo = curso.cupo_minimo
        modelo.cupo_maximo = curso.cupo_maximo
        modelo.estado = curso.estado

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)


    def eliminar(
        self,
        curso_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(CursoModel)
            .filter(
                CursoModel.id == curso_id
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
        modelo: CursoModel
    ) -> Curso:

        return Curso(
            id=modelo.id,
            nombre=modelo.nombre,
            tipo_actividad=modelo.tipo_actividad,
            fecha_inicio=modelo.fecha_inicio,
            fecha_fin=modelo.fecha_fin,
            horario=modelo.horario,
            costo=modelo.costo,
            cupo_minimo=modelo.cupo_minimo,
            cupo_maximo=modelo.cupo_maximo,
            estado=modelo.estado,
        )