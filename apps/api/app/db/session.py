from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


# Environment & Safety Check
APP_ENV = os.getenv("APP_ENV", "development")
ALLOW_PROD_DB = os.getenv("ALLOW_PROD_DB", "false").lower() == "true"

def check_db_safety(database_url: str):
    if not database_url:
        return
        
    # Heuristic: Check for 'prod' in URL or specific prod hosts if known
    is_prod_url = "prod" in database_url.lower() or "production" in database_url.lower()
    
    if APP_ENV == "development" and is_prod_url and not ALLOW_PROD_DB:
        raise RuntimeError(
            "\n\n🚨 CRITICAL SAFETY ERROR 🚨\n"
            "Attempting to connect to specific PRODUCTION Database URL while in DEVELOPMENT mode.\n"
            f"URL: {database_url.split('@')[-1] if '@' in database_url else '***'}\n"
            "To override, set ALLOW_PROD_DB=true in your environment.\n"
        )
    
    if APP_ENV == "development" and not is_prod_url:
        print(f"✅ Safety Check Passed: Connected to DEV/LOCAL DB ({APP_ENV})")

check_db_safety(DATABASE_URL)

# Connection Arguments (SSL for Cloud)
connect_args = {}
# If using a remote database (not localhost) and postgres, usually require SSL
if DATABASE_URL and "localhost" not in DATABASE_URL and "127.0.0.1" not in DATABASE_URL and "sqlite" not in DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
