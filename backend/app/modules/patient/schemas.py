from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class PatientCreate(BaseModel):
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
    surgeon_id: UUID | None = Field(None)
    room_no: str | None = Field(None)
    note: str | None = Field(None)


class PatientCreateResponse(BaseModel):
    patient_number: str
    name: str
    status: str


class PatientRead(BaseModel):
    id: UUID
    patient_number: str
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
    surgeon_id: UUID | None
    room_no: str | None
    note: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PatientUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    country: str | None = None
    phone: str | None = None
    email: str | None = None
    procedure: str | None = None
    scheduled_time: datetime | None = None
    surgeon_id: UUID | None = None
    room_no: str | None = None
    note: str | None = None
    status: str | None = None


class PatientSummary(BaseModel):
    patient_number: str
    first_name: str
    last_name: str
    status: str
    email: str

    model_config = {"from_attributes": True}
