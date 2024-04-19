"""
This file is the entry point of the FastAPI application. 
It creates the FastAPI instance and includes the API routes.
"""

from fastapi import FastAPI
from app.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=['*'],
)
app.include_router(api_router)
