from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import bots, chat, user_name

app = FastAPI()

# FIXME: Local dev hacks
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow local dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(user_name.router)
app.include_router(bots.router)
