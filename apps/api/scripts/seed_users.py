import sys
import os
from sqlalchemy import text
from datetime import datetime

# Add parent directory to path to import app modules
# Assuming script is run from project root or apps/api
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(".env")

try:
    from app.db.session import SessionLocal
    from app.models.employee import Employee
    from app.models.user import User, UserRole
except ImportError as e:
    print(f"DEBUG: Import failed: {e}")
    # Try appending the current directory if run from apps/api
    sys.path.append(os.getcwd())
    from app.db.session import SessionLocal
    from app.models.employee import Employee
    from app.models.user import User, UserRole

def seed_users():
    db = SessionLocal()
    try:
        print("Seeding Users...")
        
        # Define users to match Frontend Mocks
        # John Doe (Director/Admin)
        # Alex Ray (Manager)
        # Jane Smith (Staff)
        
        users_data = [
            # {
            #     "email": "03paulpark@gmail.com", # Real Admin User
            #     "staff_name": "John Doe", # Link to Director
            #     "role": UserRole.ADMIN,
            #     "organization_id": "salesvision"
            # },
            {
                "email": "admin@salesvision.com", # Mock email for John Doe
                "staff_name": "John Doe",
                "role": UserRole.ADMIN,
                "organization_id": "salesvision"
            },
            {
                "email": "manager@salesvision.com", 
                "staff_name": "Jane Smith", # Map to existing Manager from CSV
                "role": UserRole.MANAGER,
                "organization_id": "salesvision"
            },
            {
                "email": "staff@salesvision.com", 
                "staff_name": "Alex Lee", # Map to existing Employee from CSV
                "role": UserRole.STAFF,
                "organization_id": "salesvision"
            },
            # Test user for multi-tenancy verification
            # Note: This user won't link to an Employee yet (unless we mock one), 
            # but for now we mainly want to test the User record creation with a different Org ID.
            # To avoid Foreign Key constraint failure on Employee, we'll skipping this for now
            # OR we need to create a dummy employee.
            # For simplicity, let's just stick to SalesVision users for now.
        ]
        
        for u_data in users_data:
            # 1. Find Employee
            employee = db.query(Employee).filter(Employee.name == u_data["staff_name"]).first()
            if not employee:
                print(f"Skipping {u_data['email']}: Employee '{u_data['staff_name']}' not found. (Did you run seed_data.py?)")
                continue
                
            # 2. Check if User exists
            existing_user = db.query(User).filter(User.email == u_data["email"]).first()
            if existing_user:
                print(f"User {u_data['email']} already exists. Updating Org ID...")
                existing_user.organization_id = u_data.get("organization_id", "salesvision")
                db.add(existing_user)
                continue
                
            # 3. Create User
            new_user = User(
                email=u_data["email"],
                employee_id=employee.id,
                role=u_data["role"],
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(new_user)
            print(f"Created User: {u_data['email']} for {u_data['staff_name']}")
            
        db.commit()
        print("User seeding completed.")

    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
