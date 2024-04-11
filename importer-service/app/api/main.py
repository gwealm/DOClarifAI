from fastapi import APIRouter

from app.api.routes import files, hello_world

api_router = APIRouter()
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(hello_world.router, tags=["hello_world"])
