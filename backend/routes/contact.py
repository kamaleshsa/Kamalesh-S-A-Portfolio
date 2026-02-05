from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
import resend
import uuid
from datetime import datetime

from config import get_settings
from models import ContactFormSubmission, ContactFormResponse

router = APIRouter()
settings = get_settings()
limiter = Limiter(key_func=get_remote_address)

# Initialize Resend
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key
    EMAIL_ENABLED = True
else:
    EMAIL_ENABLED = False


@router.post("/submit", response_model=ContactFormResponse)
@limiter.limit(
    settings.contact_form_rate_limit if settings.rate_limit_enabled else "1000/hour"
)
async def submit_contact_form(submission: ContactFormSubmission, request: Request):
    """
    Submit contact form.
    - Sends email via Resend
    - NO Database storage
    """
    if not EMAIL_ENABLED:
        print(
            "❌ Error: Contact form submitted but EMAIL_ENABLED is False (missing RESEND_API_KEY)"
        )
        raise HTTPException(
            status_code=500,
            detail="System configuration error: Email service not active.",
        )

    try:
        email_subject = submission.subject or "New Portfolio Contact Form Submission"

        # Send email via Resend
        # NOTE: Using 'onboarding@resend.dev' is required for testing without a verified domain.
        r = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",
                "to": settings.contact_email,
                "subject": f"Portfolio Contact: {email_subject}",
                "html": f"""
            <h2>New Contact Form Submission</h2>
            <p><strong>From:</strong> {submission.name} ({submission.email})</p>
            <p><strong>Subject:</strong> {email_subject}</p>
            <p><strong>Message:</strong></p>
            <p>{submission.message}</p>
            <hr>
            <p><small>Submitted at: {datetime.now().isoformat()}</small></p>
            """,
            }
        )

        print(f"✅ Email sent successfully via Resend. ID: {r.get('id')}")

        return ContactFormResponse(
            success=True,
            message="Transmission successful. Uplink established.",
            id=r.get("id") or str(uuid.uuid4()),
        )

    except Exception as e:
        print(f"❌ Email sending failed: {str(e)}")
        # Check if it's a rate limit error from slowapi or resend
        if "rate limit" in str(e).lower():
            raise HTTPException(
                status_code=429, detail="Too many submissions. Connection throttled."
            )

        raise HTTPException(
            status_code=500, detail="Transmission failed. Please try again later."
        )
