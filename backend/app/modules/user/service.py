from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from .models import User
from typing import List, Optional
from .schemas import RoleEnum

async def get_user_by_id(id: str, session: AsyncSession) -> User | None:
    result = await session.exec(select(User).where(User.id == id))
    return result.one_or_none()

async def get_user_by_email(email: str, session: AsyncSession) -> User | None:
    result = await session.exec(select(User).where(User.email == email))
    return result.one_or_none()

async def get_users(session: AsyncSession, email: Optional[str] = None, role: Optional[RoleEnum] = None) -> List[User]:
    query = select(User)
    if email:
        query = query.where(User.email == email)
    if role:
        query = query.where(User.role == role)

    result = await session.exec(query)
    return result.all()