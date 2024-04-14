from fastapi import APIRouter

from app.api.routes import hello_world,document

api_router = APIRouter()
api_router.include_router(hello_world.router, tags=["hello_world"])
api_router.include_router(document.router, prefix="/documents", tags=["documents"])
