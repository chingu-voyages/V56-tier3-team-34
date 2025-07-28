import asyncio
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import engine, SessionLocal
from app.modules.user.models import User
from app.modules.user.schemas import RoleEnum
from app.core.security import hash_password


async def seed_users():
    async with SessionLocal() as session:
        admin = User(
            name="Admin Team",
            email="admin@hospital.com",
            hashed_password=hash_password("password"),
            role=RoleEnum.admin
        )
        surgeon = User(
            name="Surgical Team",
            email="surgeon@hospital.com",
            hashed_password=hash_password("password"),
            role=RoleEnum.surgical_team
        )

        session.add_all([admin, surgeon])
        await session.commit()
        print("✅ Seeded admin and surgical_team users.")


if __name__ == "__main__":
    asyncio.run(seed_users())
