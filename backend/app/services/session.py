import random
from app.services.chat_api import get_model_output
from app.services.ws_connection_manager import WSConnectionManager
from app.models import (
    Bot,
    ActiveBotSocketPayload,
    ChatMessage,
    ChatRequestPayload,
    ChatResponseSocketPayload,
)
from typing import List, Optional


class Session:
    """
    Chatroom session
    """

    _instance = None

    """Mapping from bot names to bot instances"""
    bots: dict[str, Bot] = {}

    chat_history: List[ChatMessage] = []
    user_name: Optional[str] = None

    connections = WSConnectionManager()

    _polling_bots = False

    _active_bot: Optional[str] = None

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
        if not self.bots[bot_name]:
            raise AppError(f"bot {bot_name} doesn't exist")
        self.bots.pop(bot_name)
        return self.bots

    def delete_all_bots(self):
        """
        Deletes all the bots
        """
        self.bots = {}
        return {}

    def clear_chat(self):
        """
        Clears chat history
        """
        self.chat_history = []

    def _pick_next_bot(self):
        """
        Picks the next bot to respond
        @return: the name of the bot picked, or None if on one is picked
        """
        last_sender = self.chat_history and self.chat_history[-1].sender or None
        # Do not choose the bot who just talked
        other_bot_names = list(filter(lambda x: x != last_sender, self.bots.keys()))
        return other_bot_names and random.choice(other_bot_names) or None

    async def _set_active_bot(self, bot_name: str | None):
        self._active_bot = bot_name
        active_bot_payload = ActiveBotSocketPayload(name=bot_name)
        print(active_bot_payload)
        await self.connections.broadcast(active_bot_payload)

    async def _generate_bot_response(self, bot_name):
        bot = self.bots[bot_name]
        await self._set_active_bot(bot_name)

        request = ChatRequestPayload(
            memory="",
            bot_name=bot_name,
            # HACK: Prepend the persona to the chat history
            chat_history=bot.persona
            and [
                ChatMessage(sender=self.user_name, message=persona_prompt(bot.persona))
            ]
            or [] + self.chat_history,
            prompt="",
            user_name=self.user_name,
        )

        bot_response = await get_model_output(request)

        if bot_name in self.bots:
            # Check the bot is still in the chat. Otherwise, ignore the message
            if bot_response.ok:
                # Add the latest bot response to the chat history
                self.chat_history.append(
                    ChatMessage(sender=bot_name, message=bot_response.message)
                )

            # Broadcast the bot response to the clients
            await self.connections.broadcast(
                ChatResponseSocketPayload(response=bot_response)
            )
        await self._set_active_bot(None)

    async def handle_user_message(self, message: str):
        """
        Handles message from user
        """
        if not self.user_name:
            raise AppError("user name must be set before sending a message")

        # Update chat history with the latest user message
        self.chat_history.append(ChatMessage(sender=self.user_name, message=message))

        if not self._polling_bots:
            # If we are not already polling all the bots, start doing it now
            self._polling_bots = True
            await self._start_polling_bots()
            self._polling_bots = False

    async def _start_polling_bots(self):
        while next_bot := self._pick_next_bot():
            # Continue asking bots for responses until we are stopped
            # Right now we don't stop unless there's only one bot who just spoke,
            # or there are not bots in the room.
            # As a future improvement, we can calculate each bot's engagement
            # level, and let the bots join or exit the conversation based on
            # their interest on the conversation.
            await self._generate_bot_response(next_bot)

    def set_user_name(self, name: str):
        """
        Sets the user's name
        """
        self.user_name = name


session = Session()


def persona_prompt(persona: str):
    """
    @return: a prompt to define bot's persona
    """
    return f"Response as the following persona: {persona}"


class AppError(Exception):
    """App Error"""

    def __init__(self, message):
        super().__init__(message)
