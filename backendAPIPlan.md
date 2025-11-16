# Backend API Planning & Implementation Guide

## Overview

SalesVision backend API must be built from minimal FastAPI scaffold - currently only health checks exist. Need full REST API with 60+ endpoints, JWT auth, role-based access control, database integration, business logic, and Cloud Run deployment.

**Current State (Updated 2025-11-15):**
- ✅ FastAPI 0.111.0+ installed
- ✅ SQLAlchemy 2.0+ with asyncpg, psycopg2
- ✅ Alembic initialized, migration generated and applied
- ✅ Docker configuration ready
- ✅ Cloud SQL database running (sales-vision-db, us-central1)
- ✅ DATABASE_URL stored in Secret Manager
- ✅ 14 SQLAlchemy models built
- ✅ 14 tables created in PostgreSQL
- ✅ Virtual environment set up
- ✅ Cloud SQL Proxy configured
- ✅ Database connectivity verified
- ❌ Only 2 endpoints exist (`/healthz/ready`, `/healthz/live`)
- ❌ Database session management not implemented
- ❌ No business logic routers
- ❌ No authentication system
- ❌ No CRUD operations

**Target State:**
- 11 business domain routers
- JWT authentication + IAP integration
- Role-based access control middleware
- 60+ REST endpoints
- Database CRUD operations
- Pydantic validation schemas
- Deployed to Cloud Run

