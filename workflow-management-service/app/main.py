from fastapi import FastAPI, Depends, HTTPException
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import httpx
import asyncio

app = FastAPI()
load_dotenv()

CLIENT_ID = os.getenv("SAP_CLIENT_ID")
CLIENT_SECRET = os.getenv("SAP_CLIENT_SECRET")
SAP_OAUTH_URL = os.getenv("SAP_OAUTH_URL")

class TokenManager:
    def __init__(self):
        self.token = None
        self.token_expiry = None

    async def get_token(self):
        if self.token is None or datetime.now() >= self.token_expiry:
            await self.refresh_token()
        return self.token

    async def refresh_token(self):
        async with httpx.AsyncClient() as client:
            payload = {
                "grant_type": "client_credentials",
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET
            }
            print(f"{SAP_OAUTH_URL}/oauth/token",payload)
            response = await client.post(f"{SAP_OAUTH_URL}/oauth/token", data=payload)
            if response.status_code == 200:
                token_data = response.json()
                self.token = token_data["access_token"]
                self.token_expiry = datetime.now() + timedelta(seconds=token_data["expires_in"])
                refresh_token_background()
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to refresh token")

token_manager = TokenManager()

async def get_valid_token():
    return await token_manager.get_token()

async def refresh_token_background():
    expires_in = token_manager.token_expiry - datetime.now()
    await asyncio.sleep(expires_in.total_seconds() - 10)
    await token_manager.refresh_token()

@app.get("/")
async def read_main():
  return {"msg": "Hello World"}


@app.get("/protected")
async def protected_route(token: str = Depends(get_valid_token)):
    return token