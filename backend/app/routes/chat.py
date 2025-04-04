from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.session import session

router = APIRouter()


@router.websocket("/chat_history_ws")
async def chat_websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for incoming and outgoing chat messages"""
    await session.connections.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            await session.handle_user_message(data)
    except WebSocketDisconnect:
        session.connections.disconnect(websocket)


@router.get("/chat_history")
async def get_chat_history_endpoint():
    """Gets the chat history"""
    return session.chat_history


@router.delete("/chat_history")
async def delete_chat_history_endpoint():
    """Clears chat history"""
    session.clear_chat()