---

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js)                │
│     fetch('/api/sales', {credentials})      │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────┐
│         FastAPI Application                  │
│  ┌─────────────────────────────────────┐   │
│  │  Middleware Layer                    │   │
│  │  - CORS                              │   │
│  │  - Authentication (JWT verify)       │   │
│  │  - Request logging                   │   │
│  │  - Error handling                    │   │
│  └─────────────────┬───────────────────┘   │
│  ┌─────────────────▼───────────────────┐   │
│  │  Routers (Controllers)               │   │
│  │  - sales.py                          │   │
│  │  - customers.py                      │   │
│  │  - products.py                       │   │
│  │  - ... (11 routers)                  │   │
│  └─────────────────┬───────────────────┘   │
│  ┌─────────────────▼───────────────────┐   │
│  │  Pydantic Schemas                    │   │
│  │  - Request validation                │   │
│  │  - Response serialization            │   │
│  └─────────────────┬───────────────────┘   │
│  ┌─────────────────▼───────────────────┐   │
│  │  CRUD Operations                     │   │
│  │  - Database query functions          │   │
│  │  - Pagination, filtering             │   │
│  └─────────────────┬───────────────────┘   │
│  ┌─────────────────▼───────────────────┐   │
│  │  SQLAlchemy Models                   │   │
│  │  - ORM mapping                       │   │
│  │  - Relationships                     │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         PostgreSQL Database                  │
│         (Cloud SQL)                          │
└─────────────────────────────────────────────┘
```

### Technology Stack

**Core Framework:**
- FastAPI 0.111.0+ (async support)
- Uvicorn (ASGI server)
- Python 3.12

**Database:**
- SQLAlchemy 2.0+ (async ORM)
- asyncpg (PostgreSQL driver)
- Alembic (migrations)

**Validation:**
- Pydantic v2 (request/response models)
- pydantic-settings (config management)

**Authentication:**
- JWT tokens (python-jose)
- Passlib + bcrypt (password hashing)
- Google IAP integration (planned)

**Utilities:**
- HTTPX (async HTTP client)
- python-dotenv (environment variables)

---

## API Endpoints Reference

### Authentication & User Management (6 endpoints)

```
POST   /api/auth/register           Create new user account
POST   /api/auth/login              Login with staff_number + password
POST   /api/auth/logout             Invalidate session
POST   /api/auth/refresh            Refresh JWT token
GET    /api/auth/me                 Get current user info
POST   /api/auth/delegate           Delegate account access
```

### Sales Management (8 endpoints)

```
POST   /api/sales                   Create new sale
GET    /api/sales                   List sales (paginated, filtered)
GET    /api/sales/{id}              Get sale detail
PUT    /api/sales/{id}              Update sale
DELETE /api/sales/{id}              Delete sale (admin only)
POST   /api/sales/{id}/approve      Approve special discount (manager)
GET    /api/sales/report            Sales report by employee/period
GET    /api/sales/cumulative        Cumulative monthly report
```

### Customer Management (7 endpoints)

```
POST   /api/customers               Create customer
GET    /api/customers               List customers (filtered by owner/team)
GET    /api/customers/{id}          Get customer detail
PUT    /api/customers/{id}          Update customer
DELETE /api/customers/{id}          Delete customer (admin only)
POST   /api/customers/{id}/approve  Approve pending customer type
GET    /api/customers/{id}/sales    Customer sales history
```

### Product Management (6 endpoints)

```
POST   /api/products                Create product
GET    /api/products                List products
GET    /api/products/{id}           Get product detail
PUT    /api/products/{id}           Update product
DELETE /api/products/{id}           Delete product (admin only)
GET    /api/products/{id}/prices    Get price list by grade
```

### Price List Management (3 endpoints)

```
GET    /api/price-lists             List all prices (filterable)
POST   /api/price-lists             Create/update prices
PUT    /api/price-lists/{id}        Update specific price
```

### Employee Management (5 endpoints)

```
POST   /api/employees               Create employee (manager only)
GET    /api/employees               List employees
GET    /api/employees/{id}          Get employee detail
PUT    /api/employees/{id}          Update employee
GET    /api/employees/{id}/performance  Performance metrics
```

### Inventory Management (5 endpoints)

```
GET    /api/inventory               List inventory status
GET    /api/inventory/{product_id}  Get product inventory
PUT    /api/inventory/{product_id}  Update stock level (admin)
POST   /api/inventory/adjust        Adjust stock (manual correction)
GET    /api/inventory/low-stock     Low stock alerts
```

### Credit Management (6 endpoints)

```
GET    /api/credit                  List credit transactions
GET    /api/credit/due              Due payments dashboard
GET    /api/credit/overdue          Overdue collections
POST   /api/credit/{id}/payment     Record payment
PUT    /api/credit/{id}             Update credit status
GET    /api/credit/summary          Credit summary by customer
```

### Commission Management (4 endpoints)

```
GET    /api/commissions             List commissions (by month)
GET    /api/commissions/{employee_id}/{month}  Employee detail
POST   /api/commissions/calculate   Calculate monthly commissions
POST   /api/commissions/{id}/approve  Approve commission (admin)
```

### Reports (6 endpoints)

```
GET    /api/reports/cash            Cash flow report
GET    /api/reports/checks          Check payment report
POST   /api/reports/checks/{id}/update  Update check status
GET    /api/reports/expenditures    Expenditure report
GET    /api/reports/profit-loss     Profit & loss statement
GET    /api/reports/sales-targets   Sales target progress
```

### Dashboard (4 endpoints)

```
GET    /api/dashboard/overview      Admin dashboard metrics
GET    /api/dashboard/sales-chart   Sales trend chart data
GET    /api/dashboard/recent-activity  Recent sales/payments
GET    /api/dashboard/alerts        Due payments, low stock alerts
```

### Import/Upload (4 endpoints)

```
POST   /api/imports/customers       Upload customer CSV
POST   /api/imports/products        Upload product CSV
POST   /api/imports/prices          Upload price list CSV
GET    /api/imports/templates       Download CSV templates
```

### AI/Analytics (2 endpoints)

```
POST   /api/ai/analyze              Analyze sales trends (Gemini)
GET    /api/ai/insights             Get AI-generated insights
```

### Health Check (2 endpoints - existing)

```
GET    /healthz/ready               Readiness probe
GET    /healthz/live                Liveness probe
```

**Total: 68 endpoints**

---

## Authentication & Authorization

### JWT Implementation

**Token Structure:**
```python
# app/core/security.py
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key-here"  # From environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

**Login Endpoint:**
```python
# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/auth", tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    # Validate user
    user = await crud_user.get_by_staff_number(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect staff number or password"
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "staff_number": user.staff_number}
    )

    # Create session
    session = await crud_session.create(
        db,
        user_id=user.id,
        session_token=access_token,
        expires_at=datetime.utcnow() + timedelta(hours=8)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "name": user.name,
            "role": user.role,
            "staff_number": user.staff_number
        }
    }
```

### Role-Based Access Control

**Dependency for Current User:**
```python
# app/core/deps.py
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await crud_user.get(db, id=user_id)
    if user is None:
        raise credentials_exception

    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

**Role Verification:**
```python
# app/core/deps.py
def require_role(allowed_roles: list[str]):
    async def role_checker(
        current_user: User = Depends(get_current_active_user)
    ) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

# Usage in routers
@router.post("/sales/{id}/approve")
async def approve_sale(
    id: UUID,
    current_user: User = Depends(require_role(["admin", "manager"])),
    db: AsyncSession = Depends(get_db)
):
    # Only admin and manager can approve
    pass
