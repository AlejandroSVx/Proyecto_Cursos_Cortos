class Usuario:

    def __init__(
        self,
        id: int | None,
        username: str,
        password_hash: str,
        rol: str,
    ):
        self.id = id
        self.username = username
        self.password_hash = password_hash
        self.rol = rol