from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.instructor import Instructor
from app.domain.repositories.instructor_repository import (
    InstructorRepository,
)
from app.infrastructure.models.instructor_model import (
    InstructorModel,
)


class InstructorRepositoryImpl(
    InstructorRepository
):

    def __init__(self, db: Session):
        self.db = db

    def crear(
        self,
        instructor: Instructor
    ) -> Instructor:

        modelo = InstructorModel(
            numero_documento=instructor.numero_documento,
            nombres=instructor.nombres,
            apellidos=instructor.apellidos,
            especialidad=instructor.especialidad,
            telefono=instructor.telefono,
            correo_electronico=instructor.correo_electronico,
            estado_instructor=instructor.estado_instructor,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(self) -> List[Instructor]:

        modelos = (
            self.db
            .query(InstructorModel)
            .order_by(InstructorModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        instructor_id: int
    ) -> Optional[Instructor]:

        modelo = (
            self.db
            .query(InstructorModel)
            .filter(
                InstructorModel.id == instructor_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def obtener_por_documento(
        self,
        numero_documento: str
    ) -> Optional[Instructor]:

        modelo = (
            self.db
            .query(InstructorModel)
            .filter(
                InstructorModel.numero_documento
                == numero_documento
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        instructor_id: int,
        instructor: Instructor
    ) -> Optional[Instructor]:

        modelo = (
            self.db
            .query(InstructorModel)
            .filter(
                InstructorModel.id == instructor_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.numero_documento = (
            instructor.numero_documento
        )
        modelo.nombres = instructor.nombres
        modelo.apellidos = instructor.apellidos
        modelo.especialidad = instructor.especialidad
        modelo.telefono = instructor.telefono
        modelo.correo_electronico = (
            instructor.correo_electronico
        )
        modelo.estado_instructor = (
            instructor.estado_instructor
        )

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        instructor_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(InstructorModel)
            .filter(
                InstructorModel.id == instructor_id
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
        modelo: InstructorModel
    ) -> Instructor:

        return Instructor(
            id=modelo.id,
            numero_documento=modelo.numero_documento,
            nombres=modelo.nombres,
            apellidos=modelo.apellidos,
            especialidad=modelo.especialidad,
            telefono=modelo.telefono,
            correo_electronico=modelo.correo_electronico,
            estado_instructor=modelo.estado_instructor,
        )