from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession

from .service import get_users
from .schemas import UserRead, RoleEnum
from app.shared.role_checker import require_admin_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserRead])
async def read_users(
    email: Optional[str] = Query(None),
    role: Optional[RoleEnum] = Query(None),
    session: AsyncSession = Depends(get_session),
    _: UserRead = Depends(require_admin_user)  # Enforce admin access
):
    users = await get_users(session=session, email=email, role=role)
    return [UserRead.model_validate(user) for user in users]