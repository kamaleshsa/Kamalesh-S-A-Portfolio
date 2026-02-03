from fastapi import APIRouter, HTTPException, Request, Depends
from slowapi import Limiter
from slowapi.util import get_remote_address

from config import get_settings
from database import get_supabase_client
from models import ContactFormSubmission, ContactFormResponse

router = APIRouter()
settings = get_settings()
supabase = get_supabase_client()
limiter = Limiter(key_func=get_remote_address)

# Initialize Resend only if API key is provided
if settings.resend_api_key:
    import resend

    resend.api_key = settings.resend_api_key
    EMAIL_ENABLED = True
else:
    EMAIL_ENABLED = False
    print("⚠️  Email notifications disabled (no RESEND_API_KEY)")


@router.post("/submit", response_model=ContactFormResponse)
@limiter.limit(
    settings.contact_form_rate_limit if settings.rate_limit_enabled else "1000/hour"
)
async def submit_contact_form(submission: ContactFormSubmission, request: Request):
    """
    Submit contact form with rate limiting.
    Limited to 3 submissions per hour per IP address.
    """
    try:
        # Get IP address
        ip_address = request.client.host if request.client else None

        # Insert into database
        result = (
            supabase.table("contact_messages")
            .insert(
                {
                    "name": submission.name,
                    "email": submission.email,
                    "subject": submission.subject or "Portfolio Contact Form",
                    "message": submission.message,
                    "ip_address": ip_address,
                    "status": "unread",
                }
            )
            .execute()
        )

        message_id = result.data[0]["id"]

        # Send email notification (only if enabled)
        if EMAIL_ENABLED:
            try:
                email_subject = (
                    submission.subject or "New Portfolio Contact Form Submission"
                )

                resend.Emails.send(
                    {
                        "from": "portfolio@kamalesh.dev",  # Update with your verified domain
                        "to": settings.contact_email,
                        "subject": f"Portfolio Contact: {email_subject}",
                        "html": f"""
                    <h2>New Contact Form Submission</h2>
                    <p><strong>From:</strong> {submission.name} ({submission.email})</p>
                    <p><strong>Subject:</strong> {email_subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>{submission.message}</p>
                    <hr>
                    <p><small>Submitted at: {result.data[0]["created_at"]}</small></p>
                    """,
                    }
                )
            except Exception as email_error:
                # Log email error but don't fail the request
                print(f"Email notification failed: {email_error}")
        else:
            print("✅ Message saved to database (email notifications disabled)")

        return ContactFormResponse(
            success=True,
            message="Thank you for your message! I'll get back to you soon.",
            id=message_id,
        )

    except Exception as e:
        # Check if it's a rate limit error
        if "rate limit" in str(e).lower():
            raise HTTPException(
                status_code=429, detail="Too many submissions. Please try again later."
            )
        raise HTTPException(status_code=500, detail=f"Error submitting form: {str(e)}")


@router.get("/messages")
async def get_messages(status: str = None):
    """
    Get contact messages (admin endpoint - should be protected in production).
    """
    try:
        query = (
            supabase.table("contact_messages")
            .select("*")
            .order("created_at", desc=True)
        )

        if status:
            query = query.eq("status", status)

        result = query.execute()

        return {"messages": result.data, "count": len(result.data)}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching messages: {str(e)}"
        )
