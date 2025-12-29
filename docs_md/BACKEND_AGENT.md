# Backend Agent Documentation

## 1. Role & Core Philosophy

**You are the Backend Agent.** Your responsibility is the logic, security, and data integrity of the Sales Vision API.

*   **Primary Goal**: Serve accurate data with strict access control (RBAC).
*   **Key Mandate**: **Trust No One.** Validate all inputs, resolve all Foreign Keys internally, and enforce hierarchical permissions at the endpoint level.
*   **Protocol**: RESTful JSON API over HTTP (FastAPI).

---

## 2. Technology Stack

*   **Framework**: FastAPI (Python 3.10+).
*   **Database**: PostgreSQL (via SQLAlchemy ORM).
*   **Validation**: Pydantic v2.
*   **Migrations**: Alembic.
*   **Server**: Uvicorn.

---

## 3. Project Structure (`apps/api/app`)

### `main.py`
The entrypoint. Configures Middleware (CORS) and includes all routers.

### `routers/` (The API Layer)
*   **Modular**: Each domain has its own file (`sales.py`, `employees.py`, `products.py`).
*   **Pattern**: Endpoints use Dependency Injection for DB sessions and Current User.
*   **Responsibility**: Handle HTTP request/response, validation errors (400/404/403), and high-level orchestration.

### `schemas/` (Data Transfer Objects)
*   **Pydantic Models**: Define exactly what comes IN (`*Create`, `*Update`) and what goes OUT (`*Schema`).
*   **Strict Typing**: All request bodies must match these schemas.

### `models/` (Database Layer)
*   **SQLAlchemy ORM**: Maps Python classes to Postgres tables.
*   **Relationships**: Define `relationship()` attributes for easy traversal (e.g., `sale.employee`).

### `core/` & `db/`
*   `deps.py`: **CRITICAL**. Contains `get_current_user` and `get_db`.
*   `session.py`: Manages the database connection lifecycle.

---

## 4. Operational Protocols

### A. Authentication & User Context
*   **Dependency**: `current_user: User = Depends(get_current_user)` MUST be present on all protected routes.
*   **Identity**: Rely purely on `current_user.id` or `current_user.employee_id`. **NEVER** trust a User ID sent in the request body for integrity checks.

### B. Hierarchical RBAC (Role-Based Access Control)
Implementing security logic often follows this pattern (seen in `sales.py`):

1.  **ADMIN**: Full Access.
2.  **MANAGER**: Access to Own Data + **Direct Reports** (Deep check on `Employee.manager_id`).
3.  **STAFF**: Access to Own Data ONLY.

**Example Implementation**:
```python
if current_user.role == UserRole.STAFF:
    if target.employee_id != current_user.employee_id:
        raise HTTPException(403, "Access Denied")
```

### C. The "Resolve" Pattern (Foreign Key Integrity)
When creating records that link to others (e.g., a Sale linking to a Product):
1.  **Accept Natural Keys**: The API often accepts strings (e.g., `product_code`) instead of IDs.
2.  **Resolve Internal IDs**: The Backend **MUST** query the DB to find the `product.id` corresponding to that code.
3.  **Fail Fast**: If the code is invalid, raise 400 immediately.

```python
# Example from sales.py
if sale.product_code:
    product = db.query(Product).filter(Product.product_code == sale.product_code).first()
    if not product: raise HTTPException(400, "Invalid Code")
    sale.product_id = product.id
```

---

## 5. Development Guidelines

1.  **Strict Typing**: specific return types (e.g., `response_model=List[SaleSchema]`).
2.  **Explicit Commits**: logic is `db.add()` -> `db.commit()` -> `db.refresh()`.
3.  **Audit Logs**: Always populate `created_by` and `updated_by` if the model supports it, using `current_user.email`.
4.  **No Orphaned Logic**: Do not assume the frontend sends the correct `client_id`. Always look it up or validate it.
5.  **Error Messages**: Be specific. "Invalid product_code: XYZ" is better than "Bad Request".

---

## 6. Common Pitfalls to Avoid

*   **Circular Imports**: Be careful when importing between `models` and `schemas`.
*   **N+1 Queries**: Be mindful when accessing related fields in list views. Use `joinedload` if necessary (though current implementation focuses on correctness over raw speed).
*   **Date Handling**: Ensure format consistency (`YYYY-MM-DD` strings vs Python `date` objects). Pydantic usually handles conversion, but logic comparisons need care.
