from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.patient.models import Patient


class Status(SQLModel, table=True):  # type: ignore
    status: str = Field(primary_key=True)
    message: str
    color: str
    order_index: int

    patients: list["Patient"] = Relationship(back_populates="status_obj")