```

### Data Filtering by Role

**Manager sees team data:**
```python
# app/crud/sale.py
async def get_sales_for_user(
    db: AsyncSession,
    user: User,
    skip: int = 0,
    limit: int = 100
) -> list[Sale]:
    query = select(Sale)

    if user.role == "employee":
        # Employee sees only own sales
        query = query.where(Sale.employee_id == user.id)
    elif user.role == "manager":
        # Manager sees team + own sales
        team_member_ids = await get_team_member_ids(db, user.id)
        query = query.where(Sale.employee_id.in_(team_member_ids + [user.id]))
    # Admin sees all (no filter)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
```

### IAP Integration Plan

**Future: Replace JWT with IAP tokens**

```python
# app/middleware/iap.py
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

async def verify_iap_token(request: Request) -> User:
    iap_jwt = request.headers.get('X-Goog-IAP-JWT-Assertion')

    if not iap_jwt:
        raise HTTPException(401, "No IAP token provided")

    try:
        # Verify token
        decoded_token = id_token.verify_oauth2_token(
            iap_jwt,
            google_requests.Request(),
            audience=settings.IAP_CLIENT_ID
        )

        # Get user from database by iap_sub
        user = await crud_user.get_by_iap_sub(db, decoded_token['sub'])

        if not user or not user.is_active:
            raise HTTPException(403, "User not authorized")

        return user

    except ValueError:
        raise HTTPException(401, "Invalid IAP token")
```

---

## Pydantic Schemas

### Schema Organization

```
apps/api/app/schemas/
├── __init__.py
├── auth.py              # Login, token, user response
├── user.py              # UserCreate, UserUpdate, UserInDB
├── client.py            # ClientCreate, ClientUpdate, ClientInDB
├── product.py           # ProductCreate, ProductUpdate, ProductInDB
├── sale.py              # SaleCreate, SaleUpdate, SaleInDB
├── credit.py            # CreditTransactionCreate, Update, InDB
├── inventory.py         # InventoryUpdate, InventoryInDB
├── commission.py        # CommissionCreate, CommissionInDB
├── report.py            # Various report response models
└── common.py            # Pagination, filters, base schemas
```

### Example: Sale Schemas

**File:** `app/schemas/sale.py`
```python
from pydantic import BaseModel, Field, validator
from datetime import date
from decimal import Decimal
from uuid import UUID
from typing import Optional

# Base schema with shared fields
class SaleBase(BaseModel):
    product_id: UUID
    client_id: UUID
    quantity: int = Field(gt=0, description="Must be positive")
    unit_price: Decimal = Field(gt=0, decimal_places=2)
    sale_date: date = Field(default_factory=date.today)
    payment_type: str = Field(pattern='^(cash|credit|check|mixed-).*$')
    cash_amount: Decimal = Field(ge=0, decimal_places=2, default=0)
    credit_amount: Decimal = Field(ge=0, decimal_places=2, default=0)
    check_amount: Decimal = Field(ge=0, decimal_places=2, default=0)
    inventory_action: str = Field(default='sale')

    @validator('sale_date')
    def validate_sale_date(cls, v):
        if v > date.today():
            raise ValueError("Sale date cannot be in the future")
        return v

    @validator('payment_type')
    def validate_payment_type(cls, v):
        valid_types = ['cash', 'credit', 'check', 'prepayment', 'mixed-cash-credit',
                      'mixed-cash-check', 'mixed-credit-check', 'mixed-all']
        if v not in valid_types:
            raise ValueError(f"Invalid payment type. Must be one of: {valid_types}")
        return v

# Request schema for creating sale
class SaleCreate(SaleBase):
    invoice_number: Optional[str] = None
    total_amount: Decimal = Field(gt=0, decimal_places=2)
    requires_approval: bool = False

    @validator('total_amount')
    def validate_total(cls, v, values):
        # Ensure total matches sum of payments
        if 'cash_amount' in values and 'credit_amount' in values and 'check_amount' in values:
            sum_payments = (
                values['cash_amount'] +
                values['credit_amount'] +
                values['check_amount']
            )
            if abs(v - sum_payments) > Decimal('0.01'):
                raise ValueError('Total amount must equal sum of payment amounts')
        return v

# Request schema for updating sale
class SaleUpdate(BaseModel):
    quantity: Optional[int] = Field(None, gt=0)
    unit_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    total_amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    invoice_number: Optional[str] = None
    approval_notes: Optional[str] = None

# Response schema (from database)
class SaleInDB(SaleBase):
    id: UUID
    employee_id: UUID
    invoice_number: Optional[str]
    total_amount: Decimal
    requires_approval: bool
    approved_by: Optional[UUID]
    approval_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2

# Response with joined data
class SaleResponse(SaleInDB):
    product_code: str
    product_description: str
    client_name: str
    employee_name: str

