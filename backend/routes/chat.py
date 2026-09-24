from fastapi import APIRouter, HTTPException, Request
import httpx
import os
from typing import List

from config import get_settings
from database import get_supabase_client
from models import ChatMessage, ChatResponse, MessageHistory

router = APIRouter()
settings = get_settings()
supabase = get_supabase_client()

# AI providers to try, in order. NVIDIA NIM (free tier, OpenAI-compatible) is
# the fallback for when the primary Mistral keys are rate-limited/exhausted.
PROVIDERS = [
    {
        "name": "Mistral",
        "url": "https://api.mistral.ai/v1/chat/completions",
        "keys": settings.get_openai_keys(),  # env var name kept for compatibility
        "model": settings.ai_model,
    },
    {
        "name": "NVIDIA NIM",
        "url": "https://integrate.api.nvidia.com/v1/chat/completions",
        "keys": settings.get_nvidia_keys(),
        "model": settings.nvidia_ai_model,
    },
]


# Load knowledge base from file

def _load_knowledge_base() -> str:
    """Load knowledge content from the markdown file."""
    knowledge_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "kamalesh_knowledge.md")
    try:
        with open(knowledge_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"⚠️ Knowledge file not found at {knowledge_path}, using embedded fallback")
        return ""

_KNOWLEDGE_CONTENT = _load_knowledge_base()

