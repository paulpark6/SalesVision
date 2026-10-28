from typing import Generator, Optional
from fastapi import Depends, HTTPException, Header
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.employee import Employee
import os

def _verify_iap_jwt(token: str) -> str:
    """Verify the signed IAP header; the plain email header is spoofable."""
    audience = os.getenv("IAP_AUDIENCE")
    if not audience:
        raise HTTPException(status_code=500, detail="IAP_AUDIENCE not configured")
    from google.auth.transport import requests as g_requests
    from google.oauth2 import id_token
    try:
        claims = id_token.verify_token(
            token, g_requests.Request(), audience=audience,
            certs_url="https://www.gstatic.com/iap/verify/public_key",
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid IAP token")
    return claims["email"]


def get_current_user(
    db: Session = Depends(get_db),
    x_goog_iap_jwt_assertion: Optional[str] = Header(None),
    x_mock_user_email: Optional[str] = Header(None)
) -> User:
    """
    Get the current authenticated user from IAP headers or mock headers (dev).
    In development mode without headers, uses a default test user.
    """
    app_env = os.getenv("APP_ENV", "production")  # fail closed: unset env = production

    if x_goog_iap_jwt_assertion:
        email = _verify_iap_jwt(x_goog_iap_jwt_assertion)
    elif app_env == "development":
        # Dev only: mock header, else default test user
        email = x_mock_user_email or "admin@salesvision.com"
    else:
        raise HTTPException(status_code=401, detail="Missing authentication")

    # Clean the email if it comes from IAP (e.g., "accounts.google.com:user@example.com")
    if ":" in email:
        email = email.split(":")[-1]

    # Look up user
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        if app_env == "development":
            # Create a mock user object for development if not in DB
            from app.models.user import UserRole
            mock_user = User(
                email=email,
                role=UserRole.ADMIN,
                is_active=True
            )
            print(f"⚠️  DEV MODE: User {email} not found in DB, using MOCK admin user.")
            return mock_user
        raise HTTPException(status_code=403, detail="User not registered in system")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")

    # Tag this transaction so the DB audit trigger records the app user
    db.execute(text("select set_config('app.user_email', :e, true)"), {"e": user.email})

    return user
