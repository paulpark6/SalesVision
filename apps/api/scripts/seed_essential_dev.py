from app.db.session import SessionLocal
from app.models.employee import Employee
from app.models.user import User, UserRole
from datetime import datetime

def seed_essential_dev_data():
    db = SessionLocal()
    try:
        print("Seeding Essential Dev Data...")
        
        # 1. Seed Essential Employees
        employees_data = [
            {"staff_number": "owner", "name": "John Doe", "position": "Director"},
            {"staff_number": "mgr-001", "name": "Jane Smith", "position": "Manager"},
            {"staff_number": "emp-001", "name": "Alex Lee", "position": "Staff"},
        ]
        
        for emp_data in employees_data:
            existing_emp = db.query(Employee).filter(Employee.staff_number == emp_data["staff_number"]).first()
            if not existing_emp:
                employee = Employee(
                    staff_number=emp_data["staff_number"],
                    name=emp_data["name"],
                    position=emp_data["position"],
                    division="Sales",
                    created_by="system",
                    updated_by="system"
                )
                db.add(employee)
                print(f"Created Employee: {emp_data['name']}")
            else:
                print(f"Employee {emp_data['name']} already exists.")
        
        db.commit()

        # 2. Seed Mock Users for Frontend
        users_data = [
            {
                "email": "admin@salesvision.com",
                "staff_name": "John Doe",
                "role": UserRole.ADMIN,
                "organization_id": "salesvision"
            },
            {
                "email": "manager@salesvision.com",
                "staff_name": "Jane Smith",
                "role": UserRole.MANAGER,
                "organization_id": "salesvision"
            },
            {
                "email": "staff@salesvision.com",
                "staff_name": "Alex Lee",
                "role": UserRole.STAFF,
                "organization_id": "salesvision"
            }
        ]

        for u_data in users_data:
            # Find Employee
            employee = db.query(Employee).filter(Employee.name == u_data["staff_name"]).first()
            if not employee:
                print(f"Skipping {u_data['email']}: Employee '{u_data['staff_name']}' not found.")
                continue
                
            existing_user = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing_user:
                new_user = User(
                    email=u_data["email"],
                    employee_id=employee.staff_number,
                    role=u_data["role"],
                    organization_id=u_data["organization_id"],
                    is_active=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                db.add(new_user)
                print(f"Created User: {u_data['email']}")
            else:
                print(f"User {u_data['email']} already exists.")
                
        db.commit()
        print("Dev seeding completed successfully.")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_essential_dev_data()
