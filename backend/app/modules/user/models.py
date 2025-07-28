from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from .schemas import RoleEnum

class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: RoleEnum
