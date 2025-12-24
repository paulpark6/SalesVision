import sys
import os
import pandas as pd
from sqlalchemy import text # type: ignore
from datetime import datetime

# Add parent directory to path to import app modules
# Add parent directory to path to import app modules
# Script is now in apps/api/, so current dir is in sys.path if run from there.
# But if run from root with module logic, it varies.
# Let's rely on standard path if run from project root?
# No, let's run it from apps/api directory to be safe.

from dotenv import load_dotenv
load_dotenv(".env") # Load .env from current dir

try:
    from app.db.session import SessionLocal
    from app.models import Employee, Product, Client, Cash, User
    from app.db.base import Base
except ImportError as e:
    print(f"DEBUG: Import failed: {e}")
    sys.exit(1)

def seed_data():
    db = SessionLocal()
    try:
        print("Connected to database...")
        
        # 1. Clear existing data (in reverse dependency order)
        # Note: In production, do NOT do this blindly.
        print("Clearing existing data...")
        db.execute(text("TRUNCATE TABLE cash_flows, sales, credits, overdue_collections, commissions, monthly_sales_targets, stocks, price_lists, expenditures, cheques CASCADE;"))
        db.execute(text("TRUNCATE TABLE clients, products, employees, users CASCADE;"))
        db.commit()

        # 2. Seed Employees
        print("Seeding Employees...")
        # Path relative to apps/api/ (where script is) -> ../../db/csv
        emp_df = pd.read_csv("../../db/csv/employees/employees.csv")
        # Map: value -> staff_number, label -> name, role -> position
        
        name_to_id_map = {}
        
        for _, row in emp_df.iterrows():
            staff_num = str(row['value']).strip()
            name = str(row['label']).strip()
            
            employee = Employee(
                staff_number=staff_num,
                name=name,
                position=row['role'],
                division="Sales", # Default
                created_by="system",
                updated_by="system"
            )
            db.add(employee)
            name_to_id_map[name] = staff_num
        
        db.commit()
        print(f"Seeded {len(emp_df)} Employees.")

        # 3. Seed Products
        print("Seeding Products...")
        prod_df = pd.read_csv("../../db/csv/inventory/products.csv")
        # Map: value -> product_code, label -> description, basePrice -> price?
        
        for _, row in prod_df.iterrows():
            product = Product(
                product_code=str(row['value']).strip(),
                product_description=str(row['label']).strip(),
                unit_cost=float(row['basePrice']),
                created_by="system",
                updated_by="system"
            )
            db.add(product)
        
        db.commit()
        print(f"Seeded {len(prod_df)} Products.")

        # 4. Seed Clients
        print("Seeding Clients...")
        client_df = pd.read_csv("../../db/csv/customers/customers.csv")
        # Map: value -> client_number, label -> client_name, grade -> client_grade
        
        for _, row in client_df.iterrows():
            client = Client(
                client_number=str(row['value']).strip(),
                client_name=str(row['label']).strip(),
                client_grade=str(row['grade']).strip(),
                created_by="system",
                updated_by="system"
            )
            db.add(client)
        
        db.commit()
        print(f"Seeded {len(client_df)} Clients.")

        # 5. Seed Cash Flows (Example of transaction)
        print("Seeding Cash Flows...")
        cash_df = pd.read_csv("../../db/csv/reports/cash/cash-sales.csv")
        # id, employeeName, customerName, source, amount, date
        
        for _, row in cash_df.iterrows():
            # Lookup Staff ID from Name
            emp_name = str(row['employeeName']).strip()
            staff_id = name_to_id_map.get(emp_name)
            
            # Lookup Client ID from Name (Optional: build client map if needed, or query)
            # For simplicity, we query DB or assume consistency? 
            # Ideally we built a map for clients too. Let's just query or skip if missing in a real script.
            # But here we will try to look up client by name if we had the map.
            # Re-reading client DF to make a quick map
            client_map = dict(zip(client_df['label'].str.strip(), client_df['value'].str.strip()))
            client_id = client_map.get(str(row['customerName']).strip())
            
            if not staff_id:
                print(f"Warning: Employee {emp_name} not found. Skipping cash entry {row['id']}")
                continue
                
            cash = Cash(
                date=str(row['date']),
                client_name=str(row['customerName']),
                client_number=client_id, # Can be null if not found
                staff=staff_id,
                cash_amount=float(row['amount']),
                cash_origin=str(row['source']),
                created_by="system",
                updated_by="system"
            )
            db.add(cash)
            
        db.commit()
        print(f"Seeded {len(cash_df)} Cash Flows.")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
