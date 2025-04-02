import httpx
import os
from dotenv import load_dotenv

from app.models import ChatRequestPayload, ChatResponse

load_dotenv()

API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

# Ensure the env variable are set
if not API_URL or not API_KEY:
    raise ValueError("Missing API URL or API Key. Set them in .env file.")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

async def get_model_output(payload: ChatRequestPayload) -> ChatResponse:
    print(f"payload: {payload}")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(httpx.URL(str(API_URL)), json=payload.model_dump(), headers=HEADERS)
            print(response)
            response.raise_for_status()
            output = response.json().get("model_output")
            print(f"output: {response.json()}")
            return ChatResponse(
                ok=True,
                sender=payload.bot_name,
                message=output
            )
        except httpx.HTTPStatusError as e:
            print(
                f"Server Error: {e.response.status_code} - {e.response.text}")
            return ChatResponse(
                ok=False,
                sender=None,
                message=f"Server Error: {e.response.status_code} - {e.response.text}",
            )
        except Exception as e:
            print(f"Error: {str(e)}")
            return ChatResponse(
                ok=False,
                sender=None,
                message=f"Error: {str(e)}"
            )
