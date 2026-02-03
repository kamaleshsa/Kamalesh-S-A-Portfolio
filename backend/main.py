from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import asyncio
from contextlib import asynccontextmanager

from config import get_settings
from routes import chat, analytics, contact, cleanup

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
            await asyncio.sleep(7200)  # 2 hours
            async with httpx.AsyncClient() as client:
                await client.delete("http://localhost:8000/api/cleanup")
                print("✅ Cleaned up old messages")
        except Exception as e:
            print(f"❌ Cleanup task error: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup: Start cleanup task
    # Note: In Vercel serverless, background tasks like this shouldn't run indefinitely.
    # We check if we are in development or if a specific env flag allows it.
    task = None
    if settings.environment == "development":
        task = asyncio.create_task(cleanup_task())
        print("🚀 Started automatic message cleanup task (runs every 2 hours)")
    else:
        print("ℹ️ Cleanup task skipped (Production/Serverless environment)")

    yield

    # Shutdown: Cancel cleanup task
    if task:
        task.cancel()
        print("🛑 Stopped cleanup task")


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


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Portfolio Backend API", "version": "1.0.0", "docs": "/api/docs"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": settings.environment}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development",
    )
