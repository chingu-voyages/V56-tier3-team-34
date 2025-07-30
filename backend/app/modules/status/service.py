from sqlalchemy.future import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.modules.status.models import Status


async def get_all_statuses(session: AsyncSession) -> list[Status]:
    result = await session.exec(select(Status).order_by(Status.order_index))
    return [row[0] for row in result.all()]
