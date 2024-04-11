from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def read_main():
  return {"msg": "Hello World"}
