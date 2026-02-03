from fastapi import APIRouter
from datetime import datetime, timedelta
from config import get_settings
from database import get_supabase_client

router = APIRouter()
settings = get_settings()
supabase = get_supabase_client()


@router.delete("/cleanup")
async def cleanup_old_data():
    """
    Delete old data to save database storage.
    - Messages older than 1 hour: DELETED
    - Active sessions older than 10 minutes: DELETED (for live tracking)
    - Analytics counters: KEPT PERMANENTLY (just numbers, minimal storage)
    - Empty conversations: DELETED
    """
    try:
        # Delete messages older than 1 hour
        message_cutoff = datetime.utcnow() - timedelta(hours=1)
        message_cutoff_str = message_cutoff.isoformat()

        message_result = (
            supabase.table("messages")
            .delete()
            .lt("created_at", message_cutoff_str)
            .execute()
        )

        # Delete old active sessions (older than 10 minutes)
        session_cutoff = datetime.utcnow() - timedelta(minutes=10)
        session_cutoff_str = session_cutoff.isoformat()

        session_result = (
            supabase.table("active_sessions")
            .delete()
            .lt("last_seen", session_cutoff_str)
            .execute()
        )

        # Delete conversations with no messages
        conversations_result = supabase.table("conversations").select("id").execute()

        deleted_conversations = 0
        if conversations_result.data:
            for conv in conversations_result.data:
                messages = (
                    supabase.table("messages")
                    .select("id")
                    .eq("conversation_id", conv["id"])
                    .execute()
                )

                if not messages.data:
                    supabase.table("conversations").delete().eq(
                        "id", conv["id"]
                    ).execute()
                    deleted_conversations += 1

        return {
            "success": True,
            "messages_deleted": len(message_result.data) if message_result.data else 0,
            "sessions_cleaned": len(session_result.data) if session_result.data else 0,
            "conversations_deleted": deleted_conversations,
            "note": "Analytics counters kept permanently (minimal storage)",
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
