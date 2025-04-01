from app.services.chat_api import get_model_output
from app.services.ws_connection_manager import WSConnectionManager
from app.models import Bot, ChatMessage, ChatRequestPayload
from typing import List, Optional


class Session:
    _instance = None
    # bot name -> Bot
    bots: dict[str, Bot] = {
        "Winston": Bot(
            name="Winston",
            persona="Your character is: Blunt and ruthless, always saying exactly what's on his mind without sugarcoating anything. He has a cold, calculating demeanor and doesn't hesitate to use harsh words to get his point across.",
        ),
        "Molly": Bot(
            name="Molly",
            persona="Your character is: A caring female",
        ),
    }

    chat_history: List[ChatMessage] = []
    user_name: Optional[str] = "John"

    connections = WSConnectionManager()

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def add_bot(self, bot_name: str, persona: str):
        if bot_name in self.bots:
            raise AppError(f"bot {bot_name} already exists")
        self.bots[bot_name] = Bot(
            name=bot_name,
            persona=persona
        )
        # self.bots[bot_name] = {
        #     "name": bot_name,
        #     "persona": persona
        # }

    def delete_bot(self, bot_name: str):
        if not self.bots[bot_name]:
            raise AppError(f"bot {bot_name} doesn't exist")
        self.bots.pop(bot_name)

    def clear_chat(self):
        self.chat_history = []

    async def handle_user_message(self, message: str):
        if not self.user_name:
            raise AppError("user name must be set before sending a message")

        self.chat_history.append(ChatMessage(
            sender=self.user_name,
            message=message
        ))
        # self.chat_history.append({
        #     "sender": self.user_name,
        #     "message": message
        # # )

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
                                                  message=bot.persona)] or [] + self.chat_history,
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
        self.user_name = name


session = Session()


class AppError(Exception):
    """App Error"""

    def __init__(self, message):
        super().__init__(message)
