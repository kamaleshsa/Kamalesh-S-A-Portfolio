from fastapi import APIRouter, HTTPException, Request
import httpx
from datetime import datetime
from typing import List

from config import get_settings
from database import get_supabase_client
from models import ChatMessage, ChatResponse, MessageHistory

router = APIRouter()
settings = get_settings()
supabase = get_supabase_client()

# Get all API keys
API_KEYS = settings.get_openai_keys()  # Reusing same config
current_key_index = 0


def get_current_api_key() -> str:
    """Get current Mistral API key."""
    global current_key_index
    return API_KEYS[current_key_index % len(API_KEYS)]


def try_next_api_key():
    """Rotate to next API key."""
    global current_key_index
    current_key_index = (current_key_index + 1) % len(API_KEYS)
    print(f"Rotating to API key {current_key_index + 1}/{len(API_KEYS)}")


# Portfolio context for the AI
PORTFOLIO_CONTEXT = """
You are Kamalesh's Portfolio AI Assistant. Your ONLY purpose is to answer questions about Kamalesh SA and his professional work.

STRICT RULES:
1. ONLY answer questions about Kamalesh, his skills, projects, experience, or portfolio
2. REFUSE to answer ANY questions unrelated to Kamalesh or his work
3. If asked about anything else (general knowledge, other topics, coding help, etc.), politely decline and redirect to portfolio topics

About Kamalesh SA:
- Full Stack Developer specializing in backend development
- Expert in: Python (FastAPI), TypeScript, React, Next.js, Supabase, PostgreSQL
- Experience with: Go, Docker, Git, REST APIs, Database Design
- Currently building production-ready portfolio projects with AI integration
- Passionate about scalable, modern web applications
- Based in India, available for freelance/contract work

Sample Projects:
- AI-powered portfolio with chatbot, analytics, and contact form
- Backend systems using FastAPI and Supabase
- Modern frontend with Next.js and TypeScript

How to respond:
- For portfolio questions: Answer professionally and concisely (under 150 words)
- For non-portfolio questions: Say "I'm here to help you learn about Kamalesh's skills and experience. Please ask me about his projects, technical skills, or professional background. For other inquiries, feel free to use the contact form!"
- If you don't know specific details about Kamalesh: Suggest using the contact form to reach him directly
"""


@router.post("/message", response_model=ChatResponse)
async def send_message(chat_message: ChatMessage, request: Request):
    """
    Send a message to the AI chatbot and get a response.
    """
    try:
        # Get or create conversation
        conversation = (
            supabase.table("conversations")
            .select("*")
            .eq("session_id", chat_message.session_id)
            .execute()
        )

        if not conversation.data:
            # Create new conversation
            new_conversation = (
                supabase.table("conversations")
                .insert({"session_id": chat_message.session_id})
                .execute()
            )
            conversation_id = new_conversation.data[0]["id"]
        else:
            conversation_id = conversation.data[0]["id"]

        # Store user message
        supabase.table("messages").insert(
            {
                "conversation_id": conversation_id,
                "role": "user",
                "content": chat_message.message,
            }
        ).execute()

        # Get conversation history for context
        history = (
            supabase.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .limit(10)
            .execute()
        )

        # Build messages for Mistral
        messages = [{"role": "system", "content": PORTFOLIO_CONTEXT}]

        for msg in history.data:
            messages.append({"role": msg["role"], "content": msg["content"]})

        # Get AI response with key rotation
        ai_response = None
        last_error = None

        # Try all API keys
        for attempt in range(len(API_KEYS)):
            try:
                # Call Mistral API directly
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        "https://api.mistral.ai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {get_current_api_key()}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": settings.ai_model,
                            "messages": messages,
                            "temperature": settings.ai_temperature,
                            "max_tokens": settings.ai_max_tokens,
                        },
                        timeout=30.0,
                    )

                    if response.status_code == 200:
                        result = response.json()
                        ai_response = result["choices"][0]["message"]["content"]
                        break  # Success! Exit loop
                    else:
                        raise Exception(
                            f"API error: {response.status_code} - {response.text}"
                        )

            except Exception as e:
                last_error = str(e)
                print(f"API key {current_key_index + 1} failed: {last_error}")

                # If this was the last key, raise error
                if attempt == len(API_KEYS) - 1:
                    raise HTTPException(
                        status_code=500,
                        detail=f"All API keys exhausted. Last error: {last_error}",
                    )

                # Try next key
                try_next_api_key()

        if not ai_response:
            raise HTTPException(status_code=500, detail="Failed to get AI response")

        # Store AI response
        supabase.table("messages").insert(
            {
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": ai_response,
            }
        ).execute()

        return ChatResponse(message=ai_response, conversation_id=str(conversation_id))

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing message: {str(e)}"
        )


@router.get("/history/{session_id}", response_model=List[MessageHistory])
async def get_conversation_history(session_id: str):
    """
    Get conversation history for a session.
    """
    try:
        # Get conversation
        conversation = (
            supabase.table("conversations")
            .select("id")
            .eq("session_id", session_id)
            .execute()
        )

        if not conversation.data:
            return []

        conversation_id = conversation.data[0]["id"]

        # Get messages
        messages = (
            supabase.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .execute()
        )

        return messages.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")
