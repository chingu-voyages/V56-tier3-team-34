# test connectivity with database (Neon - postgresql) with SQLAlchemy/SQLModel

import asyncio
import os
import re

from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

load_dotenv()


async def async_main() -> None:
    engine = create_async_engine(
        re.sub(r"^postgresql:", "postgresql+asyncpg:", os.getenv("DATABASE_URL") or ""),
        echo=True,
    )
    async with engine.connect() as conn:
        result = await conn.execute(text("select 'hello world'"))
        print(result.fetchall())
    await engine.dispose()


asyncio.run(async_main())
