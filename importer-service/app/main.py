from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.api.main import api_router
from app.websockets.manager import manager
from app.gmail_automation.gmail_automation_client import GmailAutomationClient
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager

gmail_automation_client:GmailAutomationClient = GmailAutomationClient()

@asynccontextmanager
async def lifespan(app: FastAPI):
  scheduler = AsyncIOScheduler()
  scheduler.add_job(gmail_automation_client.get_docs_from_email, "interval", seconds=5)
  scheduler.start()
  yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
  await manager.connect(websocket, user_id)
  try:
    while True:
      await websocket.receive_text()  # Keeping the connection open
  except WebSocketDisconnect:
    manager.disconnect(user_id)

app.include_router(api_router)
