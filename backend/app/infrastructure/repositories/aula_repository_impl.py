from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.aula import Aula
from app.domain.repositories.aula_repository import AulaRepository
from app.infrastructure.models.aula_model import AulaModel


class AulaRepositoryImpl(AulaRepository):

    def __init__(self, db: Session):
        self.db = db

    def crear(self, aula: Aula) -> Aula:

        modelo = AulaModel(
            nombre_aula=aula.nombre_aula,
            capacidad=aula.capacidad,
            ubicacion=aula.ubicacion,
            estado_aula=aula.estado_aula,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(self) -> List[Aula]:

        modelos = (
            self.db
            .query(AulaModel)
            .order_by(AulaModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        aula_id: int
    ) -> Optional[Aula]:

        modelo = (
            self.db
            .query(AulaModel)
            .filter(AulaModel.id == aula_id)
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        aula_id: int,
        aula: Aula
    ) -> Optional[Aula]:

        modelo = (
            self.db
            .query(AulaModel)
            .filter(AulaModel.id == aula_id)
            .first()
        )

        if not modelo:
            return None

        modelo.nombre_aula = aula.nombre_aula
        modelo.capacidad = aula.capacidad
        modelo.ubicacion = aula.ubicacion
        modelo.estado_aula = aula.estado_aula

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        aula_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(AulaModel)
            .filter(AulaModel.id == aula_id)
            .first()
        )

        if not modelo:
            return False

        self.db.delete(modelo)
        self.db.commit()

        return True

    @staticmethod
    def _to_entity(
        modelo: AulaModel
    ) -> Aula:

        return Aula(
            id=modelo.id,
            nombre_aula=modelo.nombre_aula,
            capacidad=modelo.capacidad,
            ubicacion=modelo.ubicacion,
            estado_aula=modelo.estado_aula,
        )