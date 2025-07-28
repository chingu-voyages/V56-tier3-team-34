# app/modules/auth/service.py
# Auth logic, token issuing

from fastapi import HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core import security
from app.modules.user.models import User
from app.modules.user.service import get_user_by_email


async def authenticate_user(email: str, password: str, session: AsyncSession) -> User:
    user = await get_user_by_email(email, session)
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    return user
