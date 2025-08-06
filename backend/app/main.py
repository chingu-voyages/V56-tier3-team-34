# app/main.py

"""
App entrypoint.
- Creates FastAPI app
- Loads environment config
- Initializes DB on startup using lifespan
- Includes routers from each module
"""

import socket
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.database import init_db
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ✅ Called on application startup
    await init_db()

    # ⬅️ Runs the app
    yield


def create_app() -> FastAPI:
    # Initialize logging early
    setup_logging()

    settings = get_settings()
    app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

    # ✅ Register all exception handlers
    register_exception_handlers(app)

    # ✅ Health check at root
    @app.get("/", tags=["health"])
    async def health_check():
        ip = socket.gethostbyname(socket.gethostname())
        return {"message": f"Server is running at {ip} and healthy"}

    # ✅ Modular routers
    from app.modules.auth.api import router as auth_router
    from app.modules.status.api import router as status_router
    from app.modules.user.api import router as user_router
    from app.modules.chat_inference.api import router as chat_router
    app.include_router(auth_router, prefix="/auth", tags=["auth"])
    app.include_router(user_router)
    app.include_router(status_router, prefix="/status", tags=["status"])

    app.include_router(user_router)
    app.include_router(chat_router)

    return app


# 👇 Uvicorn uses this
app = create_app()
