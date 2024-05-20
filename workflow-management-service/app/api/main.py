"""
    This file is used to include all the routers in the APIRouter.
"""
from fastapi import APIRouter

from app.api.routes import workflow
from app.api.routes import file
from app.api.routes import template

#workflow.router.include_router(file.router)

api_router = APIRouter()
api_router.include_router(workflow.router)
api_router.include_router(template.router)
