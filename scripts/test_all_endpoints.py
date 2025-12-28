import sys
import os
import time
from fastapi.testclient import TestClient

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api')))

from app.main import app

# Create a TestClient
client = TestClient(app)

def test_endpoints():
    print("Starting Comprehensive API Verification (15 Modules)...")
    
    # Track results
    results = {"success": [], "failed": []}
    created_resources = [] # Stack to store ({endpoint}, {id}) for cleanup

    def create_resource(endpoint, data, unique_key_field=None):
        print(f"\n[Creating {endpoint}]")
        res = client.post(f"/{endpoint}/", json=data)
        
        resource_id = None
        if res.status_code == 201:
            print(f"✅ Create: Success")
            resource_id = res.json()["id"]
            created_resources.append((endpoint, resource_id))
            results["success"].append(endpoint)
        elif res.status_code == 400 and "already exists" in res.text:
            print(f"⚠️ Create: Already exists (Using existing)")
            # Try to fetch existing
            res_list = client.get(f"/{endpoint}/")
            if res_list.status_code == 200:
                for item in res_list.json():
                    if unique_key_field and item.get(unique_key_field) == data.get(unique_key_field):
                         resource_id = item["id"]
                         break
                if not resource_id and len(res_list.json()) > 0:
                     resource_id = res_list.json()[-1]["id"]
            
            if resource_id:
                 results["success"].append(endpoint)
            else:
                 print(f"❌ Could not find existing resource")
                 results["failed"].append(endpoint)
        else:
            print(f"❌ Create: Failed ({res.status_code}) - {res.text}")
            results["failed"].append(endpoint)
        
        return resource_id

    try:
        # --- 1. Create Core Dependencies ---
        
        # Employee
        emp_id = create_resource("employees", {
            "staff_number": "TEST-EMP-SHARED",
            "name": "Test Shared Employee",
            "position": "Tester"
        }, unique_key_field="staff_number")
        
        # Client
        cli_id = create_resource("clients", {
            "client_number": "TEST-CLI-SHARED",
            "client_name": "Test Shared Client",
            "client_grade": "A"
        }, unique_key_field="client_number")

        # Product
        prod_id = create_resource("products", {
            "product_code": "TEST-PROD-SHARED",
            "product_description": "Test Shared Product",
            "unit_cost": 50.0
        }, unique_key_field="product_code")

        if not (emp_id and cli_id and prod_id):
            print("❌ Critical dependencies failed to create. Aborting.")
            sys.exit(1)

        # --- 2. Test Dependent Modules ---

        # Users
        create_resource("users", {
            "email": "testshared@test.com",
            "employee_id": "TEST-EMP-SHARED",
            "role": "staff"
        }, unique_key_field="email")

        # Sales
        create_resource("sales", {
            "product_code": "TEST-PROD-SHARED",
            "client_number": "TEST-CLI-SHARED",
            "quantity": 2,
            "amount": 100.0,
            "staff": "TEST-EMP-SHARED"
        })

        # Cash
        create_resource("cash", {
            "client_number": "TEST-CLI-SHARED",
            "staff": "TEST-EMP-SHARED",
            "cash_amount": 75.0,
            "cash_origin": "Test"
        })

        # Cheque
        create_resource("cheques", {
            "cheque_number": "CHQ-SHARED",
            "client_number": "TEST-CLI-SHARED",
            "staff": "TEST-EMP-SHARED",
            "cheque_amount": 500.0
        }, unique_key_field="cheque_number")

        # Commission
        create_resource("commissions", {
            "staff_number": "TEST-EMP-SHARED",
            "commission": 15.0
        })

        # Credit
        create_resource("credits", {
            "client_number": "TEST-CLI-SHARED",
            "staff": "TEST-EMP-SHARED",
            "credit_amount": 200.0
        })

        # Expenditure
        create_resource("expenditures", {
            "product_code": "TEST-PROD-SHARED",
            "cost": 25.0,
            "expenditure_category": "Test"
        })

        # Monthly Sales Target
        create_resource("monthly-sales-targets", {
            "product_code": "TEST-PROD-SHARED",
            "staff": "TEST-EMP-SHARED",
            "sales_monthly_target": 1000.0
        })

        # Overdue Collection
        create_resource("overdue-collections", {
            "client_number": "TEST-CLI-SHARED",
            "staff": "TEST-EMP-SHARED",
            "credit_amount": 300
        })

        # Price List
        create_resource("price-lists", {
            "product_code": "TEST-PROD-SHARED",
            "client_grade": "A",
            "price": 12.0
        })

        # Stock
        create_resource("stocks", {
            "product_code": "TEST-PROD-SHARED",
            "stock_quantity": 50.0
        })

    finally:
        print("\n[Cleaning Up]")
        # Delete in reverse order of creation to respect foreign keys
        for endpoint, res_id in reversed(created_resources):
            try:
                res = client.delete(f"/{endpoint}/{res_id}")
                if res.status_code == 204:
                    print(f"✅ Deleted {endpoint}/{res_id}")
                else:
                    print(f"❌ Failed to delete {endpoint}/{res_id}: {res.status_code}")
            except Exception as e:
                print(f"❌ Error deleting {endpoint}/{res_id}: {e}")

    print("\n" + "="*30)
    print("SUMMARY")
    print("="*30)
    print(f"Total Modules Verified: {len(results['success'])}")
    print(f"Failed: {len(results['failed'])}")
    
    if results['failed']:
        print(f"Failed Modules: {', '.join(results['failed'])}")
        sys.exit(1)
    else:
        print("🎉 ALL CHECKS PASSED")
        sys.exit(0)

if __name__ == "__main__":
    test_endpoints()
