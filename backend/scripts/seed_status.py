import asyncio

from sqlmodel import select

from app.core.database import SessionLocal
from app.modules.status.models import Status


async def seed_statuses():
    statuses = [
        {"status": "Checked In", "message": "In the facility awaiting their procedure.", "color": "#4CAF50", "order_index": 0},
        {"status": "Pre-Procedure", "message": "Undergoing surgical preparation.", "color": "#4CAF50", "order_index": 1},
        {"status": "In-progress", "message": "Surgical procedure is underway.", "color": "#4CAF50", "order_index": 2},
        {"status": "Closing", "message": "Surgery completed. The patient is being prepared for recovery.", "color": "#4CAF50", "order_index": 3},
        {"status": "Recovery", "message": "Patient transferred to post-surgery recovery room.", "color": "#4CAF50", "order_index": 4},
        {"status": "Complete", "message": "Recovery completed. Patient awaiting dismissal", "color": "#4CAF50", "order_index": 5},
        {"status": "Dismissal", "message": "Transferred to a hospital room for an overnight stay or for outpatient procedures, the patient has left the hospital.", "color": "#4CAF50", "order_index": 6},
    ]

    async with SessionLocal() as session:
        existing_statuses = await session.exec(select(Status))
        existing_list = existing_statuses.all()

        if not existing_list:
            session.add_all([Status(**s) for s in statuses])
            await session.commit()
            print("✅ Seeded status data.")
        else:
            print("⚠️ Status table already seeded. Skipping.")


if __name__ == "__main__":
    asyncio.run(seed_statuses())
