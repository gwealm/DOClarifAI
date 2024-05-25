from fastapi import WebSocket

class ConnectionManager:
  """
    Manages WebSocket connections for multiple users.

    This class handles WebSocket connections, disconnections, and sending personal messages to connected users.
    It keeps track of active connections using a dictionary where the keys are user IDs and the values are WebSocket objects.
  """
  def __init__(self):
    self.active_connections: dict[int, WebSocket] = {}

  async def connect(self, websocket: WebSocket, user_id: int):
    await websocket.accept()
    self.active_connections[user_id] = websocket

  def disconnect(self, user_id: int):
    self.active_connections.pop(user_id, None)

  async def send_personal_message(self, message: str, user_id: int):
    websocket = self.active_connections.get(user_id)
    if websocket:
      await websocket.send_text(message)


manager = ConnectionManager()
