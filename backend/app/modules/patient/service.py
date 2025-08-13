import random
import string
from datetime import date, datetime
from math import ceil
from typing import TYPE_CHECKING
from uuid import UUID

from fastapi import Depends, HTTPException, status
from sqlalchemy import String, cast, func
from sqlalchemy.sql.functions import concat
from sqlmodel import and_, select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.modules.patient.models import Patient
from app.modules.patient.schemas import PatientRead, PatientSummary
from app.modules.status_logs.models import StatusLog

if TYPE_CHECKING:
    from app.modules.patient.schemas import (
        PatientCreate,
        PatientUpdate,
    )


class PatientService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def _generate_unique_patient_number(self) -> str:
        """Generate a unique 6-character alphanumeric patient number."""
        while True:
            patient_number = "".join(
                random.choices(string.ascii_uppercase + string.digits, k=6)
            )
            result = await self.session.exec(
                select(Patient).where(Patient.patient_number == patient_number)
            )
            if not result.first():  # If no patient exists with this number, return it
                return patient_number

    async def create_patient(
        self, patient_data: "PatientCreate", created_by_user_id: UUID
    ):
        """
        Create a new patient (Admin only).
        """
        patient_number = await self._generate_unique_patient_number()

        patient = Patient(
            patient_number=patient_number,
            first_name=patient_data.first_name,
            last_name=patient_data.last_name,
            address=patient_data.address,
            city=patient_data.city,
            state=patient_data.state,
            country=patient_data.country,
            phone=patient_data.phone,
            email=patient_data.email,
            procedure=patient_data.procedure,
            scheduled_time=patient_data.scheduled_time,
            surgeon_id=patient_data.surgeon_id,
            room_no=patient_data.room_no,
            note=patient_data.note,
            status="Checked In",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        self.session.add(patient)
        await self.session.commit()
        await self.session.refresh(patient)

        # Create initial status log entry
        status_log = StatusLog(
            patient_id=patient.id,
            previous_status=None,  # No previous status for new patient
            new_status="Checked In",
            changed_by=created_by_user_id,
            changed_at=datetime.utcnow(),
        )

        self.session.add(status_log)
        await self.session.commit()

        return {
            "patient_number": patient.patient_number,
            "name": f"{patient.first_name} {patient.last_name}",
            "status": patient.status,
        }

    async def update_patient(
        self,
        patient_number: str,
        patient_update: "PatientUpdate",
        changed_by_user_id: UUID,
    ) -> "PatientRead":
        """
        Update patient info (except patient_number).
        If status changes, log it in StatusLog.
        """
        result = await self.session.exec(
            select(Patient).where(Patient.patient_number == patient_number)
        )
        patient = result.first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found"
            )

        previous_status = patient.status

        update_data = patient_update.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(patient, field, value)

        patient.updated_at = datetime.utcnow()

        self.session.add(patient)
        await self.session.commit()
        await self.session.refresh(patient)

        if "status" in update_data and update_data["status"] != previous_status:
            status_log = StatusLog(
                patient_id=patient.id,
                previous_status=previous_status,
                new_status=update_data["status"],
                changed_by=changed_by_user_id,
                changed_at=datetime.utcnow(),
            )
            self.session.add(status_log)
            await self.session.commit()

        return PatientRead.model_validate(patient)

    async def retrieve_patient(self, patient_number: str) -> "PatientSummary":
        """
        Get a patient by patient_number (Admin only).
        """
        result = await self.session.exec(
            select(Patient).where(Patient.patient_number == patient_number)
        )
        patient = result.first()

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found"
            )

        return PatientSummary.model_validate(patient)

    async def retrieve_all_patients(self, page: int = 1, limit: int = 10):
        """
        Get paginated patients list.
        """
        total_query = select(func.count()).select_from(Patient)
        total_result = await self.session.exec(total_query)
        total = total_result.one_or_none()

        offset = (page - 1) * limit
        statement = select(Patient).offset(offset).limit(limit)
        result = await self.session.exec(statement)
        patients = result.all()

        return {
            "items": [PatientRead.model_validate(patient) for patient in patients],
            "total": total,
            "page": page,
            "pages": ceil(total / limit) if total > 0 else 1,
        }

    async def find_patients(
        self,
        name: str | None = None,
        status: str | None = None,
        scheduled_date: date | None = None,
        surgeon: str | None = None,
    ) -> list["PatientRead"]:
        """
        Search patients by multiple optional filters.
        """
        query = select(Patient)
        conditions = []

        if name:
            name_condition = (
                Patient.first_name.ilike(f"%{name}%")  # type: ignore
                | Patient.last_name.ilike(f"%{name}%")  # type: ignore
                | concat(Patient.first_name, " ", Patient.last_name).ilike(f"%{name}%")  # type: ignore
            )
            conditions.append(name_condition)

        if status:
            conditions.append(Patient.status.ilike(f"%{status}%"))  # type: ignore

        if scheduled_date:
            conditions.append(func.date(Patient.scheduled_time) == scheduled_date)

        if surgeon:
            conditions.append(cast(Patient.surgeon_id, String).ilike(f"%{surgeon}%"))  # type: ignore

        if conditions:
            query = query.where(and_(*conditions))

        result = await self.session.exec(query)
        patients = result.all()

        return [PatientRead.model_validate(patient) for patient in patients]

    async def fetch_patient_stats(self):
        """
        Get overview patient metrics.
        """
        today = date.today()

        total_stmt = select(func.count()).select_from(Patient)
        total = (await self.session.exec(total_stmt)).one_or_none()

        # active patients (status != 'Dismissal')
        active_stmt = (
            select(func.count())
            .select_from(Patient)
            .where(Patient.status != "Dismissal")
        )
        active = (await self.session.exec(active_stmt)).one_or_none()

        # scheduled today
        today_stmt = (
            select(func.count())
            .select_from(Patient)
            .where(func.date(Patient.scheduled_time) == today)
        )
        today_count = (await self.session.exec(today_stmt)).one_or_none()

        return {
            "total_patient": total,
            "active_patient": active,
            "scheduled_today": today_count,
        }


SESSION_DEPENDENCY = Depends(get_session)


def get_patient_service(session: AsyncSession = SESSION_DEPENDENCY) -> PatientService:
    return PatientService(session)
