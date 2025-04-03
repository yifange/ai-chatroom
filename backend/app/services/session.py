import random
from app.services.chat_api import get_model_output
from app.services.ws_connection_manager import WSConnectionManager
from app.models import Bot, ChatMessage, ChatRequestPayload
from typing import List, Optional


class Session:
    """
    Chatroom session
    """
    _instance = None
    # bot name -> Bot
    bots: dict[str, Bot] = {}

    chat_history: List[ChatMessage] = []
    user_name: Optional[str] = None

    connections = WSConnectionManager()

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def add_bot(self, bot_name: str, persona: str):
        """
        Adds a new bot
        @param bot_name: name of the new bot
        @persona: optional, the persona of the bot
        """
        if bot_name in self.bots:
            raise AppError(f"bot {bot_name} already exists")
        self.bots[bot_name] = Bot(
            name=bot_name,
            persona=persona
        )

    def delete_bot(self, bot_name: str):
        """
        Deletes a bot
        """
        if not self.bots[bot_name]:
            raise AppError(f"bot {bot_name} doesn't exist")
        self.bots.pop(bot_name)

    def clear_chat(self):
        """
        Clears chat history
        """
        self.chat_history = []

    def _pick_next_bot(self):
        """
        Picks the next bot to respond
        @return: the name of the bot picked
        """
        last_sender = self.chat_history and self.chat_history[-1].sender or None
        # Do not choose the bot who just talked
        other_bot_names = filter(
            lambda x: x != last_sender, map(lambda x: x.name, self.bots))
        return random.choice(other_bot_names)

    async def handle_user_message(self, message: str):
        """
        Handles message from user
        """
        if not self.user_name:
            raise AppError("user name must be set before sending a message")

        self.chat_history.append(ChatMessage(
            sender=self.user_name,
            message=message
        ))

        new_responses: List[ChatMessage] = []

        # Send messages to the bots and ask for response
        for bot_name, bot in self.bots.items():
            # TODO: pick the next bot
            # TODO: decide whether the bot wants to talk

            model_output = await get_model_output(ChatRequestPayload(
                memory="",
                bot_name=bot_name,
                # HACK: Prepend the persona to the chat history
                chat_history=bot.persona and [ChatMessage(sender=self.user_name,
                                                  message=persona_prompt(bot.persona))] or [] + self.chat_history,
                prompt="",
                user_name=self.user_name
            ))
            # TODO: Retry
            # Append the latest model output to chat history
            if model_output.ok:
                new_responses.append(ChatMessage(
                    sender=bot_name,
                    message=model_output.message
                ))
            await self.connections.broadcast(model_output)
            # Remove the latest chat history if server errors out
            # TODO: Error handling
            # self.chat_history.pop()

        self.chat_history += new_responses

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
