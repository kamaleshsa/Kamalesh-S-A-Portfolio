# Backend Integration Setup Guide

This guide will help you set up the backend features for your portfolio.

## Prerequisites

- Supabase account
- OpenAI API key
- Resend API key (for email notifications)

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the contents of `backend/schema.sql` and run it in the SQL Editor
5. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

## Step 2: Get API Keys

### OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key

### Resend API Key

1. Go to [resend.com](https://resend.com)
2. Create an account
3. Verify your domain (or use their testing domain)
4. Create an API key

## Step 3: Configure Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

5. Edit `.env` and add your credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   RESEND_API_KEY=your_resend_api_key
   CONTACT_EMAIL=your_email@example.com
   ```

## Step 4: Configure Frontend

1. Navigate to the web directory:

   ```bash
   cd web
   ```

2. Create `.env.local` file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Step 5: Run the Application

### Terminal 1 - Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

The backend will run on `http://localhost:8000`

### Terminal 2 - Frontend

```bash
cd web
npm run dev
```

The frontend will run on `http://localhost:3000`

## Step 6: Test the Features

1. **Chat Widget**: Click the chat button in the bottom-right corner and send a message
2. **Analytics**: Check the "Portfolio Analytics" section to see live visitor count
3. **Contact Form**: Scroll to the bottom and submit the contact form

## Deployment

### Backend Deployment (Railway)

1. Create account on [railway.app](https://railway.app)
2. Create new project
3. Deploy from GitHub or use Railway CLI
4. Add environment variables in Railway dashboard
5. Copy the deployment URL

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL)
4. Deploy

## Troubleshooting

### CORS Errors

- Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that CORS middleware is properly configured in `main.py`

### Chat Not Working

- Verify OpenAI API key is correct
- Check backend logs for errors
- Ensure Supabase tables are created

### Analytics Not Tracking

- Check browser console for errors
- Verify Supabase connection
- Check that analytics events are being sent to backend

### Contact Form Rate Limiting

- Default limit is 3 submissions per hour per IP
- Adjust in `backend/config.py` if needed

## Support

For issues, check:

- Backend logs: `backend/` terminal
- Frontend console: Browser DevTools
- Supabase logs: Supabase Dashboard → Logs
