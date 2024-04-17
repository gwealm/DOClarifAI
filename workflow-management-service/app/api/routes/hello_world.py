"""
  boilerplate endpoint for setting up FastAPI
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_main():
  """
    GET request to the root endpoint
  """
  return {"msg": "Hello World"}
