import asyncio
import random
from typing import List, Optional

from app.models import (
    ActiveBotSocketPayload,
    Bot,
    ChatMessage,
    ChatResponseSocketPayload,
)
from app.services.chat_api import get_model_output
from app.services.ws_connection_manager import WSConnectionManager


class Session:
    """
    Chatroom session
    """
    # Singleton instance
    _instance = None

    # Mapping from bot names to bot instances
    bots: dict[str, Bot] = {}

    # The chat history, list of past messages
    chat_history: List[ChatMessage] = []

    # User's name
    user_name: Optional[str] = None

    # WebSocket connections
    connections = WSConnectionManager()

    _is_polling_bots = False

    _active_bot: Optional[str] = None

    _active_bot_response_task = None

    # Bots interrupted by user
    _interrupted = False

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def add_bot(self, bot_name: str, persona: Optional[str] = None):
        """
        Adds a new bot
        @param bot_name: name of the new bot
        @persona: optional, the persona of the bot
        """
        if bot_name in self.bots:
            raise AppError(f"bot {bot_name} already exists")
        self.bots[bot_name] = Bot(name=bot_name, persona=persona)

    def delete_bot(self, bot_name: str):
        """
        Deletes a bot
        """
        if bot_name not in self.bots:
            raise AppError(f"bot {bot_name} doesn't exist")
        self.bots.pop(bot_name)
        return self.bots

    def delete_all_bots(self):
        """
        Deletes all the bots
        """
        self.bots = {}
        return {}

    def interrupt_bots(self):
        """
        Interrupts the bots
        """
        self._interrupted = True
        if self._active_bot_response_task:
            self._active_bot_response_task.cancel()

    def set_user_name(self, name: str | None):
        """
        Sets the user's name
        """
        self.user_name = name

    def clear_chat(self):
        """
        Clears chat history
        """
        self.interrupt_bots()
        self.chat_history = []

    async def handle_user_message(self, message: str):
        """
        Handles message from user
        """
        if not self.user_name:
            raise AppError("user name must be set before sending a message")

        # Update chat history with the latest user message
        self.chat_history.append(ChatMessage(
            sender=self.user_name, message=message))

        if not self._is_polling_bots:
            # If we are not already polling all the bots, start doing it now
            self._is_polling_bots = True
            await self._start_polling_bots()
            self._is_polling_bots = False

    def _pick_next_bot(self):
        """
        Picks the next bot to respond
        @return: the name of the bot picked, or None if on one is picked
        """
        if self._interrupted:
            return None

        last_sender = self.chat_history and self.chat_history[-1].sender or None
        # Do not choose the bot who just talked
        other_bot_names = list(
            filter(lambda x: x != last_sender, self.bots.keys()))
        # Pick one bot randomly from the rest of the bots
        return other_bot_names and random.choice(other_bot_names) or None

    async def _set_active_bot(self, bot_name: str | None):
        """
        Sets the current active bot, and broadcasts the status to clients
        """
        self._active_bot = bot_name
        active_bot_payload = ActiveBotSocketPayload(name=bot_name)
        await self.connections.broadcast(active_bot_payload)

    async def _generate_bot_response(self, bot_name):
        """
        Requests response from bot and broadcasts response to clients
        """

        if bot_name not in self.bots:
            return

        await self._set_active_bot(bot_name)

        self._active_bot_response_task = asyncio.create_task(
            get_model_output(self.bots[bot_name],
                             self.user_name, self.chat_history))

        try:
            bot_response = await self._active_bot_response_task

            if bot_name in self.bots:
                # Check the bot is still in the chat. Otherwise, ignore the message
                if bot_response.ok:
                    # Add the latest bot response to the chat history
                    self.chat_history.append(
                        ChatMessage(sender=bot_name,
                                    message=bot_response.message)
                    )

                # Broadcast the bot response to the clients
                await self.connections.broadcast(
                    ChatResponseSocketPayload(response=bot_response)
                )
        finally:
            self._active_bot_response_task = None
            await self._set_active_bot(None)

    async def _start_polling_bots(self):
        self._interrupted = False
        while next_bot := self._pick_next_bot():
            # Continue asking bots for responses until we are stopped
            # Right now we only stop when:
            # 1. User asks for an interruption
            # 2. There is only one bot in the room, and sent the latest message
            # 3. There are no bots in the room.
            # As a future improvement, we can calculate each bot's engagement
            # level, and let the bots join or exit the conversation based on
            # their interest on the conversation.
            await self._generate_bot_response(next_bot)


session = Session()


class AppError(Exception):
    """App Error"""

    def __init__(self, message):
        super().__init__(message)
