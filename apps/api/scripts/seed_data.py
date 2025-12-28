import sys
import os
from sqlalchemy import text
from datetime import datetime, date

# Add Docker default path explicitly
sys.path.append("/app")
# Add parent directory relative to script
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(".env") 

# Direct imports
from app.db.session import SessionLocal
from app.db.base import Base
from app.models.employee import Employee
from app.models.product import Product
from app.models.client import Client
from app.models.cash import Cash
from app.models.user import User

def seed_data():
    db = SessionLocal()
    try:
        print("Connected to database...")
        
        # 1. Clear existing data
        print("Clearing existing data...")
        # Order matters for foreign keys
        db.execute(text("TRUNCATE TABLE cash_flows, sales, credits, overdue_collections, commissions, monthly_sales_targets, stocks, price_lists, expenditures, cheques CASCADE;"))
        db.execute(text("TRUNCATE TABLE clients, products, employees, users CASCADE;"))
        db.commit()

        # 2. Seed Employees
        print("Seeding MOCK Employees...")
        employees_data = [
            {"staff_number": "ADM-001", "name": "John Doe", "position": "Director", "division": "Management"},
            {"staff_number": "MGR-001", "name": "Jane Smith", "position": "Manager", "division": "Sales"},
            {"staff_number": "STF-001", "name": "Alex Lee", "position": "Staff", "division": "Sales"},
        ]
        
        employee_map = {} # Name -> ID
        
        for emp_row in employees_data:
            employee = Employee(
                staff_number=emp_row["staff_number"],
                name=emp_row["name"],
                position=emp_row["position"],
                division=emp_row["division"],
                working_start=date(2025, 1, 1),
                created_by="system",
                updated_by="system"
            )
            db.add(employee)
            db.flush() # Populate ID
            employee_map[emp_row["name"]] = employee.id
        
        db.commit()
        print(f"Seeded {len(employees_data)} Employees.")

        # 3. Seed Products
        print("Seeding MOCK Products...")
        products_data = [
            {"code": "P001", "desc": "Synthetic Oil 5W-30", "price": 25000.0},
            {"code": "P002", "desc": "Oil Filter X100", "price": 5000.0},
            {"code": "P003", "desc": "Brake Pads Front", "price": 15000.0},
        ]
        
        for prod_row in products_data:
            product = Product(
                product_code=prod_row["code"],
                product_description=prod_row["desc"],
                unit_cost=prod_row["price"],
                classification="import",
                product_category="Oil",
                created_by="system",
                updated_by="system"
            )
            db.add(product)
        
        db.commit()
        print(f"Seeded {len(products_data)} Products.")

        # 4. Seed Clients
        print("Seeding MOCK Clients...")
        clients_data = [
            {"number": "C001", "name": "Auto Repair Shop A", "grade": "A"},
            {"number": "C002", "name": "Quick Lube B", "grade": "B"},
            {"number": "C003", "name": "Transport Co C", "grade": "C"},
        ]
        
        client_map = {} # Name -> ID
        
        # Use first employee as default account owner/og/current employee
        default_emp_id = list(employee_map.values())[0] if employee_map else None
        
        if not default_emp_id:
             print("No employees seeded! Cannot seed clients.")
        else:
            for client_row in clients_data:
                client = Client(
                    client_number=client_row["number"],
                    client_name=client_row["name"],
                    client_grade=client_row["grade"],
                    og_employee_id=default_emp_id,
                    current_employee_id=default_emp_id,
                    client_category="Garage",
                    client_type="own",
                    created_by="system",
                    updated_by="system"
                )
                db.add(client)
                db.flush()
                client_map[client_row["name"]] = client.id
        
        db.commit()
        print(f"Seeded {len(clients_data)} Clients.")

        # 5. Seed Cash Flows
        print("Seeding MOCK Cash Flows...")
        
        if "John Doe" in employee_map and "Auto Repair Shop A" in client_map:
             cash = Cash(
                date=date(2025, 2, 1),
                client_id=client_map["Auto Repair Shop A"],
                employee_id=employee_map["John Doe"],
                cash_amount=50000.0,
                cash_origin="sales",
                created_by="system",
                updated_by="system"
            )
             db.add(cash)
             print("Seeded 1 Cash Flow.")
            
        db.commit()
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