# Approval request
class SaleApproval(BaseModel):
    approval_notes: Optional[str] = None
```

### Example: Client Schemas

**File:** `app/schemas/client.py`
```python
from pydantic import BaseModel, Field, EmailStr, validator
from uuid import UUID
from typing import Optional
from decimal import Decimal

class ClientBase(BaseModel):
    client_number: str = Field(min_length=1, max_length=50)
    client_name: str = Field(min_length=1, max_length=255)
    client_grade: str = Field(pattern='^(A|B|C|enduser)$')
    client_category: Optional[str] = None
    client_type: str = Field(default='pending', pattern='^(own|transfer|pending)$')

    contact_name: Optional[str] = None
    contact_position: Optional[str] = None
    contact_phone: Optional[str] = None

    contact_name_2: Optional[str] = None
    contact_position_2: Optional[str] = None
    contact_phone_2: Optional[str] = None

    address: Optional[str] = None
    company_info: Optional[str] = None

class ClientCreate(ClientBase):
    account_owner_id: UUID  # Required on creation

class ClientUpdate(BaseModel):
    client_name: Optional[str] = None
    client_grade: Optional[str] = Field(None, pattern='^(A|B|C|enduser)$')
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    is_blocked: Optional[bool] = None

class ClientInDB(ClientBase):
    id: UUID
    account_owner_id: UUID
    is_blocked: bool
    average_monthly_sales: Optional[Decimal]
    previous_year_total: Optional[Decimal]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ClientResponse(ClientInDB):
    account_owner_name: str  # Joined from users table

class ClientApproval(BaseModel):
    client_type: str = Field(pattern='^(own|transfer)$')
    approval_notes: Optional[str] = None
```

### Common Schemas

**File:** `app/schemas/common.py`
```python
from pydantic import BaseModel, Field
from typing import Generic, TypeVar, List
from datetime import date, datetime

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    pages: int

class DateRangeFilter(BaseModel):
    start_date: date
    end_date: date

    @validator('end_date')
    def validate_date_range(cls, v, values):
        if 'start_date' in values and v < values['start_date']:
            raise ValueError("end_date must be after start_date")
        return v

class SalesFilter(DateRangeFilter):
    employee_id: Optional[UUID] = None
    client_id: Optional[UUID] = None
    product_id: Optional[UUID] = None
    payment_type: Optional[str] = None

class Message(BaseModel):
    detail: str
```

---

## CRUD Operations

### Base CRUD Class

**File:** `app/crud/base.py`
```python
from typing import Generic, TypeVar, Type, Optional, List
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class CRUDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: UUID) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[ModelType]:
        result = await db.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def create(
        self,
        db: AsyncSession,
        *,
        obj_in: CreateSchemaType
    ) -> ModelType:
        obj_data = obj_in.dict()
        db_obj = self.model(**obj_data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: UpdateSchemaType | dict
    ) -> ModelType:
        obj_data = obj_in if isinstance(obj_in, dict) else obj_in.dict(exclude_unset=True)

        for field, value in obj_data.items():
            setattr(db_obj, field, value)

        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: UUID) -> ModelType:
        obj = await self.get(db, id=id)
        await db.delete(obj)
        await db.commit()
        return obj
```

### Example: Sale CRUD

**File:** `app/crud/sale.py`
```python
from app.crud.base import CRUDBase
from app.models.sale import Sale
from app.schemas.sale import SaleCreate, SaleUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import date
from uuid import UUID

