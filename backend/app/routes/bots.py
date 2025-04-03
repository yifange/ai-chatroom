from fastapi import APIRouter
from app.models import Bot, DeleteBotPayload
from app.services.session import session

router = APIRouter()


@router.get("/bots")
async def get_bots_endpoint():
    return session.bots


@router.post("/bots")
async def add_bot_endpoint(bot: Bot):
    session.add_bot(bot.name, bot.persona)
    return session.bots


@router.delete("/bots")
async def delete_bot_endpoint(payload: DeleteBotPayload):
    session.delete_bot(payload.name)
    return session.bots
