import os
import tempfile

from fastapi import APIRouter, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse

from app.services.session import session

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
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


@router.get("/download")
async def download_chat_history_endpoint(background_tasks: BackgroundTasks):
    """Downloads the history as a text file"""
    tmp_path = None
    with tempfile.NamedTemporaryFile(delete=False, mode="w", suffix=".txt") as tmp:
        # Simply concatenate the chat messages
        tmp.write("\n".join(
            [f"{message.sender}: {message.message}" for message in session.chat_history]))
        tmp_path = tmp.name

    background_tasks.add_task(os.remove, tmp_path)

    return FileResponse(
        path=tmp_path,
        filename=f"Chat History for {session.user_name}",
        media_type="text/plain"
    )
