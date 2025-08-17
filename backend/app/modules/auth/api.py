# app/modules/auth/api.py

# Routes: login, register
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.security import create_access_token
from app.modules.auth.schemas import LoginRequest, Token
from app.modules.auth.service import authenticate_user

# router = APIRouter(prefix="/auth", tags=["Auth"])
router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    data: LoginRequest, session: Annotated[AsyncSession, Depends(get_session)]
):
    user = await authenticate_user(data.email, data.password, session)
    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return Token(access_token=token, role=user.role)
