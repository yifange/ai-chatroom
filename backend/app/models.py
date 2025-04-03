from typing import List, Optional
from pydantic import BaseModel

# Types for the API payload


class ChatMessage(BaseModel):
    sender: str
    message: str


class ChatRequestPayload(BaseModel):
    memory: str
    prompt: str
    bot_name: str
    user_name: str
    chat_history: List[ChatMessage]


class ChatResponse(BaseModel):
    ok: bool
    sender: Optional[str]
    message: str


class Bot(BaseModel):
    name: str
    persona: Optional[str] = None


class UpdateUserNamePayload(BaseModel):
    name: Optional[str] = None


class DeleteBotPayload(BaseModel):
    name: str
