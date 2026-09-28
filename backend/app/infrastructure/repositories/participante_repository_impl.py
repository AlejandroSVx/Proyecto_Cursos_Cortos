from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.participante import Participante
from app.domain.repositories.participante_repository import (
    ParticipanteRepository,
)
from app.infrastructure.models.participante_model import (
    ParticipanteModel,
)


class ParticipanteRepositoryImpl(
    ParticipanteRepository
):

    def __init__(self, db: Session):
        self.db = db


    def crear(
        self,
        participante: Participante
    ) -> Participante:

        modelo = ParticipanteModel(
            numero_documento=participante.numero_documento,
            nombres=participante.nombres,
            apellidos=participante.apellidos,
            telefono=participante.telefono,
            correo_electronico=participante.correo_electronico,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)


    def listar(self) -> List[Participante]:

        modelos = (
            self.db
            .query(ParticipanteModel)
            .order_by(ParticipanteModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]


    def obtener_por_id(
        self,
        participante_id: int
    ) -> Optional[Participante]:

        modelo = (
            self.db
            .query(ParticipanteModel)
            .filter(
                ParticipanteModel.id
                == participante_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)


    def obtener_por_documento(
        self,
        numero_documento: str
    ) -> Optional[Participante]:

        modelo = (
            self.db
            .query(ParticipanteModel)
            .filter(
                ParticipanteModel.numero_documento
                == numero_documento
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)


    def actualizar(
        self,
        participante_id: int,
        participante: Participante
    ) -> Optional[Participante]:

        modelo = (
            self.db
            .query(ParticipanteModel)
            .filter(
                ParticipanteModel.id
                == participante_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.numero_documento = (
            participante.numero_documento
        )
        modelo.nombres = participante.nombres
        modelo.apellidos = participante.apellidos
        modelo.telefono = participante.telefono
        modelo.correo_electronico = (
            participante.correo_electronico
        )

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)


    def eliminar(
        self,
        participante_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(ParticipanteModel)
            .filter(
                ParticipanteModel.id
                == participante_id
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
        modelo: ParticipanteModel
    ) -> Participante:

        return Participante(
            id=modelo.id,
            numero_documento=modelo.numero_documento,
            nombres=modelo.nombres,
            apellidos=modelo.apellidos,
            telefono=modelo.telefono,
            correo_electronico=modelo.correo_electronico,
        )