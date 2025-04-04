from fastapi import APIRouter
from app.models import Bot, DeleteBotPayload
from app.services.session import session

router = APIRouter()


@router.get("/bots")
async def get_bots_endpoint():
    """Gets all the bots in the session"""
    return session.bots


@router.post("/bots")
async def add_bot_endpoint(bot: Bot):
    """Adds a new bot"""
    session.add_bot(bot.name, bot.persona)
    return session.bots


@router.delete("/bots")
async def delete_bot_endpoint(payload: DeleteBotPayload):
    """Deletes a bot if a name is specified, other delete all bots"""
    if payload.name:
        session.delete_bot(payload.name)
    else:
        session.delete_all_bots()

    return session.bots

@router.post("/interrupt_bots")
async def interrupt_bots_endpoint():
    """Interrupt the conversation of bots"""
    session.interrupt_bots()