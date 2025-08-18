from datetime import datetime, timedelta, date
from typing import Optional
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession

from app.modules.patient.models import Patient
from app.modules.status_logs.models import StatusLog
from app.modules.status.models import Status
import uuid


class AnalyticsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_overview(
        self,
        start: Optional[date] = None,
        end: Optional[date] = None
    ) -> dict:
        """
        Return summary analytics data for a given date range.
        """
        # Case: neither start nor end is provided → today only
        if not start and not end:
            start = end = date.today()

        # Case: only end is provided → from a very early date to end
        if not start and end:
            # Optional: you can query earliest Patient.created_at here dynamically
            # or hardcode a sensible default
            start = date(2000, 1, 1)  # assuming safe lower bound

        # Case: only start is provided → from start to till today
        if start and not end:
            end = date.today()

        # Sanity check: start must not be after end
        if start > end:
            raise ValueError("Start date cannot be after end date")

        # Normalize to datetime range
        start_dt = datetime.combine(start, datetime.min.time())
        end_dt = datetime.combine(end, datetime.max.time())

        # New Patients
        new_patients_query = await self.session.exec(
            select(func.count())
            .select_from(Patient)
            .where(Patient.created_at.between(start_dt, end_dt))
        )
        new_patients = new_patients_query.one()

        # Surgeries scheduled in that range
        surgeries_query = await self.session.exec(
            select(Patient)
            .where(Patient.scheduled_time.between(start_dt, end_dt))
        )
        surgeries = surgeries_query.all()
        surgeries_total = len(surgeries)
        surgeries_completed = len([s for s in surgeries if s.status == "Complete"])
        surgeries_remaining = surgeries_total - surgeries_completed

        # Average waiting time (from first status to second status)
        logs_query = await self.session.exec(
            select(StatusLog)
            .where(StatusLog.changed_at.between(start_dt, end_dt))
        )
        logs = logs_query.all()

        # Fetch ALL status logs (not just filtered by date)
        logs_query = await self.session.exec(
            select(StatusLog)
        )
        logs = logs_query.all()

        # Map: patient_id -> sorted status logs
        log_map: dict[UUID, list[StatusLog]] = {}
        for log in logs:
            log_map.setdefault(log.patient_id, []).append(log)

        wait_times = []
        for logs in log_map.values():
            # Sort logs chronologically
            sorted_logs = sorted(logs, key=lambda l: l.changed_at)

            # Ensure at least 2 transitions
            if len(sorted_logs) >= 2:
                # Use only if the FIRST transition is within the date range
                if start_dt <= sorted_logs[0].changed_at <= end_dt:
                    delta = sorted_logs[1].changed_at - sorted_logs[0].changed_at
                    wait_times.append(delta.total_seconds() / 60)  # minutes

        avg_wait_time_minute = round(sum(wait_times) / len(wait_times), 2) if wait_times else 0.0

        # Active cases (not completed)
        active_query = await self.session.exec(
            select(func.count())
            .select_from(Patient)
            .where(Patient.status != "Complete")
            .where(Patient.created_at.between(start_dt, end_dt))
        )
        active_cases = active_query.one()

        return {
            "new_patients": new_patients,
            "surgeries_total": surgeries_total,
            "surgeries_completed": surgeries_completed,
            "surgeries_remaining": surgeries_remaining,
            "avg_wait_time_minutes": avg_wait_time_minute,
            "active_cases": active_cases
        }

    async def get_recent_activity(self) -> dict:
        """
        Return today's status changes, completed surgeries, and active cases.
        """
        today = date.today()
        start_dt = datetime.combine(today, datetime.min.time())
        end_dt = datetime.combine(today, datetime.max.time())

        # Status changes today
        status_log_query = await self.session.exec(
            select(StatusLog).where(StatusLog.changed_at.between(start_dt, end_dt))
        )
        status_changes = status_log_query.all()

        # Completed surgeries today
        completed_query = await self.session.exec(
            select(StatusLog)
            .where(StatusLog.new_status == "Complete")
            .where(StatusLog.changed_at.between(start_dt, end_dt))
        )
        completed_logs  = completed_query.all()
        completed_today = list({log.patient_id for log in completed_logs})

        # Active cases today
        active_query = await self.session.exec(
            select(Patient)
            .where(Patient.status != "Complete")
            .where(Patient.created_at <= end_dt)
        )
        active_cases = active_query.all()

        return {
            "status_changes": [log.dict() for log in status_changes],
            "completed_today": [p.patient_number for p in completed_today],
            "active_cases": [p.patient_number for p in active_cases],
        }

    async def get_status_breakdown(self) -> list[dict]:
        """
        Aggregate patient statuses, their count, and include status metadata.
        """
        # Join Patient.status -> Status.status and group by
        stmt = (
            select(
                Patient.status,
                func.count(Patient.id).label("count"),
                Status.message,
                Status.color,
                Status.order_index
            )
            .join(Status, Patient.status == Status.status)
            .group_by(Patient.status, Status.message, Status.color, Status.order_index)
        )

        result = await self.session.exec(stmt)
        breakdown = result.all()

        return [
            {
                "status": row.status,
                "count": row.count,
                "message": row.message,
                "color": row.color,
                "order_index": row.order_index,
            }
            for row in breakdown
        ]

# Dependency shortcut
from fastapi import Depends
from app.core.database import get_session

SESSION_DEPENDENCY = Depends(get_session)


def get_analytics_service(session: AsyncSession = SESSION_DEPENDENCY) -> AnalyticsService:
    return AnalyticsService(session)
