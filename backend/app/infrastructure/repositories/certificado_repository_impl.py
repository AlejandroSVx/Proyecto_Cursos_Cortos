from typing import List, Optional

from sqlalchemy.orm import Session

from app.domain.entities.certificado import Certificado
from app.domain.repositories.certificado_repository import (
    CertificadoRepository,
)
from app.infrastructure.models.certificado_model import (
    CertificadoModel,
)


class CertificadoRepositoryImpl(
    CertificadoRepository
):

    def __init__(self, db: Session):
        self.db = db

    def crear(
        self,
        certificado: Certificado
    ) -> Certificado:

        modelo = CertificadoModel(
            inscripcion_id=certificado.inscripcion_id,
            codigo_certificado=certificado.codigo_certificado,
            fecha_emision=certificado.fecha_emision,
            estado_certificado=certificado.estado_certificado,
        )

        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def listar(self) -> List[Certificado]:

        modelos = (
            self.db
            .query(CertificadoModel)
            .order_by(CertificadoModel.id)
            .all()
        )

        return [
            self._to_entity(modelo)
            for modelo in modelos
        ]

    def obtener_por_id(
        self,
        certificado_id: int
    ) -> Optional[Certificado]:

        modelo = (
            self.db
            .query(CertificadoModel)
            .filter(
                CertificadoModel.id
                == certificado_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def obtener_por_inscripcion(
        self,
        inscripcion_id: int
    ) -> Optional[Certificado]:

        modelo = (
            self.db
            .query(CertificadoModel)
            .filter(
                CertificadoModel.inscripcion_id
                == inscripcion_id
            )
            .first()
        )

        if not modelo:
            return None

        return self._to_entity(modelo)

    def actualizar(
        self,
        certificado_id: int,
        certificado: Certificado
    ) -> Optional[Certificado]:

        modelo = (
            self.db
            .query(CertificadoModel)
            .filter(
                CertificadoModel.id
                == certificado_id
            )
            .first()
        )

        if not modelo:
            return None

        modelo.inscripcion_id = (
            certificado.inscripcion_id
        )

        modelo.codigo_certificado = (
            certificado.codigo_certificado
        )

        modelo.fecha_emision = (
            certificado.fecha_emision
        )

        modelo.estado_certificado = (
            certificado.estado_certificado
        )

        self.db.commit()
        self.db.refresh(modelo)

        return self._to_entity(modelo)

    def eliminar(
        self,
        certificado_id: int
    ) -> bool:

        modelo = (
            self.db
            .query(CertificadoModel)
            .filter(
                CertificadoModel.id
                == certificado_id
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
        modelo: CertificadoModel
    ) -> Certificado:

        return Certificado(
            id=modelo.id,
            inscripcion_id=modelo.inscripcion_id,
            codigo_certificado=modelo.codigo_certificado,
            fecha_emision=modelo.fecha_emision,
            estado_certificado=modelo.estado_certificado,
        )