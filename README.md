# ai-chatroom

Make sure Python and node are installed.
```
cd backend
python -m venv venv
source venv/bin/activate
echo -e 'API_URL="http://guanaco-submitter.guanaco-backend.k2.chaiverse.com/endpoints/onsite/chat"\nAPI_KEY="CR_14d43f2bf78b4b0590c2a8b87f354746"' > ../.env
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

```
cd frontend
npm install -g yarn
yarn --frozen-lockfile
yarn start
```
