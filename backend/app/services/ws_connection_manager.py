from typing import List

from fastapi import WebSocket

from app.models import SocketPayload


class WSConnectionManager:
    _active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """Accepts an incoming connection"""
        await websocket.accept()
        self._active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """Disconnects a websocket connection"""
        self._active_connections.remove(websocket)

    async def broadcast(self, message: SocketPayload):
        """Broadcasts message to all connections"""
        for connection in self._active_connections:
            await connection.send_json(message.model_dump())
