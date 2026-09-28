from dataclasses import dataclass
from typing import Optional


@dataclass
class Participante:
    id: Optional[int]
    numero_documento: str
    nombres: str
    apellidos: str
    telefono: str
    correo_electronico: str