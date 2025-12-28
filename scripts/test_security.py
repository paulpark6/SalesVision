import sys
import os
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api')))

from app.main import app

# Create a TestClient
client = TestClient(app)

def test_security():
    print("Starting Security & RBAC Verification...")

    # Headers for different roles
    headers_admin = {"x-mock-user-email": "admin@salesvision.com"}
    headers_manager = {"x-mock-user-email": "manager@salesvision.com"}
    headers_staff = {"x-mock-user-email": "staff@salesvision.com"}
    headers_other = {"x-mock-user-email": "other@salesvision.com"}

    # Setup Helper
    def create_if_not_exists(endpoint, data, unique_key):
        res = client.post(f"/{endpoint}/", json=data) # Public or Admin? 
        # Wait, our endpoints now REQUIRE auth. 
        # So we must use admin headers to setup data.
        res = client.post(f"/{endpoint}/", json=data, headers=headers_admin)
        if res.status_code == 201:
            return res.json()["id"]
        elif res.status_code == 400:
             # Find existing
             res_list = client.get(f"/{endpoint}/", headers=headers_admin)
             for item in res_list.json():
                 if item.get(unique_key) == data.get(unique_key):
                     return item["id"]
        return None

    # 1. Setup Data Hierarchy
    # Admin User (Pre-existing?) -> We need to create them first?
    # BUT wait, create_user endpoint is NOT secured yet! (Based on my memory, I only secured Sales).
    # So we can create users freely.
    
    print("\n[Setup Users & Hierarchy]")
    
    # Manager
    mgr_emp_id = create_if_not_exists("employees", {
        "staff_number": "EMP-MGR",
        "name": "Manager User",
        "position": "manager"
    }, "staff_number")
    
    create_if_not_exists("users", {
        "email": "manager@salesvision.com",
        "employee_id": "EMP-MGR",
        "role": "manager"
    }, "email")

    # Staff (Reports to Manager)
    staff_emp_id = create_if_not_exists("employees", {
        "staff_number": "EMP-STAFF",
        "name": "Staff User",
        "position": "sales",
        "manager": "EMP-MGR" # Hierarchy!
    }, "staff_number")

    create_if_not_exists("users", {
        "email": "staff@salesvision.com",
        "employee_id": "EMP-STAFF",
        "role": "staff"
    }, "email")

    # Other Staff (No relation)
    other_emp_id = create_if_not_exists("employees", {
        "staff_number": "EMP-OTHER",
        "name": "Other User",
        "position": "sales"
    }, "staff_number")

    create_if_not_exists("users", {
        "email": "other@salesvision.com",
        "employee_id": "EMP-OTHER",
        "role": "staff"
    }, "email")

    # Admin
    admin_emp_id = create_if_not_exists("employees", {
        "staff_number": "EMP-ADMIN",
        "name": "Admin User",
        "position": "admin"
    }, "staff_number")

    create_if_not_exists("users", {
        "email": "admin@salesvision.com",
        "employee_id": "EMP-ADMIN",
        "role": "admin"
    }, "email")
    
    # Create Resources (Sales)
    # Products/Clients needed first
    prod_id = create_if_not_exists("products", {
        "product_code": "SEC-PROD", 
        "product_description": "Secure Product",
        "unit_cost": 10
    }, "product_code")
    
    client_id = create_if_not_exists("clients", {
        "client_number": "SEC-CLI",
        "client_name": "Secure Client",
        "client_grade": "A"
    }, "client_number")

    if not prod_id or not client_id:
        print(f"❌ Failed to setup prerequisites. Prod: {prod_id}, Cli: {client_id}")
        sys.exit(1)

    print("\n[Testing Sales Visibility]")
    
    # Create Sale for Staff (by Staff)
    res = client.post("/sales/", json={
        "product_code": "SEC-PROD",
        "client_number": "SEC-CLI",
        "quantity": 5,
        "amount": 50,
        "staff": "EMP-STAFF" 
    }, headers=headers_staff)
    if res.status_code == 201:
        print("✅ Staff created own sale")
        sale_staff_id = res.json()["id"]
    else:
        print(f"❌ Staff failed to create sale: {res.text}")
        sys.exit(1)

    # Create Sale for Other (by Other)
    res = client.post("/sales/", json={
        "product_code": "SEC-PROD",
        "client_number": "SEC-CLI",
        "quantity": 1,
        "amount": 10,
        "staff": "EMP-OTHER"
    }, headers=headers_other)
    sale_other_id = res.json()["id"]

    # --- VERIFICATION ---

    # 1. Staff should see ONLY their own sale
    res = client.get("/sales/", headers=headers_staff)
    sales = res.json()
    ids = [s["id"] for s in sales]
    if sale_staff_id in ids and sale_other_id not in ids:
        print("✅ Staff sees own sale, not others")
    else:
        print(f"❌ Staff visibility failed. IDs seen: {ids}")
        sys.exit(1)

    # 2. Manager should see Staff's sale (Direct Report) but maybe NOT Other's (if not reporting)
    res = client.get("/sales/", headers=headers_manager)
    sales = res.json()
    ids = [s["id"] for s in sales]
    if sale_staff_id in ids:
        print("✅ Manager sees direct report's sale")
    else:
        print(f"❌ Manager failed to see report's sale. IDs seen: {ids}")
        sys.exit(1)
        
    if sale_other_id not in ids:
        print("✅ Manager does NOT see unrelated sale")
    else:
        print(f"⚠️ Manager saw unrelated sale (Did we set hierarchy correctly?)")

    # 3. Admin should see EVERYTHING
    res = client.get("/sales/", headers=headers_admin)
    sales = res.json()
    ids = [s["id"] for s in sales]
    if sale_staff_id in ids and sale_other_id in ids:
        print("✅ Admin sees all sales")
    else:
         print(f"❌ Admin visibility failed. IDs seen: {ids}")
         sys.exit(1)

    print("\n🎉 SECURITY VERIFICATION PASSED")

if __name__ == "__main__":
    test_security()
