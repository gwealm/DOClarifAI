from fastapi import FastAPI, Depends, HTTPException, UploadFile
from dotenv import load_dotenv
from sap_business_document_processing import DoxApiClient
from typing import Annotated
import os
import shutil

app = FastAPI()
load_dotenv()


@app.get("/")
async def read_main():
  return {"msg": "Hello World"}

