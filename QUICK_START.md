# Quick Start Guide

## ✅ What's Done

All backend features are implemented and ready to use:

- **AI Chatbot** with 6 API keys rotation
- **Live Analytics** dashboard
- **Contact Form** (email optional)

## 🚀 Start the Backend

1. **Navigate to backend:**

   ```bash
   cd backend
   ```

2. **Create virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Your `.env` file is already created** with your 6 OpenAI API keys!

5. **Add Supabase credentials:**
   - Go to [supabase.com](https://supabase.com) and create a project
   - Run the SQL from `schema.sql` in SQL Editor
   - Update `.env` with your Supabase credentials:
     ```
     SUPABASE_URL=your_url_here
     SUPABASE_KEY=your_anon_key_here
     SUPABASE_SERVICE_KEY=your_service_key_here
     ```

6. **Run the backend:**

   ```bash
   python main.py
   ```

   Backend will start on `http://localhost:8000`

## 🎨 Frontend Setup

1. **Create `.env.local` in web folder:**

   ```bash
   cd web
   cp .env.local.example .env.local
   ```

2. **Add your Supabase URL and key** to `.env.local`

3. **Frontend is already running!** (npm run dev)

## 🧪 Test It

1. **Chat**: Click the chat button (bottom-right) and send a message
2. **Analytics**: Scroll to "Portfolio Analytics" section
3. **Contact**: Fill out the contact form at the bottom

## 🔑 API Key Rotation

Your backend will automatically:

- Try the first OpenAI API key
- If it fails/expires, rotate to the next one
- Continue through all 6 keys
- Only fail if all 6 are exhausted

## 📧 Email Notifications

Currently **disabled** (RESEND_API_KEY is empty in `.env`).

Messages are still saved to Supabase - you can check them there!

To enable emails later:

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env`: `RESEND_API_KEY=your_key`

## 📚 Full Documentation

- [SETUP_GUIDE.md](file:///Users/kamaleshsa/Documents/Kamalesh%20Portfolio/SETUP_GUIDE.md) - Complete setup instructions
- [walkthrough.md](file:///Users/kamaleshsa/.gemini/antigravity/brain/738218b5-e41c-40a8-a337-80fe60f37964/walkthrough.md) - What was built and how it works
