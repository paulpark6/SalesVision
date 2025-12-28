import sys
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the parent directory to sys.path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api')))

from app.main import app
from app.db.session import get_db
from app.db.base import Base

# Create a TestClient
client = TestClient(app)

def test_endpoints():
    print("Starting Phase 2 Endpoint Verification...")

    # 1. Test Products
    print("\n[Testing Products]...")
    product_data = {
        "product_code": "TEST-PROD-001",
        "product_description": "Test Product",
        "product_category": "Test Category",
        "unit_cost": 10.50
    }
    # Create
    response = client.post("/products/", json=product_data)
    if response.status_code == 201:
        print("✅ Create Product: Success")
        product_id = response.json()["id"]
    elif response.status_code == 400 and "already exists" in response.text:
         print("⚠️ Create Product: Already exists (Skipping creation)")
         # Try to fetch it to get ID
         response = client.get("/products/") # This is inefficient but simple for now
         for p in response.json():
             if p["product_code"] == "TEST-PROD-001":
                 product_id = p["id"]
                 break
    else:
        print(f"❌ Create Product: Failed ({response.status_code}) - {response.text}")
        return

    # Read
    response = client.get(f"/products/{product_id}")
    if response.status_code == 200:
        print("✅ Read Product: Success")
    else:
        print(f"❌ Read Product: Failed ({response.status_code})")

    # 2. Test Clients
    print("\n[Testing Clients]...")
    client_data = {
        "client_number": "TEST-CLI-001",
        "client_name": "Test Client",
        "client_category": "Test Category",
        "client_grade": "A"
    }
    # Create
    response = client.post("/clients/", json=client_data)
    if response.status_code == 201:
        print("✅ Create Client: Success")
        client_id = response.json()["id"]
    elif response.status_code == 400 and "already exists" in response.text:
         print("⚠️ Create Client: Already exists (Skipping creation)")
         # Fetch ID
         response = client.get("/clients/")
         for c in response.json():
             if c["client_number"] == "TEST-CLI-001":
                 client_id = c["id"]
                 break
    else:
        print(f"❌ Create Client: Failed ({response.status_code}) - {response.text}")
        return

    # Read
    response = client.get(f"/clients/{client_id}")
    if response.status_code == 200:
        print("✅ Read Client: Success")
    else:
        print(f"❌ Read Client: Failed ({response.status_code})")

    # 3. Test Sales
    print("\n[Testing Sales]...")
    sale_data = {
        "inventory_in_out": "OUT",
        "product_code": "TEST-PROD-001",
        "quantity": 5,
        "client_number": "TEST-CLI-001",
        "amount": 52.50
    }
    # Create
    response = client.post("/sales/", json=sale_data)
    if response.status_code == 201:
        print("✅ Create Sale: Success")
        sale_id = response.json()["id"]
    else:
        print(f"❌ Create Sale: Failed ({response.status_code}) - {response.text}")
        return

    # Read
    response = client.get(f"/sales/{sale_id}")
    if response.status_code == 200:
        print("✅ Read Sale: Success")
    else:
        print(f"❌ Read Sale: Failed ({response.status_code})")

    # Clean up (Delete created items)
    print("\n[Cleaning Up]...")
    res = client.delete(f"/sales/{sale_id}")
    print(f"Delete Sale: {res.status_code}")
    res = client.delete(f"/products/{product_id}")
    print(f"Delete Product: {res.status_code}")
    res = client.delete(f"/clients/{client_id}")
    print(f"Delete Client: {res.status_code}")

    print("\nVerification Complete.")

if __name__ == "__main__":
    test_endpoints()
