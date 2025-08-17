from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.shared.role_checker import require_admin_user

from .schemas import RoleEnum, UserRead
from .service import get_users

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserRead])
async def read_users(
    _: Annotated[UserRead, Depends(require_admin_user)],  # Enforce admin access
    session: Annotated[AsyncSession, Depends(get_session)],
    email: Annotated[str | None, Query()] = None,
    role: Annotated[RoleEnum | None, Query()] = None,
):
    users = await get_users(session=session, email=email, role=role)
    return [UserRead.model_validate(user) for user in users]
