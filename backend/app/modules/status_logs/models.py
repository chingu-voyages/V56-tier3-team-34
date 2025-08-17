from datetime import datetime
from typing import TYPE_CHECKING, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.patient.models import Patient
    from app.modules.status.models import Status
    from app.modules.user.models import User


class StatusLog(SQLModel, table=True):  # type: ignore
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    patient_id: UUID = Field(foreign_key="patient.id", index=True)
    previous_status: str | None = Field(default=None, foreign_key="status.status")
    new_status: str = Field(foreign_key="status.status")
    changed_by: UUID = Field(foreign_key="user.id")  # User who made the change
    changed_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    patient: "Patient" = Relationship(back_populates="status_logs")
    previous_status_obj: Optional["Status"] = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[StatusLog.previous_status]"}
    )
    new_status_obj: "Status" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[StatusLog.new_status]"}
    )
    changed_by_user: "User" = Relationship(
        sa_relationship_kwargs={"foreign_keys": "[StatusLog.changed_by]"}
    )
