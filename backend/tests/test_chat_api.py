from asyncio import CancelledError
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import HTTPStatusError

from app.models import Bot, ChatMessage
from app.services import chat_api


@pytest.fixture
def mock_bot():
    return Bot(name="bot1", persona=None)


@pytest.fixture
def mock_chat_history():
    return [ChatMessage(sender="User", message="Hello")]


@pytest.mark.asyncio
@patch("app.services.chat_api.httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_get_model_output_success(mock_post, mock_bot, mock_chat_history):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"model_output": "Hi there!"}
    mock_post.return_value = mock_response

    result = await chat_api.get_model_output(mock_bot, "User", mock_chat_history)

    assert result.ok is True
    assert result.message == "Hi there!"
    assert result.sender == "bot1"


@pytest.mark.asyncio
@patch("app.services.chat_api.httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_get_model_output_http_error(mock_post, mock_bot, mock_chat_history):
    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_response.raise_for_status = MagicMock(side_effect=HTTPStatusError(
        "Error", request=mock_response.request, response=mock_response))

    mock_post.return_value = mock_response

    result = await chat_api.get_model_output(mock_bot, "User", mock_chat_history)

    assert result.ok is False
    assert "Server Error: 500" in result.message


@pytest.mark.asyncio
@patch("app.services.chat_api.httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_get_model_output_generic_exception(mock_post, mock_bot, mock_chat_history):
    mock_post.side_effect = Exception("Something went wrong")

    result = await chat_api.get_model_output(mock_bot, "User", mock_chat_history)

    assert result.ok is False
    assert "Error: Something went wrong" in result.message


@pytest.mark.asyncio
@patch("app.services.chat_api.httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_get_model_output_cancelled(mock_post, mock_bot, mock_chat_history):
    mock_post.side_effect = CancelledError()

    result = await chat_api.get_model_output(mock_bot, "User", mock_chat_history)

    assert result.ok is False
    assert result.message == "Cancelled"
