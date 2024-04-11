from fastapi import APIRouter

from app.api.routes import users, oauth, hello_world

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(oauth.router, prefix="/oauth", tags=["oauth"])
api_router.include_router(hello_world.router, tags=["hello_world"])
