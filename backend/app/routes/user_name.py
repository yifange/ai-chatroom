from fastapi import APIRouter

from app.models import UpdateUserNamePayload
from app.services.session import session

router = APIRouter()


@router.get("/user_name")
async def get_user_name_endpoint():
    return session.user_name


@router.post("/user_name")
async def update_user_name_endpoint(payload: UpdateUserNamePayload):
    session.set_user_name(payload.name)
    return payload.name
