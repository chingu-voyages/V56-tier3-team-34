from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.security import decode_access_token
from app.modules.user.schemas import RoleEnum, UserRead
from app.modules.user.service import get_user_by_id

# FastAPI utility that: Extracts a token from the Authorization header, Verifies that it’s a Bearer token, Returns the token string
# tokenUrl="/auth/login": hint for the OpenAPI docs (Swagger UI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> UserRead:
    payload = decode_access_token(token)
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await get_user_by_id(id=id, session=session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserRead.model_validate(user)


def require_admin_user(
    current_user: Annotated[UserRead, Depends(get_current_user)],
) -> UserRead:
    if current_user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions: Admins only.",
        )
    return current_user
