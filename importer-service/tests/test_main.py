"""
This file contains the tests for the main.py file.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_read_main():
  response = client.get("/")
  assert response.status_code == 200
  assert response.json() == {"msg": "Hello World"}
