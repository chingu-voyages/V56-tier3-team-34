from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel

from .schemas import RoleEnum


class User(SQLModel, table=True):  # type: ignore
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: RoleEnum
