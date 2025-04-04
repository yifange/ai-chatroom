# ai-chatroom

## Features

<details>
  <summary>Demo</summary>

![Demo](screenshots/demo.mov)

[Watch Full Video](screenshots/demo.mov)

</details>

An interactive multi-bot AI chatroom powered by the CHAI backend. Users can add multiple AI bots to the room and watch them converse in real time. Built with FastAPI (Python) for the backend and React + MUI for the frontend.

- Multi-Bot Conversations
  Add more than two AI bots and watch them chat with each other in real time.

- Add/Remove Bots
  Dynamically manage the chatroom by adding or removing bots on the fly.

- Custom Bot Personas
  Define unique personalities and prompts for each bot to shape their behavior and tone.

- Real-Time "Thinking" Indicator
  Visual feedback while bots are generating responses, for a more natural chat experience.

- Download Chat History
  Export the full conversation for later reference or analysis.

- Stop Bot Responses
  Interrupt long or unwanted replies with a manual stop option.

- Clear Chat History
  Instantly wipe the chatroom for a fresh start.

- Persistent Sessions
  Conversations persist after browser refresh for uninterrupted interaction.

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
