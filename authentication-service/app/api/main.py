"""
    This file is used to include all the routers in the APIRouter.
"""
from fastapi import APIRouter

from app.api.routes import users, oauth

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(oauth.router, prefix="/oauth", tags=["oauth"])
