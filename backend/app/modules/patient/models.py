from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.status.models import Status
    from app.modules.status_logs.models import StatusLog
    from app.modules.user.models import User


class Patient(SQLModel, table=True):  # type: ignore
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    patient_number: str = Field(unique=True, index=True)
    first_name: str
    last_name: str
    address: str
    city: str
    state: str
    country: str
    phone: str
    email: str
    procedure: str
    scheduled_time: datetime
    surgeon_id: UUID | None = Field(default=None, foreign_key="user.id")
    room_no: str | None = Field(default=None)
    note: str | None = Field(default=None)
    status: str = Field(foreign_key="status.status")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    surgeon: Optional["User"] = Relationship(back_populates="patients")
    status_obj: Optional["Status"] = Relationship(back_populates="patients")
    status_logs: list["StatusLog"] = Relationship(
        back_populates="patient",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
