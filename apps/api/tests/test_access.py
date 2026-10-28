"""Access-control check: role + hierarchy rules across the API.

Needs a DISPOSABLE migrated database (it inserts rows):
    TEST_DATABASE_URL=postgresql://app_api:...@localhost:5544/sv venv/bin/python tests/test_access.py
"""
import os
import sys
import uuid
from pathlib import Path

url = os.environ.get("TEST_DATABASE_URL")
if not url:
    sys.exit("Set TEST_DATABASE_URL to a disposable database")
os.environ["DATABASE_URL"] = url
os.environ["APP_ENV"] = "development"
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import datetime  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from app.db.session import SessionLocal  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Employee, User, Product, Client, Sale  # noqa: E402
from app.models.user import UserRole  # noqa: E402

tag = uuid.uuid4().hex[:6]  # lets the check re-run on the same DB
db = SessionLocal()
now = dict(created_at=datetime.utcnow(), updated_at=datetime.utcnow())


def emp(name, manager=None):
    e = Employee(staff_number=f"{name}-{tag}", name=name, manager_id=manager and manager.id, version_id=1, **now)
    db.add(e); db.flush()
    return e


def user(e, role):
    email = f"{e.name}-{tag}@test.co"
    db.add(User(email=email, employee_id=e.id, role=role, is_active=True, version_id=1, **now))
    return email


boss, mgr = emp("boss"), emp("mgr")
staff_a, staff_b, view_e = emp("staff_a", mgr), emp("staff_b"), emp("viewer")
ADMIN, MGR = user(boss, UserRole.ADMIN), user(mgr, UserRole.MANAGER)
A, B, VIEW = user(staff_a, UserRole.STAFF), user(staff_b, UserRole.STAFF), user(view_e, UserRole.VIEWER)
prod = Product(product_code=f"P-{tag}", version_id=1, **now)
cli = Client(client_number=f"C-{tag}", client_name=f"Client {tag}", og_employee_id=mgr.id,
             current_employee_id=mgr.id, version_id=1, **now)
db.add_all([prod, cli]); db.flush()
sales = {e.name: Sale(product_id=prod.id, client_id=cli.id, employee_id=e.id, quantity=1, version_id=1, **now)
         for e in (mgr, staff_a, staff_b)}
db.add_all(sales.values()); db.commit()
mine = {k: s.sale_num for k, s in sales.items()}

c = TestClient(app)


def call(method, path, who, **kw):
    return c.request(method, path, headers={"x-mock-user-email": who}, **kw)


def visible_sales(who):
    return {s["sale_num"] for s in call("GET", "/sales?limit=1000", who).json()} & set(mine.values())


assert visible_sales(ADMIN) == set(mine.values())
assert visible_sales(MGR) == {mine["mgr"], mine["staff_a"]}, "manager = self + direct reports"
assert visible_sales(A) == {mine["staff_a"]}, "staff = own only"
assert call("GET", f"/sales/{mine['staff_b']}", A).status_code == 403
assert call("GET", f"/sales/{mine['staff_b']}", MGR).status_code == 403, "not manager's report"
body = {"product_id": prod.id, "client_id": cli.id, "employee_id": staff_b.id}
assert call("PUT", f"/sales/{mine['staff_a']}", A, json=body).status_code == 403, "no reassigning"
assert call("PUT", f"/sales/{mine['staff_a']}", A, json={**body, "employee_id": staff_a.id}).status_code == 200
assert call("DELETE", f"/sales/{mine['staff_a']}", VIEW).status_code == 403
assert call("DELETE", f"/sales/{mine['staff_a']}", A).status_code == 403
assert call("POST", "/sales", MGR, json={"product_id": prod.id, "client_id": cli.id, "employee_id": staff_b.id,
                                          "quantity": 1, "unit_price": 1, "sale_amount": 1}).status_code == 403
assert call("POST", "/sales", A, json={"product_id": prod.id, "client_id": cli.id,
                                        "quantity": -5, "unit_price": 1, "sale_amount": 1}).status_code == 422

assert call("POST", "/users/", A, json={"email": "x@x", "employee_id": staff_a.id, "role": "admin"}).status_code == 403
assert call("PUT", "/users/1", A, json={"role": "admin"}).status_code == 403
assert call("GET", "/users/", A).status_code == 403
assert call("GET", "/users/me", A).json()["email"] == A
assert call("GET", "/analytics/summary", MGR).status_code == 403
assert call("POST", "/products/", A, json={"product_code": "hack"}).status_code == 403
assert call("DELETE", f"/clients/{cli.id}", A).status_code == 403
assert call("GET", "/products/", VIEW).status_code == 200

team = {e["id"] for e in call("GET", "/employees/", MGR).json()}
assert team == {mgr.id, staff_a.id}, team
assert call("GET", "/employees/", A).status_code == 403

os.environ["APP_ENV"] = "production"
assert call("GET", "/sales", ADMIN).status_code == 401, "prod ignores mock header"
os.environ["SUPABASE_URL"] = "https://example.supabase.co"
assert c.get("/sales", headers={"authorization": "Bearer forged"}).status_code == 401, "forged token"
os.environ.pop("APP_ENV")
assert c.get("/sales").status_code == 401, "unset APP_ENV fails closed"

# Every endpoint except health checks must refuse anonymous requests in production
os.environ["APP_ENV"] = "production"
public = {"/", "/healthz/ready", "/healthz/live", "/docs", "/docs/oauth2-redirect", "/redoc", "/openapi.json"}
for r in app.routes:
    if r.path in public:
        continue
    path = r.path.replace("{", "").replace("}", "")  # any value works; auth runs first
    for m in r.methods - {"HEAD", "OPTIONS"}:
        code = c.request(m, path, json={}).status_code
        assert code == 401, f"{m} {r.path} returned {code} without login"

print("access check passed")
