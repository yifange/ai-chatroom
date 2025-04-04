from unittest.mock import AsyncMock

import pytest

from app.models import ChatResponse, ChatResponseSocketPayload
from app.services.ws_connection_manager import WSConnectionManager


@pytest.fixture
def ws_manager():
    return WSConnectionManager()


@pytest.fixture
def mock_websocket():
    websocket = AsyncMock()
    websocket.send_json = AsyncMock()
    return websocket


@pytest.fixture
def mock_websocket2():
    websocket = AsyncMock()
    websocket.send_json = AsyncMock()
    return websocket


@pytest.mark.asyncio
async def test_broadcast(ws_manager, mock_websocket, mock_websocket2):
    await ws_manager.connect(mock_websocket)
    await ws_manager.connect(mock_websocket2)

    assert mock_websocket.accept.called
    assert mock_websocket2.accept.called
    assert len(ws_manager._active_connections) == 2
    assert ws_manager._active_connections[0] == mock_websocket
    assert ws_manager._active_connections[1] == mock_websocket2

    message = ChatResponseSocketPayload(
        response=ChatResponse(ok=True, sender="bot1", message="Hello"))

    await ws_manager.broadcast(message)

    assert mock_websocket.send_json.called
    assert mock_websocket2.send_json.called
    assert mock_websocket.send_json.call_count == 1
    assert mock_websocket2.send_json.call_count == 1

    mock_websocket.send_json.assert_any_call(message.model_dump())
    mock_websocket2.send_json.assert_any_call(message.model_dump())
