from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.session import session

router = APIRouter()

@router.websocket("/ws")
async def chat_websocket_endpoint(websocket: WebSocket):
    await session.connections.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await session.handle_user_message(data)
    except WebSocketDisconnect:
        session.connections.disconnect(websocket)

@router.get("/chat_history")
async def get_chat_history_endpoint():
    return session.chat_history