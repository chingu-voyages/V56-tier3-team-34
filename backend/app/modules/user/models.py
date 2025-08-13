from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from .schemas import RoleEnum

if TYPE_CHECKING:
    from app.modules.patient.models import Patient


class User(SQLModel, table=True):  # type: ignore
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    role: RoleEnum

    patients: list["Patient"] = Relationship(back_populates="surgeon")
