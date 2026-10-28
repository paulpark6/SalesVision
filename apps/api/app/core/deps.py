from typing import Optional
from fastapi import Depends, HTTPException, Header
from sqlalchemy import func, text
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
import jwt
import os

_jwks: Optional[jwt.PyJWKClient] = None


def _verify_supabase_jwt(token: str) -> str:
    """Verify a Supabase Auth access token against the project's public signing keys."""
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    if not url:
        raise HTTPException(status_code=500, detail="SUPABASE_URL not configured")
    global _jwks
    _jwks = _jwks or jwt.PyJWKClient(f"{url}/auth/v1/.well-known/jwks.json")
    try:
        key = _jwks.get_signing_key_from_jwt(token).key
        claims = jwt.decode(token, key, algorithms=["ES256", "RS256"],
                            audience="authenticated", issuer=f"{url}/auth/v1")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not claims.get("email"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return claims["email"]


def get_current_user(
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None),
    x_mock_user_email: Optional[str] = Header(None)
) -> User:
    """
    Get the current user from the Supabase bearer token, or mock headers (dev).
    In development mode without headers, uses a default test user.
    """
    app_env = os.getenv("APP_ENV", "production")  # fail closed: unset env = production

    if authorization and authorization.lower().startswith("bearer "):
        email = _verify_supabase_jwt(authorization[7:])
    elif app_env == "development":
        # Dev only: mock header, else default test user
        email = x_mock_user_email or "admin@salesvision.com"
    else:
        raise HTTPException(status_code=401, detail="Missing authentication")

    # Look up user
    user = db.query(User).filter(func.lower(User.email) == email.lower()).first()
    
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
