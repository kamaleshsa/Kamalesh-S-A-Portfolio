from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import asyncio
import os
from contextlib import asynccontextmanager

# Vercel (and most serverless hosts) freeze/thaw the process between requests.
# Infinite background asyncio loops don't survive that correctly and can leave
# sockets/file descriptors in a broken state, so never start them there.
IS_SERVERLESS = bool(os.environ.get("VERCEL"))

from config import get_settings
from database import get_supabase_client
from routes import chat, analytics, contact, cleanup, monitor

# Initialize settings
settings = get_settings()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


# Background task to cleanup old messages
async def cleanup_task():
    """Background task that runs every 2 hours to cleanup old messages."""
    import httpx

    while True:
        try:
            print("🧹 Running scheduled cleanup...")
            async with httpx.AsyncClient() as client:
                # Use backend URL from environment settings for all environments
                base_url = settings.backend_url

                await client.delete(f"{base_url}/api/cleanup/")
                print("✅ Cleaned up old messages")

            await asyncio.sleep(7200)  # Sleep for 2 hours
        except Exception as e:
            print(f"❌ Cleanup task error: {e}")
            await asyncio.sleep(60)  # Wait a bit before retrying on error


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup: Start cleanup task
    # Note: In Vercel serverless, background tasks like this shouldn't run indefinitely.
    # We check if we are in development or if a specific env flag allows it.
    task = None
    monitor_task = None
    if not IS_SERVERLESS and settings.environment == "development":
        # Give server a moment to start before running first cleanup
        await asyncio.sleep(2)
        task = asyncio.create_task(cleanup_task())
        print(
            "🚀 Started automatic message cleanup task (runs immediately and every 2 hours)"
        )

        # Start System Monitor (Engine Room) - local dev only, not viable on
        # frozen/serverless containers (see IS_SERVERLESS above).
        from routes.monitor import system_stats_generator

        monitor_task = asyncio.create_task(system_stats_generator())
        print("🖥️  Started Engine Room system monitor")
    else:
        print("ℹ️ Background tasks skipped (Production/Serverless environment)")

    yield

    # Shutdown: Cancel cleanup task
    if task:
        task.cancel()
        print("🛑 Stopped cleanup task")

    if monitor_task:
        monitor_task.cancel()
        print("🛑 Stopped system monitor")


# Create FastAPI app
app = FastAPI(
    title="Portfolio Backend API",
    description="Backend API for portfolio website with chatbot, analytics, and contact form",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for production
if settings.environment == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[settings.backend_url, settings.frontend_url],
    )

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(cleanup.router, prefix="/api/cleanup", tags=["Cleanup"])

app.include_router(
    monitor.router, tags=["Monitor"]
)  # No prefix for WebSocket or use /ws in route


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Portfolio Backend API", "version": "1.0.0", "docs": "/api/docs"}


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint. Also serves as the Vercel Cron keep-alive target:
    Supabase's free tier auto-pauses a project after 7 days of no activity,
    so a periodic hit here that touches the database prevents that.
    """
    db_status = "connected"
    try:
        get_supabase_client().table("analytics_counters").select(
            "counter_name"
        ).limit(1).execute()
    except Exception as e:
        db_status = "unreachable"
        print(f"⚠️ Health check: database unreachable: {e}")

    return {
        "status": "healthy",
        "environment": settings.environment,
        "database": db_status,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development",
    )
