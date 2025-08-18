from fastapi import APIRouter, Depends, Query
from datetime import date
from typing import Optional

from .service import AnalyticsService, get_analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview/")
async def overview(
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    service: AnalyticsService = Depends(get_analytics_service),
):
    """
    Get analytics overview for a date range (or today by default).
    """
    return await service.get_overview(start=start_date, end=end_date)


@router.get("/recent-activity/")
async def recent_activity(
    service: AnalyticsService = Depends(get_analytics_service),
):
    """
    Get recent activity for today (status changes, completed surgeries, active cases).
    """
    return await service.get_recent_activity()


@router.get("/status-breakdown/")
async def status_breakdown(
    service: AnalyticsService = Depends(get_analytics_service),
):
    """
    Get a breakdown of patients by their current status.
    """
    return await service.get_status_breakdown()
