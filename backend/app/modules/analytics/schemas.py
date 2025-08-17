from datetime import datetime
from typing import List
from pydantic import BaseModel


class OverviewStats(BaseModel):
    new_patients: int
    surgeries_total: int
    surgeries_completed: int
    surgeries_remaining: int
    avg_wait_time_minutes: float
    active_cases: int


class StatusCount(BaseModel):
    status: str
    count: int


class PatientActivityItem(BaseModel):
    patient_number: str
    name: str
    previous_status: str | None
    new_status: str
    changed_at: datetime


class RecentActivity(BaseModel):
    status_changes: List[PatientActivityItem]
    completed_today: List[str]  # list of patient numbers or names
    active_cases: List[str]     # list of patient numbers or names
