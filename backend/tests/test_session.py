from unittest.mock import AsyncMock, patch

import pytest

from app.models import ChatMessage, ChatResponse
from app.services.session import AppError, Session


@pytest.fixture
def session_instance():
    # Reset state between tests
    session = Session()
    session.delete_all_bots()
    session.clear_chat()
    session.set_user_name("User")
    return session


def test_add_bot(session_instance):
    session_instance.add_bot("bot1", persona="friendly")
    assert "bot1" in session_instance.bots
    assert session_instance.bots["bot1"].persona == "friendly"


def test_add_existing_bot_raises_error(session_instance):
    session_instance.add_bot("bot1")
    with pytest.raises(AppError, match="bot bot1 already exists"):
        session_instance.add_bot("bot1")


def test_delete_bot(session_instance):
    session_instance.add_bot("bot1")
    session_instance.delete_bot("bot1")
    assert "bot1" not in session_instance.bots


def test_delete_nonexistent_bot_raises_error(session_instance):
    with pytest.raises(AppError):
        session_instance.delete_bot("ghost")


def test_delete_all_bots(session_instance):
    session_instance.add_bot("bot1")
    session_instance.add_bot("bot2")
    session_instance.delete_all_bots()
    assert session_instance.bots == {}


def test_set_user_name(session_instance):
    session_instance.set_user_name("Alice")
    assert session_instance.user_name == "Alice"


def test_clear_chat(session_instance):
    session_instance.set_user_name("Alice")
    session_instance.chat_history.append(
        ChatMessage(sender="Alice", message="Hi"))
    session_instance.clear_chat()
    assert session_instance.chat_history == []
    assert session_instance._interrupted is True


def test_pick_next_bot_last_message_from_user(session_instance, monkeypatch):
    session_instance.set_user_name("User")
    session_instance.chat_history.append(
        ChatMessage(sender="User", message="Hi"))
    session_instance._interrupted = False

    session_instance.add_bot("bot1")
    session_instance.add_bot("bot2")

    monkeypatch.setattr("random.choice", lambda x: x[0])  # deterministic
    next_bot = session_instance._pick_next_bot()
    assert next_bot == "bot1"


def test_pick_next_bot_last_message_from_bot(session_instance, monkeypatch):
    session_instance.set_user_name("User")
    session_instance.chat_history.append(
        ChatMessage(sender="bot1", message="Hi"))
    session_instance._interrupted = False

    session_instance.add_bot("bot1")
    session_instance.add_bot("bot2")

    monkeypatch.setattr("random.choice", lambda x: x[0])  # deterministic
    next_bot = session_instance._pick_next_bot()
    assert next_bot == "bot2"


@pytest.mark.asyncio
@patch("app.services.session.get_model_output", new_callable=AsyncMock)
@patch.object(Session.connections, "broadcast", new_callable=AsyncMock)
async def test_handle_user_message_triggers_polling(mock_broadcast, mock_get_output, session_instance):
    mock_get_output.return_value = ChatResponse(
        ok=True, sender="bot1", message="Hello from bot")
    session_instance.add_bot("bot1")

    await session_instance.handle_user_message("Hi!")

    assert session_instance.chat_history[-1].sender == "bot1"
    assert session_instance.chat_history[-1].message == "Hello from bot"
    mock_broadcast.assert_called()


@pytest.mark.asyncio
@patch("app.services.session.get_model_output", new_callable=AsyncMock)
@patch.object(Session.connections, "broadcast", new_callable=AsyncMock)
async def test_generate_bot_response_broadcasts_message(mock_broadcast, mock_get_output, session_instance):
    session_instance.add_bot("bot2")

    mock_response = ChatResponse(ok=True, sender="bot2", message="Bot reply")
    mock_get_output.return_value = mock_response

    await session_instance._generate_bot_response("bot2")

    assert session_instance.chat_history[-1].sender == "bot2"
    assert session_instance.chat_history[-1].message == "Bot reply"
    mock_broadcast.assert_called()
