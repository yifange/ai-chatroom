import asyncio
import os
from typing import List

import httpx
from dotenv import load_dotenv

from app.models import Bot, ChatMessage, ChatRequestPayload, ChatResponse

load_dotenv()

API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

# Ensure the env variable are set
if not API_URL or not API_KEY:
    raise ValueError("Missing API URL or API Key. Set them in .env file.")

HEADERS = {"Authorization": f"Bearer {API_KEY}",
           "Content-Type": "application/json"}


def _persona_prompt(persona: str):
    """
    @return: a prompt to define bot's persona
    """
    return f"Response as the following persona: {persona}"


def _get_request_payload(bot: Bot, user_name: str, chat_history: List[ChatMessage]) -> ChatRequestPayload:
    return ChatRequestPayload(
        memory="",
        bot_name=bot.name,
        # HACK: Prepend the persona to the chat history if it exists
        # An attempt to implement bot persona, but the memory field is not working
        chat_history=bot.persona
        and [
            ChatMessage(sender=user_name,
                        message=_persona_prompt(bot.persona))
        ]
        or [] + chat_history,
        prompt="",
        user_name=user_name,
    )


async def get_model_output(bot: Bot, user_name: str, chat_history: List[ChatMessage]) -> ChatResponse:
    payload = _get_request_payload(bot, user_name, chat_history)
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                httpx.URL(str(API_URL)),
                json=payload.model_dump(),
                headers=HEADERS,
                timeout=10,
            )
            response.raise_for_status()
            output = response.json().get("model_output")
            return ChatResponse(ok=True, sender=payload.bot_name, message=output)
        except httpx.HTTPStatusError as e:
            return ChatResponse(
                ok=False,
                sender=None,
                message=f"Server Error: {e.response.status_code} - {e.response.text}",
            )
        except asyncio.exceptions.CancelledError:
            return ChatResponse(ok=False, sender=None, message="Cancelled")
        except Exception as e:
            return ChatResponse(ok=False, sender=None, message=f"Error: {str(e)}")
