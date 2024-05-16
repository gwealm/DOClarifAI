"""
This file is the entry point of the FastAPI application. 
It creates the FastAPI instance and includes the API routes.
"""
from fastapi import FastAPI,BackgroundTasks
from app.api.main import api_router
from fastapi.middleware.cors import CORSMiddleware
from app.gmail_automation.gmail_automation_client import GmailAutomationClient
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager

gmail_automation_client:GmailAutomationClient = GmailAutomationClient()
    

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=['*'],
)
app.include_router(api_router)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(gmail_automation_client.get_docs_from_email, 'interval', seconds=5)
    scheduler.start()
    yield


app = FastAPI(lifespan=lifespan)

