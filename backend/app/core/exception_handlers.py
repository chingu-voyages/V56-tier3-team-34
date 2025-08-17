# app/core/exception_handlers.py
import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


# Define custom handler
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):

    # Custom response for 404 errors
    if exc.status_code == 404:  # 💡 “Wrong endpoint or route.”
        logger.warning(f"404 Not Found: {request.url}")
        return JSONResponse(
            status_code=404,
            content={
                "error": "Route not found",
                "detail": f"The URL {request.url.path} does not exist.",
            },
        )

    # Default fallback for other HTTP exceptions (403, 405, etc.)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail or "An unexpected error occurred."},
    )


# Register with the app
def register_exception_handlers(app):
    app.add_exception_handler(StarletteHTTPException, custom_http_exception_handler)
