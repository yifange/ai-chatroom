from typing import TypedDict, List
from typing_extensions import NotRequired

# Types for the API payload
class ChatMessage(TypedDict):
    sender: str
    message: str


class ChatRequestPayload(TypedDict):
    memory: str
    prompt: str
    bot_name: str
    user_name: str
    chat_history: List[ChatMessage]

class ChatResponse(TypedDict):
    ok: bool
    sender: NotRequired[str]
    message: str

class Bot(TypedDict):
    name: str
    persona: str
