# ai-chatroom

## Features


[Demo](screenshots/demo.mov)


An interactive multi-bot AI chatroom powered by the CHAI backend. Users can add multiple AI bots to the room and watch them converse in real time. Built with FastAPI (Python) for the backend and React + MUI for the frontend.

- Multi-Bot Conversations
- Add/Remove Bots
- Custom Bot Personas
- Real-Time "Thinking" Indicator
- Download Chat History
- Stop Bot Responses
- Clear Chat History

## Run the project locally

Make sure Python and node are installed.

Start the backend:

```sh
cd backend
python -m venv venv
source venv/bin/activate
# Generate environment variables with the API token
echo -e 'API_URL="http://guanaco-submitter.guanaco-backend.k2.chaiverse.com/endpoints/onsite/chat"\nAPI_KEY="CR_14d43f2bf78b4b0590c2a8b87f354746"' > ../.env
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
cd ..
```

Start the frontend:

```sh
cd frontend
npm install -g yarn
yarn --frozen-lockfile
yarn start
```
