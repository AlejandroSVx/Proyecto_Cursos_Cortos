from pydantic import (
    BaseModel,
    Field,
)


class UsuarioCreate(BaseModel):

    username: str = Field(
        min_length=3,
        max_length=100,
    )

    password: str = Field(
        min_length=6,
    )

    rol: str = "ADMINISTRATIVO"


class UsuarioResponse(BaseModel):

    id: int
    username: str
    rol: str


class TokenResponse(BaseModel):

    access_token: str
    token_type: str