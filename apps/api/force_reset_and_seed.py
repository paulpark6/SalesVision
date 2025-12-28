from sqlalchemy import text
from app.db.session import engine
from app.db.base import Base

def force_reset():
    with engine.connect() as conn:
        print("Dropping alembic_version...")
        conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
        conn.commit()
    
    print("Dropping all other tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables from scratch...")
    Base.metadata.create_all(bind=engine)
    
    print("Seeding Admin user...")
    from sqlalchemy.orm import Session
    from app.models.user import User, UserRole
    from app.models.employee import Employee
    from datetime import date
    
    with Session(engine) as session:
        # Create an employee first because User depends on it
        admin_emp = Employee(
            staff_number="ADM-001",
            name="Admin User",
            position="Administrator",
            working_start=date(2025, 1, 1)
        )
        session.add(admin_emp)
        session.flush() # Get the ID
        
        admin_user = User(
            email="admin@salesvision.com",
            employee_id=admin_emp.id,
            role=UserRole.ADMIN,
            is_active=True
        )
        session.add(admin_user)
        session.commit()
        print(f"Admin user seeded: admin@salesvision.com (Linked to Employee ID: {admin_emp.id})")

if __name__ == "__main__":
    force_reset()
