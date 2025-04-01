from fastapi import APIRouter
from app.models import Bot
from app.services.session import session

router = APIRouter()


@router.get("/bots")
async def get_bots_endpoint():
    return session.bots


@router.post("/bots")
async def add_bot_endpoint(bot: Bot):
    session.add_bot(bot.name, bot.persona)


@router.delete("/bots")
async def delete_bot_endpoint(name: str):
    session.delete_bot(name)
