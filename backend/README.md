# FastAPI Backend

Backend API for portfolio website with AI chatbot, analytics, and contact form.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - Add your Supabase credentials
   - Add your OpenAI API key
   - Add your Resend API key
   - Update email and URL settings

5. Set up Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL from `schema.sql`

## Running the Server

Development:

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/api/docs`

## API Endpoints

### Chat

- `POST /api/chat/message` - Send message to AI chatbot
- `GET /api/chat/history/{session_id}` - Get conversation history

### Analytics

- `POST /api/analytics/track` - Track analytics event
- `GET /api/analytics/stats` - Get analytics statistics
- `GET /api/analytics/visitors/live` - Get live visitor count

### Contact

- `POST /api/contact/submit` - Submit contact form (rate limited: 3/hour)
- `GET /api/contact/messages` - Get all messages (admin)

## Deployment

For production deployment, consider:

- Railway
- Render
- DigitalOcean App Platform
- Heroku
- AWS/GCP/Azure

Make sure to:

1. Set `ENVIRONMENT=production` in environment variables
2. Update `FRONTEND_URL` and `BACKEND_URL`
3. Configure proper CORS origins
4. Use production-grade ASGI server (Gunicorn + Uvicorn)
