from typing import Generator, Optional
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.employee import Employee
import os

def get_current_user(
    db: Session = Depends(get_db),
    x_goog_authenticated_user_email: Optional[str] = Header(None),
    x_mock_user_email: Optional[str] = Header(None)
) -> User:
    """
    Get the current authenticated user from IAP headers or mock headers (dev).
    In development mode without headers, uses a default test user.
    """
    email = x_goog_authenticated_user_email
    
    # Fallback for local development
    if not email:
        # Only allow mock header in non-production environments
        if os.getenv("APP_ENV", "development") != "production":
            email = x_mock_user_email
        
    # If still no email, use default test user in development mode
    if not email:
        app_env = os.getenv("APP_ENV", "development")
        if app_env == "development":
            # Use default test user for development
            email = "admin@salesvision.com"
            print(f"⚠️  DEV MODE: Using default test user: {email}")
        else:
            # In production IAP, this should never happen if endpoints are secured by IAP.
            raise HTTPException(status_code=401, detail="Missing authentication header")

    # Clean the email if it comes from IAP (e.g., "accounts.google.com:user@example.com")
    if ":" in email:
        email = email.split(":")[-1]

    # Look up user
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        if os.getenv("APP_ENV", "development") == "development":
            # Create a mock user object for development if not in DB
            from app.models.user import UserRole
            mock_user = User(
                email=email,
                role=UserRole.ADMIN,
                is_active=True
            )
            print(f"⚠️  DEV MODE: User {email} not found in DB, using MOCK admin user.")
            return mock_user
        raise HTTPException(status_code=403, detail=f"User {email} not registered in system")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")

    return user
