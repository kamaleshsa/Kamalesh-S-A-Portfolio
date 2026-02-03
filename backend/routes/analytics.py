from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timedelta
from typing import Dict

from database import get_supabase_client
from models import AnalyticsEvent, AnalyticsStats

router = APIRouter()
supabase = get_supabase_client()


@router.post("/track")
async def track_event(event: AnalyticsEvent, request: Request):
    """
    Track analytics with minimal storage - only increment counters.
    """
    try:
        # Update active session (for live visitor count)
        supabase.table("active_sessions").upsert(
            {
                "session_id": event.session_id,
                "last_seen": datetime.utcnow().isoformat(),
            },
            on_conflict="session_id",
        ).execute()

        # Increment total page views counter (only if page_view event)
        if event.event_type == "page_view":
            # Get current counter
            counter_result = (
                supabase.table("analytics_counters")
                .select("counter_value")
                .eq("counter_name", "total_page_views")
                .execute()
            )

            current_value = (
                counter_result.data[0]["counter_value"] if counter_result.data else 0
            )

            # Increment counter
            supabase.table("analytics_counters").upsert(
                {
                    "counter_name": "total_page_views",
                    "counter_value": current_value + 1,
                    "updated_at": datetime.utcnow().isoformat(),
                },
                on_conflict="counter_name",
            ).execute()

        return {"success": True, "message": "Counter updated"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error tracking: {str(e)}")


@router.get("/stats", response_model=AnalyticsStats)
async def get_stats():
    """
    Get analytics statistics.
    """
    try:
        # Get total unique visitors (last 30 days)
        thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()

        visitors_result = (
            supabase.table("analytics_events")
            .select("session_id", count="exact")
            .gte("created_at", thirty_days_ago)
            .execute()
        )

        # Get unique session IDs
        unique_sessions = set()
        if visitors_result.data:
            for event in visitors_result.data:
                unique_sessions.add(event.get("session_id"))

        total_visitors = len(unique_sessions)

        # Get live visitors (last 5 minutes)
        five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat()

        live_result = (
            supabase.table("analytics_events")
            .select("session_id")
            .gte("created_at", five_minutes_ago)
            .execute()
        )

        live_sessions = set()
        if live_result.data:
            for event in live_result.data:
                live_sessions.add(event.get("session_id"))

        live_visitors = len(live_sessions)

        # Get total page views
        page_views_result = (
            supabase.table("analytics_events")
            .select("*", count="exact")
            .eq("event_type", "page_view")
            .execute()
        )

        total_page_views = page_views_result.count or 0

        # Get popular sections (last 7 days)
        seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()

        sections_result = (
            supabase.table("analytics_events")
            .select("section_name")
            .eq("event_type", "section_view")
            .gte("created_at", seven_days_ago)
            .execute()
        )

        # Count section views
        section_counts: Dict[str, int] = {}
        if sections_result.data:
            for event in sections_result.data:
                section = event.get("section_name")
                if section:
                    section_counts[section] = section_counts.get(section, 0) + 1

        # Sort and format popular sections
        popular_sections = [
            {"name": name, "views": count}
            for name, count in sorted(
                section_counts.items(), key=lambda x: x[1], reverse=True
            )[:5]
        ]

        # Get recent events
        recent_result = (
            supabase.table("analytics_events")
            .select("*")
            .order("created_at", desc=True)
            .limit(10)
            .execute()
        )

        recent_events = recent_result.data or []

        return AnalyticsStats(
            total_visitors=total_visitors,
            live_visitors=live_visitors,
            total_page_views=total_page_views,
            popular_sections=popular_sections,
            recent_events=recent_events,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")


@router.get("/visitors/live")
async def get_live_visitors():
    """
    Get current live visitor count and total views from counters.
    """
    try:
        # Get active sessions (last 5 minutes)
        five_minutes_ago = (datetime.utcnow() - timedelta(minutes=5)).isoformat()

        active_sessions_result = (
            supabase.table("active_sessions")
            .select("session_id")
            .gte("last_seen", five_minutes_ago)
            .execute()
        )

        active_visitors = (
            len(active_sessions_result.data) if active_sessions_result.data else 0
        )

        # Get total page views from counter
        counter_result = (
            supabase.table("analytics_counters")
            .select("counter_value")
            .eq("counter_name", "total_page_views")
            .execute()
        )

        total_views = (
            counter_result.data[0]["counter_value"] if counter_result.data else 0
        )

        return {
            "active_visitors": active_visitors,
            "total_views": total_views,
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching live visitors: {str(e)}"
        )
