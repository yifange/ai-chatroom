from fastapi import APIRouter
from app.services.session import session
from app.models import UpdateUserNamePayload

router = APIRouter()


@router.get("/user_name")
async def get_user_name_endpoint():
    return session.user_name


@router.post("/user_name")
async def update_user_name_endpoint(payload: UpdateUserNamePayload):
    session.set_user_name(payload.name)
    return payload.name
