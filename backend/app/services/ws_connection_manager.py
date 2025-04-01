from typing import List
from fastapi import WebSocket

from app.models import ChatResponse


class WSConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: ChatResponse):
        for connection in self.active_connections:
            await connection.send_json(message.model_dump())
