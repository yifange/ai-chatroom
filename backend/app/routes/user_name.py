from fastapi import APIRouter
from app.services.session import session

router = APIRouter()

@router.get("/user_name")
async def get_user_name_endpoint():
    return session.user_name

@router.post("/user_name")
async def update_user_name_endpoint(name: str):
    session.set_user_name(name)