"""
This file is used to include all the routers in the application.
"""

from fastapi import APIRouter

from app.api.routes import files

api_router = APIRouter()
api_router.include_router(files.router, prefix="/files", tags=["files"])