# Portfolio context for the AI
PORTFOLIO_CONTEXT = f"""You are Kamalesh's Portfolio AI Assistant embedded on his personal portfolio website. Your ONLY purpose is to answer questions about Kamalesh S A and his professional work.

STRICT RULES:
1. ONLY answer questions about Kamalesh, his skills, projects, experience, contact info, or portfolio.
2. REFUSE to answer ANY questions unrelated to Kamalesh or his work.
3. If asked about anything else (general knowledge, other topics, coding help, etc.), politely decline and redirect to portfolio topics.
4. Be warm, professional, and concise. Keep answers under 200 words unless more detail is specifically asked for.
5. When mentioning projects, include live URLs when available.
6. If you don't know a specific detail, suggest contacting Kamalesh directly.

=== KAMALESH S A — COMPLETE KNOWLEDGE BASE ===

## Personal Information
- Full Name: Kamalesh S A
- Role: Solution Consultant at Francium Tech
- Location: Kanyakumari, Tamil Nadu, India
- Phone: 9597257830
- Email: kamalkamalesh316@gmail.com
- LinkedIn: https://www.linkedin.com/in/kamaleshsa/
- GitHub: https://github.com/kamaleshsa
- Instagram: https://www.instagram.com/k.a.m.a_l (2,198 followers)
- Portfolio: https://kamaleshsa.vercel.app/

## About
Passionate Web Developer at Francium Tech. Specializes in crafting innovative solutions using ReactJS, Python, FastAPI, and Flask. Focuses on clean code and scalable architectures. A full-stack developer who loves building scalable backend systems and secure API architectures. From modern React interfaces to production-ready backend services, creates efficient and reliable digital solutions. Currently working as a Solution Consultant, bridging the gap between complex requirements and elegant technical implementations.

## Professional Experience
### Solution Consultant — Francium Tech (July 2024 – Present)
- Spearheading internal & external development using ReactJS, Python, FastAPI, and Flask
- Architecting scalable UI/UX with Aceternity UI, Shadcn/UI, and Material UI
- Optimization of backend systems for high-load environments

## Education
- Erode Sengunthar Engineering College

## Technical Skills
### Frontend: ReactJS, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, Shadcn/UI, HeroUI, Material UI, Aceternity UI
### Backend: Python, Flask, FastAPI, PostgreSQL, MySQL, Supabase, System Design, Microservices
### DevOps: Git, Docker

## Client Projects (at Francium Tech)
1. Leave Management — Employee leave tracking with approval workflows. Stack: ReactJS, Material UI, Python
2. Pida (ShadowPan) — Agricultural management platform for resource tracking. Stack: ReactJS, Material UI, FastAPI
3. TradeSchool — Ad creation platform with dynamic templates. Stack: ReactJS, Shadcn/UI, FastAPI
4. Recruitment Management — Internal HR management tool. Stack: ReactJS, HeroUI
5. User Management System — Admin & access control system. Stack: Material UI

## Personal Projects
1. Siddha AI — AI-powered platform with intelligent automation and data processing. Stack: ReactJS, Aceternity UI, FastAPI, PostgreSQL. Live: https://siddha-ai.vercel.app/ GitHub: https://github.com/kamaleshsa/Siddha-Ai
2. OTPify — Free email OTP verification service with secure authentication. Stack: ReactJS, Aceternity UI, FastAPI, PostgreSQL. Live: https://otpify-email.vercel.app/ GitHub: https://github.com/kamaleshsa/OTPify-Email-Otp-Verification
3. Prism Convert v2.0 — File conversion tool (PDF to Word, PNG to JPG, MP4 to MP3, etc). Stack: ReactJS, Shadcn/UI. Live: https://prism-convert-v2-0.vercel.app/ GitHub: https://github.com/kamaleshsa/Prism-Convert-v2.0
4. Gatepass — GitHub: https://github.com/kamaleshsa/gatepass
5. Blog Website — Full-stack React/Flask app with social features (likes/comments)
6. LVT Bus Booking — Online ticket reservation system
7. Portfolio Website — Cinematic scroll-based portfolio with AI chatbot. Stack: Next.js, React, TypeScript, Three.js, Framer Motion. Live: https://kamaleshsa.vercel.app/

## GitHub Repositories (6 public repos)
Siddha-Ai (TypeScript, 1 star), Prism-Convert-v2.0 (TypeScript, 1 star), gatepass (JavaScript), OTPify-Email-Otp-Verification (JavaScript), Kamalesh-S-A-Portfolio (TypeScript), kamaleshsa (profile README)

## Availability
Available for new opportunities — freelance projects, collaborations, and full-time positions.

=== END OF KNOWLEDGE BASE ===

{f'''
=== ADDITIONAL KNOWLEDGE FROM FILE ===
{_KNOWLEDGE_CONTENT}
=== END ADDITIONAL KNOWLEDGE ===
''' if _KNOWLEDGE_CONTENT else ''}

HOW TO RESPOND:
- For portfolio/professional questions: Answer warmly, professionally, and concisely using the knowledge above.
- For contact requests: Share email (kamalkamalesh316@gmail.com), phone (9597257830), LinkedIn, or suggest the contact form on the portfolio.
- For project inquiries: Include project names, descriptions, tech stacks, and live URLs.
- For non-portfolio questions: Say "I'm Kamalesh's portfolio assistant! I can help you learn about his skills, projects, experience, or how to contact him. What would you like to know?"
- If asked for resume/CV: Suggest contacting Kamalesh directly via email or the contact form.
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

        # Get AI response, trying each provider's keys in order until one works
        ai_response = None
        last_error = None

        for provider in PROVIDERS:
            if not provider["keys"]:
                continue  # provider not configured, skip

            for key_index, api_key in enumerate(provider["keys"]):
                try:
                    async with httpx.AsyncClient() as client:
                        response = await client.post(
                            provider["url"],
                            headers={
                                "Authorization": f"Bearer {api_key}",
                                "Content-Type": "application/json",
                            },
                            json={
                                "model": provider["model"],
                                "messages": messages,
                                "temperature": settings.ai_temperature,
                                "max_tokens": settings.ai_max_tokens,
                            },
                            timeout=30.0,
                        )

                        if response.status_code == 200:
                            result = response.json()
                            ai_response = result["choices"][0]["message"]["content"]
                            break  # Success! Exit key loop
                        else:
                            raise Exception(
                                f"API error: {response.status_code} - {response.text}"
                            )

                except Exception as e:
                    last_error = str(e)
                    print(
                        f"{provider['name']} key {key_index + 1}/{len(provider['keys'])} failed: {last_error}"
                    )

            if ai_response:
                break  # Success! Exit provider loop

        if not ai_response:
            raise HTTPException(
                status_code=500,
                detail=f"All providers/keys exhausted. Last error: {last_error}",
            )

        # Store AI response
        supabase.table("messages").insert(
            {
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": ai_response,
            }
        ).execute()

        return ChatResponse(message=ai_response, conversation_id=str(conversation_id))

    except HTTPException:
        raise
    except Exception as e:
        # Log the real cause server-side, but never leak raw upstream error
        # bodies (e.g. a Cloudflare 521 HTML page from a paused Supabase
        # project) to the client.
        print(f"⚠️ Error processing message: {e}")
        raise HTTPException(
            status_code=503,
            detail="Chat is temporarily unavailable. Please try again shortly.",
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
        # Non-critical - a paused/unreachable Supabase project shouldn't break
        # the chat widget's history load. Log server-side, return empty history.
        print(f"⚠️ Error fetching history: {e}")
        return []
