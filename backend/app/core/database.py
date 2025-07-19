# app/core/database.py

"""
Sets up the SQLModel database connection (PostgreSQL).
Provides:
- `engine`: low-level DB connection
- `SessionLocal`: async session factory
- `get_session`: FastAPI dependency
- `init_db`: creates tables on startup
"""
import re
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.config import get_settings

# Load config
settings = get_settings()

# Transform sync URL to asyncpg-compatible URL
ASYNC_DATABASE_URL = re.sub(
    r"^postgresql:", "postgresql+asyncpg:", settings.DATABASE_URL or ""
)


# Create an async DB engine
engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

# Async session factory
SessionLocal = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db():
    """
    Creates all tables defined using SQLModel.
    Called once during app startup.
    """
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Yields a DB session.
    To be used inside FastAPI routes via `Depends`.
    """
    async with SessionLocal() as session:
        yield session
