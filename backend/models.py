from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID


# Chat Models
class ChatMessage(BaseModel):
    """Chat message request model."""

    session_id: str = Field(..., description="Unique session identifier")
    message: str = Field(..., min_length=1, max_length=1000, description="User message")


class ChatResponse(BaseModel):
    """Chat response model."""

    message: str = Field(..., description="AI assistant response")
    conversation_id: str = Field(..., description="Conversation ID")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class MessageHistory(BaseModel):
    """Message history model."""

    id: UUID
    role: Literal["user", "assistant", "system"]
    content: str
    created_at: datetime


# Analytics Models
class AnalyticsEvent(BaseModel):
    """Analytics event model."""

    session_id: str = Field(..., description="Session identifier")
    event_type: str = Field(
        ..., description="Event type (page_view, section_view, etc.)"
    )
    page_path: Optional[str] = None
    section_name: Optional[str] = None
    user_agent: Optional[str] = None
    referrer: Optional[str] = None
    device_type: Optional[str] = None


class AnalyticsStats(BaseModel):
    """Analytics statistics model."""

    total_visitors: int
    live_visitors: int
    total_page_views: int
    popular_sections: list[dict]
    recent_events: list[dict]


# Contact Models
class ContactFormSubmission(BaseModel):
    """Contact form submission model."""

    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., description="Valid email address")
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)


class ContactFormResponse(BaseModel):
    """Contact form response model."""

    success: bool
    message: str
    id: Optional[UUID] = None
