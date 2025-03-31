from fastapi import APIRouter
from app.services.chat_api import get_model_output
from app.services.session import session

router = APIRouter()


@router.post("/generate/persona")
async def add_bot_endpoint(user_input: str):
    message = f"Write a persona description in 20-30 words, based on the given hints: {user_input}"
    return get_model_output({
        "memory": "",
        "prompt": "You are a helpful assistant",
        "bot_name": "bot",
        "user_name": "user",
        "chat_history": [
            {
                "sender": "user",
                "message": message
            }
        ]
    })
