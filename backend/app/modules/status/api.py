from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.modules.status.schemas import StatusRead
from app.modules.status.service import get_all_statuses

router = APIRouter()


@router.get("/", response_model=list[StatusRead])
async def read_statuses(session: Annotated[AsyncSession, Depends(get_session)]):
    all_status = await get_all_statuses(session)
    print(all_status)
    return [StatusRead.model_validate(status) for status in all_status]
