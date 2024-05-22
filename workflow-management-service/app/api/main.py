"""
    This file is used to include all the routers in the APIRouter.
"""
from fastapi import APIRouter

from app.api.routes import workflow
from app.api.routes import file
from app.api.routes import template
from app.api.routes import schema

workflow.router.include_router(file.router, tags=["files"])

api_router = APIRouter()
api_router.include_router(workflow.router, tags=["workflow"])
api_router.include_router(template.router, tags=["template"])
api_router.include_router(schema.router, tags=["schema"])