class CRUDSale(CRUDBase[Sale, SaleCreate, SaleUpdate]):
    async def get_by_employee(
        self,
        db: AsyncSession,
        *,
        employee_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> list[Sale]:
        result = await db.execute(
            select(Sale)
            .where(Sale.employee_id == employee_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_date_range(
        self,
        db: AsyncSession,
        *,
        start_date: date,
        end_date: date,
        employee_id: Optional[UUID] = None
    ) -> list[Sale]:
        query = select(Sale).where(
            and_(
                Sale.sale_date >= start_date,
                Sale.sale_date <= end_date
            )
        )

        if employee_id:
            query = query.where(Sale.employee_id == employee_id)

        result = await db.execute(query)
        return result.scalars().all()

    async def get_sales_report(
        self,
        db: AsyncSession,
        *,
        start_date: date,
        end_date: date
    ) -> list[dict]:
        """Aggregate sales by employee for report"""
        result = await db.execute(
            select(
                Sale.employee_id,
                func.count(Sale.id).label('total_sales'),
                func.sum(Sale.total_amount).label('total_revenue')
            )
            .where(
                and_(
                    Sale.sale_date >= start_date,
                    Sale.sale_date <= end_date
                )
            )
            .group_by(Sale.employee_id)
        )
        return [
            {
                "employee_id": str(row.employee_id),
                "total_sales": row.total_sales,
                "total_revenue": float(row.total_revenue)
            }
            for row in result.all()
        ]

    async def create_with_inventory_update(
        self,
        db: AsyncSession,
        *,
        obj_in: SaleCreate,
        employee_id: UUID
    ) -> Sale:
        """Create sale and update inventory atomically"""
        async with db.begin():
            # Create sale
            sale_data = obj_in.dict()
            sale_data['employee_id'] = employee_id
            db_sale = Sale(**sale_data)
            db.add(db_sale)

            # Update inventory
            from app.crud.inventory import crud_inventory
            await crud_inventory.decrease_stock(
                db,
                product_id=obj_in.product_id,
                quantity=obj_in.quantity
            )

            await db.commit()
            await db.refresh(db_sale)
            return db_sale

# Singleton instance
crud_sale = CRUDSale(Sale)
```

### Example: Client CRUD

**File:** `app/crud/client.py`
```python
from app.crud.base import CRUDBase
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from uuid import UUID

class CRUDClient(CRUDBase[Client, ClientCreate, ClientUpdate]):
    async def get_by_client_number(
        self,
        db: AsyncSession,
        *,
        client_number: str
    ) -> Optional[Client]:
        result = await db.execute(
            select(Client).where(Client.client_number == client_number)
        )
        return result.scalar_one_or_none()

    async def get_by_owner(
        self,
        db: AsyncSession,
        *,
        owner_id: UUID,
        include_team: bool = False,
        team_member_ids: list[UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> list[Client]:
        """Get clients by account owner, optionally including team members"""
        query = select(Client)

        if include_team and team_member_ids:
            # Manager can see team's customers
            query = query.where(
                Client.account_owner_id.in_(team_member_ids + [owner_id])
            )
        else:
            # Employee sees only own customers
            query = query.where(Client.account_owner_id == owner_id)

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def search(
        self,
        db: AsyncSession,
        *,
        query_string: str,
        skip: int = 0,
        limit: int = 100
    ) -> list[Client]:
        """Search clients by name or number"""
        result = await db.execute(
            select(Client)
            .where(
                or_(
                    Client.client_name.ilike(f"%{query_string}%"),
                    Client.client_number.ilike(f"%{query_string}%")
                )
            )
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def approve_client_type(
        self,
        db: AsyncSession,
        *,
        client_id: UUID,
        client_type: str,
        approved_by: UUID
    ) -> Client:
        """Approve pending client as 'own' or 'transfer'"""
        client = await self.get(db, id=client_id)

        client.client_type = client_type
        client.approved_at = datetime.utcnow()
        client.approved_by = approved_by

        db.add(client)
        await db.commit()
        await db.refresh(client)
        return client

crud_client = CRUDClient(Client)
```

---

## Router Implementation

### File Structure

```
apps/api/app/routers/
├── __init__.py
├── auth.py              # Authentication endpoints
├── sales.py             # Sales management
├── customers.py         # Customer management
├── products.py          # Product catalog
├── employees.py         # Employee management
├── inventory.py         # Stock management
├── credit.py            # Credit tracking
├── commissions.py       # Commission calculation
├── reports.py           # Financial reports
├── dashboard.py         # Dashboard aggregations
├── imports.py           # CSV upload handling
├── ai.py                # AI-powered analytics
└── health.py            # Health checks (existing)
```

### Example: Sales Router

**File:** `app/routers/sales.py`
```python
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from datetime import date
from typing import Optional

from app.db.session import get_db
from app.core.deps import get_current_active_user, require_role
from app.models.user import User
from app.schemas.sale import (
    SaleCreate, SaleUpdate, SaleResponse, SaleApproval, SalesFilter
)
from app.schemas.common import PaginatedResponse, Message
from app.crud.sale import crud_sale

router = APIRouter(prefix="/api/sales", tags=["sales"])

@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def create_sale(
    sale_in: SaleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create new sale and update inventory"""
    # Check if special discount requires approval
    if sale_in.requires_approval and current_user.role == 'employee':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Special discount requires manager approval"
        )

    sale = await crud_sale.create_with_inventory_update(
        db, obj_in=sale_in, employee_id=current_user.id
    )
    return sale

@router.get("", response_model=PaginatedResponse[SaleResponse])
async def list_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    employee_id: Optional[UUID] = None,
    client_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """List sales with filtering and pagination"""
    # Apply role-based filtering
    if current_user.role == 'employee':
        employee_id = current_user.id  # Force filter to own sales

    elif current_user.role == 'manager' and not employee_id:
        # Manager can see team, but default to all if no filter
        pass

    # Fetch sales
    if start_date and end_date:
        sales = await crud_sale.get_by_date_range(
            db, start_date=start_date, end_date=end_date, employee_id=employee_id
        )
    elif employee_id:
        sales = await crud_sale.get_by_employee(
            db, employee_id=employee_id, skip=skip, limit=limit
        )
    else:
        sales = await crud_sale.get_multi(db, skip=skip, limit=limit)

    total = len(sales)  # TODO: Implement count query

    return {
        "items": sales,
        "total": total,
        "page": skip // limit + 1,
        "page_size": limit,
        "pages": (total + limit - 1) // limit
    }

@router.get("/{id}", response_model=SaleResponse)
async def get_sale(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get sale detail by ID"""
    sale = await crud_sale.get(db, id=id)

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Check access permissions
    if current_user.role == 'employee' and sale.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this sale")

    return sale

@router.put("/{id}", response_model=SaleResponse)
async def update_sale(
    id: UUID,
    sale_update: SaleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update sale (own sales only for employees)"""
    sale = await crud_sale.get(db, id=id)

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Employees can only edit own sales
    if current_user.role == 'employee' and sale.employee_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this sale")

    updated_sale = await crud_sale.update(db, db_obj=sale, obj_in=sale_update)
    return updated_sale

@router.delete("/{id}", response_model=Message)
async def delete_sale(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin"]))
):
    """Delete sale (admin only)"""
    sale = await crud_sale.get(db, id=id)

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    await crud_sale.delete(db, id=id)
    return {"detail": "Sale deleted successfully"}

@router.post("/{id}/approve", response_model=SaleResponse)
async def approve_sale(
    id: UUID,
    approval: SaleApproval,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager"]))
):
    """Approve special discount (manager/admin only)"""
    sale = await crud_sale.get(db, id=id)

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    if not sale.requires_approval:
        raise HTTPException(status_code=400, detail="Sale does not require approval")

    # Update approval status
    sale.approved_by = current_user.id
    sale.approval_date = datetime.utcnow()
    sale.approval_notes = approval.approval_notes
    sale.requires_approval = False

    db.add(sale)
    await db.commit()
    await db.refresh(sale)

    return sale

@router.get("/report", response_model=list[dict])
async def sales_report(
    start_date: date = Query(..., description="Report start date"),
    end_date: date = Query(..., description="Report end date"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Sales report aggregated by employee"""
    report = await crud_sale.get_sales_report(
        db, start_date=start_date, end_date=end_date
    )

    # Filter based on role
    if current_user.role == 'employee':
        report = [r for r in report if r['employee_id'] == str(current_user.id)]

    return report
```

### Example: Dashboard Router

**File:** `app/routers/dashboard.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, timedelta

from app.db.session import get_db
from app.core.deps import get_current_active_user
from app.models.user import User
from app.models.sale import Sale
from app.models.credit import CreditTransaction
from app.models.inventory import Inventory

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/overview")
async def dashboard_overview(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Admin dashboard overview metrics"""
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")

    today = date.today()
    month_start = today.replace(day=1)

    # Total revenue (this month)
    result = await db.execute(
        select(func.sum(Sale.total_amount))
        .where(Sale.sale_date >= month_start)
    )
    monthly_revenue = result.scalar() or 0

    # Total sales count (this month)
    result = await db.execute(
        select(func.count(Sale.id))
        .where(Sale.sale_date >= month_start)
    )
    monthly_sales_count = result.scalar() or 0

    # Overdue payments
    result = await db.execute(
        select(func.count(CreditTransaction.id))
        .where(CreditTransaction.payment_status == 'overdue')
    )
    overdue_count = result.scalar() or 0

    # Low stock items
    result = await db.execute(
        select(func.count(Inventory.id))
        .where(Inventory.stock_quantity <= Inventory.reorder_level)
    )
    low_stock_count = result.scalar() or 0

    return {
        "monthly_revenue": float(monthly_revenue),
        "monthly_sales_count": monthly_sales_count,
        "overdue_payments": overdue_count,
        "low_stock_items": low_stock_count
    }

@router.get("/sales-chart")
async def sales_chart_data(
    days: int = Query(30, ge=7, le=365),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Daily sales trend data for chart"""
    start_date = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            Sale.sale_date,
            func.sum(Sale.total_amount).label('daily_total')
        )
        .where(Sale.sale_date >= start_date)
        .group_by(Sale.sale_date)
        .order_by(Sale.sale_date)
    )

    return [
        {
            "date": str(row.sale_date),
            "total": float(row.daily_total)
        }
        for row in result.all()
    ]
```

---

## Database Session Management

**File:** `app/db/session.py`
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    pool_pre_ping=True,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW
)

# Create session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency for routes
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

**File:** `app/core/config.py`
```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 0

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # IAP (future)
    IAP_CLIENT_ID: Optional[str] = None

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Error Handling & Validation

### Global Exception Handler

**File:** `app/main.py`
```python
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

app = FastAPI(title="SalesVision API")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body}
    )

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "Database integrity constraint violation"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )
```

### Custom HTTP Exceptions

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class DuplicateException(HTTPException):
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
```

---

## Business Logic Examples

### Commission Calculation

**File:** `app/services/commission.py`
```python
from decimal import Decimal
from app.models.sale import Sale
from app.models.product import Product
from app.models.client import Client

async def calculate_commission(db: AsyncSession, employee_id: UUID, month: date) -> Decimal:
    """Calculate employee commission for given month"""

    # Get all sales for employee in month
    month_start = month.replace(day=1)
    next_month = (month_start + timedelta(days=32)).replace(day=1)

    result = await db.execute(
        select(Sale)
        .join(Product, Sale.product_id == Product.id)
        .join(Client, Sale.client_id == Client.id)
        .where(
            Sale.employee_id == employee_id,
            Sale.sale_date >= month_start,
            Sale.sale_date < next_month
        )
    )

    sales = result.scalars().all()
    total_commission = Decimal(0)

    for sale in sales:
        product = sale.product
        client = sale.client

        if product.classification == 'import':
            # Import products: 5% until 2M CFA, then 3%
            if total_commission < Decimal('2000000'):
                rate = Decimal('0.05')
            else:
                rate = Decimal('0.03')

            if client.client_type == 'transfer':
                # Transfer clients: 1% for imports
                rate = Decimal('0.01')

            commission = sale.total_amount * rate

        else:  # local products
            # Calculate margin
            margin = (sale.unit_price - product.unit_cost) / sale.unit_price

            if client.client_type == 'transfer':
                # Transfer clients: 50% of margin commission
                commission = sale.total_amount * margin * Decimal('0.5')
            else:
                # Own clients: full margin commission
                commission = sale.total_amount * margin

        total_commission += commission

    return total_commission
```

### Inventory Update on Sale

**File:** `app/services/inventory.py`
```python
from app.models.inventory import Inventory
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

async def check_and_update_stock(
    db: AsyncSession,
    product_id: UUID,
    quantity: int
) -> tuple[bool, str]:
    """Check stock availability and update if available"""

    inventory = await db.execute(
        select(Inventory).where(Inventory.product_id == product_id)
    )
    inventory = inventory.scalar_one_or_none()

    if not inventory:
        return False, "Product not in inventory"

    if inventory.stock_quantity < quantity:
        return False, f"Insufficient stock. Available: {inventory.stock_quantity}"

    # Update stock
    inventory.stock_quantity -= quantity

    # Check if reorder needed
    if inventory.stock_quantity <= inventory.reorder_level:
        # TODO: Trigger reorder notification
        pass

    db.add(inventory)
    return True, "Stock updated"
```

---

## Testing Strategy

### Unit Tests

```python
# tests/test_crud_sale.py
import pytest
from app.crud.sale import crud_sale
from app.schemas.sale import SaleCreate

@pytest.mark.asyncio
async def test_create_sale(db_session, test_user, test_product, test_client):
    sale_in = SaleCreate(
        product_id=test_product.id,
        client_id=test_client.id,
        quantity=10,
        unit_price=Decimal('100.00'),
        total_amount=Decimal('1000.00'),
        payment_type='cash',
        cash_amount=Decimal('1000.00')
    )

    sale = await crud_sale.create(db_session, obj_in=sale_in, employee_id=test_user.id)

    assert sale.id is not None
    assert sale.quantity == 10
    assert sale.total_amount == Decimal('1000.00')
```

### Integration Tests

```python
# tests/test_api_sales.py
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_sale_endpoint(async_client: AsyncClient, auth_headers):
    response = await async_client.post(
        "/api/sales",
        headers=auth_headers,
        json={
            "product_id": str(test_product_id),
            "client_id": str(test_client_id),
            "quantity": 5,
            "unit_price": "50.00",
            "total_amount": "250.00",
            "payment_type": "cash",
            "cash_amount": "250.00"
        }
    )

    assert response.status_code == 201
    data = response.json()
    assert data["quantity"] == 5
```

---

## Deployment

### Docker Configuration

**Dockerfile:** (already exists at `apps/api/Dockerfile`)
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

**File:** `.env.example`
```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/database

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# Environment
ENVIRONMENT=production

# IAP (when migrating)
IAP_CLIENT_ID=your-iap-client-id.apps.googleusercontent.com
```

### Cloud Run Deployment

```bash
# Build for AMD64 (required for Cloud Run)
docker buildx build --platform linux/amd64 -t api-local apps/api --load

# Tag and push
PROJECT_ID=youngintlsaleswebapp
REGION=us-central1
REPO=salesvision-api
IMAGE=backend
TAG="$(git rev-parse --short HEAD)-amd64"

gcloud auth configure-docker $REGION-docker.pkg.dev

docker tag api-local $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG
docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG

# Deploy
gcloud run deploy salesvision-backend \
    --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/$IMAGE:$TAG \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --vpc-connector salesvision-connector \
    --set-env-vars DATABASE_URL="postgresql+asyncpg://...",SECRET_KEY="..." \
    --min-instances 0 \
    --max-instances 10
```

---

## File Structure Summary

### Current State
```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app (minimal)
│   └── routers/
│       ├── __init__.py
│       └── health.py        # Health checks only
├── requirements.txt
└── Dockerfile
```

### Target State
```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app with all routers
│   ├── core/                # NEW
│   │   ├── config.py        # Settings
│   │   ├── security.py      # JWT, hashing
│   │   ├── deps.py          # Dependencies (get_db, get_current_user)
│   │   └── exceptions.py    # Custom exceptions
│   ├── db/                  # NEW
│   │   ├── base.py          # Base model
│   │   └── session.py       # Database connection
│   ├── models/              # NEW (15 models)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── client.py
│   │   ├── product.py
│   │   ├── sale.py
│   │   └── ... (11 more)
│   ├── schemas/             # NEW (Pydantic models)
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── client.py
│   │   └── ... (10 more)
│   ├── crud/                # NEW (CRUD operations)
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── sale.py
│   │   └── ... (10 more)
│   ├── routers/             # EXPAND (11 routers)
│   │   ├── __init__.py
│   │   ├── auth.py          # NEW
│   │   ├── sales.py         # NEW
│   │   ├── customers.py     # NEW
│   │   └── ... (8 more)
│   ├── services/            # NEW (Business logic)
│   │   ├── commission.py
│   │   └── inventory.py
│   └── middleware/          # NEW
│       └── iap.py           # IAP integration
├── alembic/                 # NEW (Alembic migrations)
│   ├── versions/
│   └── env.py
├── tests/                   # NEW
│   ├── conftest.py
│   ├── test_crud_sale.py
│   └── test_api_sales.py
├── .env.example             # NEW
├── alembic.ini              # NEW
├── requirements.txt
└── Dockerfile
```

---

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Create directory structure
- [ ] Configure settings (`core/config.py`)
- [ ] Set up database connection (`db/session.py`)
- [ ] Configure authentication (`core/security.py`, `core/deps.py`)

### Phase 2: Models & Schemas
- [ ] Create all 15 SQLAlchemy models
- [ ] Create Pydantic schemas for all domains
- [ ] Test model relationships in Python REPL

### Phase 3: CRUD Operations
- [ ] Implement base CRUD class
- [ ] Create CRUD classes for each model
- [ ] Add filtering and pagination utilities

### Phase 4: Routers & Endpoints
- [ ] Implement auth router (login, register, /me)
- [ ] Implement sales router (8 endpoints)
- [ ] Implement customers router (7 endpoints)
- [ ] Implement products router (6 endpoints)
- [ ] Implement remaining 8 routers
- [ ] Test each endpoint with httpx or Postman

### Phase 5: Business Logic
- [ ] Implement commission calculation
- [ ] Implement inventory update on sale
- [ ] Implement credit status tracking
- [ ] Add audit logging decorator

### Phase 6: Testing
- [ ] Write unit tests for CRUD operations
- [ ] Write integration tests for API endpoints
- [ ] Test role-based access control
- [ ] Load testing with locust/k6

### Phase 7: Deployment
- [ ] Build Docker image for AMD64
- [ ] Push to Artifact Registry
- [ ] Deploy to Cloud Run
- [ ] Configure environment variables
- [ ] Enable IAP (after frontend IAP migration)
- [ ] Set up monitoring and alerts

---

## Conclusion

Backend API complete plan: 68 endpoints across 11 routers, JWT auth with role-based access control, Pydantic validation, SQLAlchemy async ORM, CRUD operations, business logic for commissions/inventory, Cloud Run deployment. Ready to transform minimal FastAPI scaffold into full production API.
