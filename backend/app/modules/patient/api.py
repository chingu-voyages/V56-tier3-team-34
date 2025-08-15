# app/modules/patient/api.py

from datetime import date
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, status

from app.modules.patient.schemas import (
    PatientCreate,
    PatientCreateResponse,
    PatientRead,
    PatientSummary,
    PatientUpdate,
)
from app.modules.patient.service import PatientService, get_patient_service
from app.modules.user.schemas import RoleEnum, UserRead
from app.shared.role_checker import require_admin_user, require_roles

router = APIRouter()


@router.post(
    "/", response_model=PatientCreateResponse, status_code=status.HTTP_201_CREATED
)
async def add_patient(
    patient_data: PatientCreate,
    current_user: Annotated[UserRead, Depends(require_admin_user)],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
):
    return await patient_service.create_patient(
        patient_data=patient_data, created_by_user_id=current_user.id
    )


@router.put("/{patient_number}", response_model=PatientRead)
async def update_patient_info(
    patient_number: str,
    patient_update: PatientUpdate,
    current_user: Annotated[UserRead, Depends(require_admin_user)],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
):
    return await patient_service.update_patient(
        patient_number=patient_number,
        patient_update=patient_update,
        changed_by_user_id=current_user.id,
    )


@router.get("/{patient_number}", response_model=PatientRead)
async def get_patient_by_number(
    patient_number: str,
    current_user: Annotated[UserRead, Depends(require_admin_user)],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
):
    return await patient_service.retrieve_patient(patient_number)


@router.get("/", response_model=dict)
async def get_all_patients(
    current_user: Annotated[
        UserRead, Depends(require_roles([RoleEnum.admin, RoleEnum.surgical_team]))
    ],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
) -> Any:
    return await patient_service.retrieve_all_patients(page=page, limit=limit)


@router.get("/search/", response_model=list[PatientRead])
async def search_patients(
    current_user: Annotated[
        UserRead, Depends(require_roles([RoleEnum.admin, RoleEnum.surgical_team]))
    ],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
    name: str | None = None,
    status: str | None = None,
    scheduled_date: date | None = None,
    surgeon: str | None = None,
):
    return await patient_service.find_patients(
        name=name, status=status, scheduled_date=scheduled_date, surgeon=surgeon
    )


@router.get("/stats/", response_model=dict)
async def get_patient_stats(
    current_user: Annotated[UserRead, Depends(require_admin_user)],
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
):
    return await patient_service.fetch_patient_stats()


@router.get("/today-status-board/", response_model=list[PatientSummary])
async def get_today_patients(
    patient_service: Annotated[PatientService, Depends(get_patient_service)],
):
    return await patient_service.get_today_patients_summary()
