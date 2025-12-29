# Frontend Logic Documentation

## Overview

SalesVision frontend uses client-side role-based authentication with static JSON data. No backend API integration exists - all data served from transformed CSV files. Three-tier user hierarchy with page-level access control.

---

## Authentication System

### Core Implementation

**File:** `apps/web/src/hooks/use-auth.ts`

**Storage:** localStorage key `'salesvision_auth'`

**User Data Structure:**
```typescript
type AuthState = {
  role: 'admin' | 'employee' | 'manager';
  name: string;
  userId: string;
} | null;
```

### Login Flow

1. **Login Page:** `apps/web/src/app/login/page.tsx`
   - User selects role: 'director', 'staff', or 'manager'
   - Email/password fields are decorative (not validated)
   - Role selection IS the authentication

2. **Role Mapping:**
   - `'director'` → `admin` role (John Doe, userId: john-doe)
   - `'staff'` → `employee` role (Jane Smith, userId: jane-smith)
   - `'manager'` → `manager` role (Alex Ray, userId: alex-ray)

3. **Storage:**
   ```typescript
   localStorage.setItem('salesvision_auth', JSON.stringify({
     role: 'admin',
     name: 'John Doe',
     userId: 'john-doe'
   }));
   ```

4. **Redirect:**
   - Admin → `/dashboard`
   - Employee/Manager → `/admin`

### Logout Flow

**File:** `apps/web/src/components/user-nav.tsx`
- Removes from localStorage
- Sets auth state to `null`
- Redirects to `/login`

### Auth States

- `undefined` - Auth not yet loaded (initial mount)
- `null` - User not logged in
- `AuthState` object - User authenticated

---

## User Hierarchy & Roles

### Three-Tier System

#### 1. Admin (Director/CEO)
**Internal role:** `'admin'`
**Login label:** "Director"
**Example user:** John Doe (john-doe)
**Access level:** Full system access, all employee data, all customer data

**Exclusive permissions:**
- Edit product import prices
- Register product imports (`/imports/new`)
- View all analytics
- Edit product categories
- Full dashboard with company-wide metrics

#### 2. Manager
**Internal role:** `'manager'`
**Login label:** "Manager"
**Example user:** Alex Ray (alex-ray)
**Access level:** Team data + own data

**Exclusive permissions:**
- View employee detail pages (`/employees/[name]`)
- Register new employees (`/employees/new`)
- Register local purchases (`/purchases/new`)
- Edit local purchase prices
- View team member sales data

**Data visibility:**
- Own sales/customers
- Team member sales/customers (employees they manage)
- All employee commission data (view only)

#### 3. Employee (Staff)
**Internal role:** `'employee'`
**Login label:** "Staff"
**Example user:** Jane Smith (jane-smith)
**Access level:** Own data only

**Permissions:**
- Add sales/customers
- View own sales report
- View own customers (cannot toggle)
- Delegate authority to others (`/account/delegate`)

**Restrictions:**
- Cannot view other employees' data
- Cannot access inventory/commissions
- Cannot register purchases/imports
- Cannot view products page

---

## Navigation Access Control

### Implementation

**File:** `apps/web/src/components/app-sidebar.tsx`

Navigation items conditionally rendered based on role:

### All Roles
- Dashboard (role-specific view)
- Sales
  - Add Sale (`/sales/new`)
  - Sales Report (`/sales/report`)
  - Cumulative Report (`/sales/cumulative-report`)
  - Sales Targets (`/sales/target`)
- Customers
  - Customer List (`/customers`)
  - Add Customer (`/customers/new`)
- Reports
  - Credit Report (`/credit`)
  - Cash Report (`/reports/cash`)
  - Check Report (`/reports/checks`)

### Admin + Manager Only
- Purchases (different items per role)
  - Manager: "Register Local Purchase" (`/purchases/new`)
  - Admin: "Register Product Import" (`/imports/new`)
- Inventory (`/inventory`)
- Commissions (`/commissions`)

### Admin Only
- Products (`/products`)
- Analytics (placeholder)

### Employee + Manager Only
- Account (`/account/delegate`)

---

## Page-Level Access Control

### Protection Pattern

Each protected page implements auth check in `useEffect`:

```typescript
const { auth, role } = useAuth();
const router = useRouter();

useEffect(() => {
  if (auth === undefined) return; // Still loading
  if (!auth || auth.role !== 'admin') {
    router.push('/login');
  }
}, [auth, router]);
```

### Complete Route Access Matrix

| Route | Admin | Manager | Employee | Protection Method |
|-------|-------|---------|----------|-------------------|
| `/login` | ✅ | ✅ | ✅ | Public |
| `/dashboard` | ✅ | ❌ | ❌ | useEffect redirect |
| `/admin` | ❌ | ✅ | ✅ | useEffect redirect |
| `/sales/new` | ✅ | ✅ | ✅ | Auth required |
| `/sales/report` | ✅ | ✅ | ✅ | Data filtered by role |
| `/sales/target` | ✅ | ✅ | ✅ | Auth required |
| `/sales/cumulative-report` | ✅ | ✅ | ✅ | Auth required |
| `/customers` | ✅ | ✅ | ✅ | Data filtered by role |
| `/customers/new` | ✅ | ✅ | ✅ | Auth required |
| `/products` | ✅ | ✅ | ❌ | Admin: edit import price |
| `/inventory` | ✅ | ✅ | ❌ | useEffect redirect |
| `/purchases/new` | ❌ | ✅ | ❌ | Manager only |
| `/imports/new` | ✅ | ❌ | ❌ | Admin only |
| `/commissions` | ✅ | ✅ | ❌ | useEffect redirect |
| `/credit` | ✅ | ✅ | ✅ | Data filtered by role |
| `/reports/cash` | ✅ | ✅ | ✅ | Data filtered by role |
| `/reports/checks` | ✅ | ✅ | ✅ | Auth required |
| `/employees/[name]` | ❌ | ✅ | ❌ | Manager only |
| `/employees/new` | ❌ | ✅ | ❌ | Manager only |
| `/account/delegate` | ❌ | ✅ | ✅ | Employee + Manager |

**Total protected pages:** 22
**Role check occurrences:** 86 across codebase

---

## Data Flow Architecture

### Source to Frontend Pipeline

```
CSV Source (db/csv/)
        ↓
csv-to-json.mjs (build script)
        ↓
JSON Output (db/ui/)
        ↓
mock-data.ts (static imports)
        ↓
Components (filter by role)
```

### CSV Data Sources

**Location:** `db/csv/`

**Domains (10 folders):**
1. `dashboard/` - Overview metrics, targets, charts
2. `sales/` - Sales transactions, reports
3. `customers/` - Customer data, grades
4. `employees/` - Employee roster, hierarchy
5. `commissions/` - Commission calculations
6. `inventory/` - Product stock levels
7. `credit/` - Due payments, overdue
8. `reports/` - Cash and check reports
9. `imports/` - Product import data
10. `ai/` - AI prompt templates

### JSON Transformation

**Script:** `apps/web/scripts/csv-to-json.mjs`

**Triggered by:**
- `predev` hook (before `npm run dev:web`)
- `prebuild` hook (before `npm run build:web`)
- Manual: `npm run build:data`

**Output:** `db/ui/` (mirrors csv structure)

### Data Import Hub

**File:** `apps/web/src/lib/mock-data.ts`

All data imported as TypeScript modules:

```typescript
import salesReportData from '@/../../db/ui/sales/sales-report.json';
import employees from '@/../../db/ui/employees/employees.json';
import customerData from '@/../../db/ui/customers/customer-data.json';
// ... 30+ more imports
```

**No API calls exist.** All data is static JSON.

---

## Data Filtering by Role

### Pattern 1: Employee Sees Own Data Only

**Example:** `apps/web/src/app/sales/report/page.tsx`

```typescript
const filteredData = useMemo(() => {
  if (role === 'employee') {
    // Hardcoded to Jane Smith for demo
    return salesReportData.filter(d => d.employeeName === 'Jane Smith');
  }
  // Managers and Admins see all data
  return salesReportData;
}, [role]);
```

### Pattern 2: Manager Sees Team + Own Data

**Example:** `apps/web/src/app/customers/page.tsx`

```typescript
const filteredCustomerData = useMemo(() => {
  if (showMyCustomers && loggedInEmployee) {
    if (role === 'manager') {
      // Manager sees own + team member customers
      const teamMemberIds = employees.filter(
        e => e.manager === loggedInEmployee.value
      ).map(e => e.value);

      const managedIds = [loggedInEmployee.value, ...teamMemberIds];

      return customerData.filter(
        customer => managedIds.includes(customer.employeeId)
      );
    }

    // Employee sees only own customers
    return customerData.filter(
      customer => customer.employeeId === loggedInEmployee.value
    );
  }

  return customerData; // Admin or "all customers" toggle
}, [customerData, showMyCustomers, loggedInEmployee, role]);
```

**Key features:**
- "Show my customers only" toggle
- Disabled for employees (always filtered)
- Manager filter includes team hierarchy
- Uses `auth.userId` to match `employeeId` in data

### Pattern 3: Admin Sees Everything

**Example:** `apps/web/src/app/dashboard/page.tsx`

No filtering applied - all data rendered:
- Company-wide sales metrics
- All employee performance
- Full customer list
- All inventory data

### Employee Lookup Logic

**Two patterns observed (inconsistent):**

**Pattern A - By name:**
```typescript
const loggedInEmployee = employees.find(e => e.name === auth.name);
```

**Pattern B - By userId:**
```typescript
const loggedInEmployee = employees.find(e => e.value === auth.userId);
```

**Recommendation:** Standardize on `userId` for consistency.

---

## Data Visibility Matrix

| Data Type | Admin | Manager | Employee |
|-----------|-------|---------|----------|
| Sales Report | All employees | All employees | Own only |
| Customer List | All | Team + own | Own only |
| Customer Details | All | Team + own | Own only |
| Cash Report | All | All | Own only |
| Credit Report | All | Team + own | Own only |
| Check Report | All | All | All |
| Commissions | All | All (view only) | No access |
| Inventory | Full access | View only | No access |
| Products | Edit import price | View only | No access |
| Employee Details | All | Team only | No access |
| Sales Targets | Set company-wide | View all | View own |

---

## Dashboard Views by Role

### Admin Dashboard (`/dashboard`)

**File:** `apps/web/src/app/dashboard/page.tsx`

**Displays:**
- Revenue overview cards (total, monthly, weekly)
- Sales trend chart (all employees)
- Product category breakdown
- Employee performance leaderboard
- Recent sales activity (all)
- Sales target progress (company-wide)

### Employee/Manager Dashboard (`/admin`)

**File:** `apps/web/src/app/admin/page.tsx`

**Displays:**
- Personal/team sales overview
- Today's tasks
- Quick actions (Add Sale, View Customers)
- Recent activity (filtered)
- Pending items

---

## Key Data Files

### Employee Data

**File:** `db/ui/employees/employees.json`

```json
[
  {
    "value": "john-doe",
    "name": "John Doe",
    "role": "Director",
    "manager": "owner"
  },
  {
    "value": "alex-ray",
    "name": "Alex Ray",
    "role": "Manager",
    "manager": "owner"
  },
  {
    "value": "jane-smith",
    "name": "Jane Smith",
    "role": "Employee",
    "manager": "mgr-001"
  }
]
```

**Structure:**
- `value` - Unique employee ID (matches `auth.userId`)
- `name` - Display name (matches `auth.name`)
- `role` - Display role (different from auth role)
- `manager` - Manager's employee ID (for hierarchy)

### Customer Data

**File:** `db/ui/customers/customer-data.json`

**Key fields:**
- `employeeId` - Owner employee (used for filtering)
- `clientNumber` - Unique customer ID
- `clientName` - Customer name
- `clientGrade` - A/B/C tier
- `staff` - Employee name managing customer
- `averageAmount` - Monthly sales average
- `yearlyAmount` - Annual sales

### Sales Report Data

**File:** `db/ui/sales/sales-report.json`

**Key fields:**
- `employeeName` - Employee who made sale
- `productCode` - Product sold
- `clientName` - Customer
- `amount` - Sale value
- `date` - Transaction date
- `paymentType` - Cash/Credit/Cheque

---

## Security Analysis

### Current Limitations

**Authentication:**
- ❌ Client-side only (no server validation)
- ❌ localStorage easily manipulated via dev tools
- ❌ No encryption of auth data
- ❌ No token expiration (session never expires)
- ❌ Role selection = authentication (no password check)
- ❌ No middleware protection (per-page useEffect)

**Data Security:**
- ❌ All JSON data publicly accessible
- ❌ Filtering done client-side (can be bypassed)
- ❌ No API gateway or authentication layer
- ❌ No rate limiting or access logging

**Session Management:**
- ❌ No session timeout
- ❌ No concurrent session handling
- ❌ No "remember me" vs session-only options
- ❌ No logout on browser close

### Attack Vectors

1. **localStorage manipulation:**
   ```javascript
   // Any user can become admin via dev console:
   localStorage.setItem('salesvision_auth', JSON.stringify({
     role: 'admin',
     name: 'Hacker',
     userId: 'john-doe'
   }));
   location.reload();
   ```

2. **Direct URL access:**
   - User can type restricted URL directly
   - Only stopped by client-side redirect (bypassable)

3. **Data exposure:**
   - All JSON files served as static assets
   - No authentication required to fetch JSON
   - Can curl data directly: `curl https://site.com/db/ui/sales/sales-report.json`

---

## Google IAP Migration Strategy

### IAP Capabilities & Limitations

**What IAP Provides:**
- ✅ **Authentication** - Verifies user identity via Google account
- ✅ **User identity** - Email, name, Google subject ID
- ✅ **Access control** - Who can reach the application
- ✅ **JWT tokens** - Cryptographically signed identity assertions

**What IAP Does NOT Provide:**
- ❌ **Authorization** - What users can do inside app (roles, permissions)
- ❌ **Hierarchical access** - Manager/employee relationships
- ❌ **Role system** - Admin/manager/employee distinctions
- ❌ **Data filtering** - Who can see what data

**Key Insight:** IAP handles **authentication** (who you are), your backend handles **authorization** (what you can do).

---

### Recommended Two-Step Access Model

```
┌─────────────────────────────────────┐
│  Step 1: Google Cloud IAP           │
│  - Controls WHO can access app      │
│  - Authenticates via Google account │
│  - You add employee emails in GCP   │
└─────────────┬───────────────────────┘
              │ User passes IAP gate
              ▼
┌─────────────────────────────────────┐
│  Step 2: SalesVision Backend        │
│  - Controls WHAT users can do       │
│  - Stores roles in PostgreSQL       │
│  - Tracks hierarchy (who manages)   │
│  - Admin assigns roles via UI       │
│  - Enforces permissions in API      │
└─────────────────────────────────────┘
```

**Implementation:**

1. **IAP Access List** (GCP Console):
   - Add employee emails: john@company.com, jane@company.com
   - They can now reach app URL (but can't do anything yet)

2. **User Management** (SalesVision Admin UI):
   - Admin creates user accounts at `/admin/users/new`
   - Sets role (admin/manager/employee) and manager
   - Stored in PostgreSQL `users` table
   - Backend verifies user exists + is active

3. **Access Flow:**
   ```
   Step 1: Add user email to IAP (GCP Console) ← You do this once
           ↓
   Step 2: Admin creates user with role (SalesVision UI) ← Admin does this
           ↓
   User can login AND has proper permissions
   ```

---

### Current vs Future Architecture

#### Current (Client-Side Only)
```
User → Login Page → localStorage → Frontend (role check) → Static JSON
```

#### Target (Google IAP + Backend)
```
User → Google IAP → JWT Token → Backend API → PostgreSQL Database
                      ↓
                   Frontend (verify token) → Fetch from API
```

### Migration Steps

#### 1. Google IAP Setup

**Requirements:**
- Google Cloud Project (existing: `youngintlsaleswebapp`)
- OAuth consent screen configured
- IAP enabled on Cloud Run services

**Configuration:**
```bash
# Enable IAP on Cloud Run service
gcloud run services update salesvision-frontend \
  --ingress=internal-and-cloud-load-balancing \
  --region=us-central1

# Configure IAP
gcloud iap web enable \
  --resource-type=backend-services \
  --oauth2-client-id=CLIENT_ID \
  --oauth2-client-secret=CLIENT_SECRET
```

#### 2. User Account Management

**IAP User Claims (JWT Payload):**
```json
{
  "email": "john.doe@company.com",
  "sub": "1234567890",
  "hd": "company.com",
  "given_name": "John",
  "family_name": "Doe"
}
```

**Database Schema Required:**

**Table: `users`**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  iap_sub VARCHAR(255) UNIQUE NOT NULL,  -- Google IAP subject ID
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,  -- 'admin', 'manager', 'employee'
  employee_id VARCHAR(100),  -- Links to employee data
  manager_id UUID REFERENCES users(id),  -- Hierarchy
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_iap_sub ON users(iap_sub);
```

**Table: `sessions`**
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  iap_token_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_accessed TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### 3. Backend API Changes

**Add JWT verification middleware:**

```python
# apps/api/app/middleware/auth.py
from fastapi import Request, HTTPException
from google.auth.transport import requests
from google.oauth2 import id_token

async def verify_iap_token(request: Request):
    """Verify Google IAP JWT token"""
    iap_jwt = request.headers.get('X-Goog-IAP-JWT-Assertion')

    if not iap_jwt:
        raise HTTPException(401, "No IAP token provided")

    try:
        # Verify token signature and claims
        decoded_token = id_token.verify_oauth2_token(
            iap_jwt,
            requests.Request(),
            audience=IAP_CLIENT_ID
        )

        # Get user from database
        user = await get_user_by_iap_sub(decoded_token['sub'])

        if not user or not user.is_active:
            raise HTTPException(403, "User not authorized")

        # Attach user to request
        request.state.user = user
        return user

    except ValueError:
        raise HTTPException(401, "Invalid IAP token")
```

**Apply to all routes:**
```python
from fastapi import Depends

@app.get("/api/sales/report")
async def get_sales_report(
    user: User = Depends(verify_iap_token)
):
    # Filter data by user role and employee_id
    if user.role == 'employee':
        return await get_sales_by_employee(user.employee_id)
    elif user.role == 'manager':
        team_ids = await get_team_member_ids(user.id)
        return await get_sales_by_employees(team_ids)
    else:  # admin
        return await get_all_sales()
```

#### 4. Frontend Changes

**Replace useAuth hook:**

```typescript
// apps/web/src/hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from backend (IAP already authenticated)
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}
```

**New backend endpoint:**
```python
@app.get("/api/auth/me")
async def get_current_user(user: User = Depends(verify_iap_token)):
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "employeeId": user.employee_id
    }
```

**Remove localStorage:**
- Delete login page (`/login/page.tsx`)
- IAP handles login redirect
- No logout button (logout via IAP)

#### 5. Data Migration

**CSV to PostgreSQL:**

For each domain in `db/csv/`, create corresponding tables:

**Example: Sales table**
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_in_out VARCHAR(50),
  product_code VARCHAR(100),
  product_description TEXT,
  product_category VARCHAR(100),
  invoice VARCHAR(100),
  date DATE,
  quantity INTEGER,
  client_grade VARCHAR(10),
  client_number VARCHAR(100),
  client_name VARCHAR(255),
  staff_id UUID REFERENCES users(id),  -- Changed from name to ID
  unit_price DECIMAL(10, 2),
  amount DECIMAL(10, 2),
  payment_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Migration script:**
```python
# One-time script to migrate CSV → PostgreSQL
import pandas as pd
from database import SessionLocal

def migrate_sales_data():
    df = pd.read_csv('db/csv/sales/sales.csv')
    session = SessionLocal()

    for _, row in df.iterrows():
        # Look up staff_id from user by name
        user = session.query(User).filter_by(name=row['Staff']).first()

        sale = Sale(
            product_code=row['ProductCode'],
            date=row['Date'],
            amount=row['Amount'],
            staff_id=user.id if user else None,
            # ... map all fields
        )
        session.add(sale)

    session.commit()
```

#### 6. Role Mapping Strategy

**Selected Approach: Manual Admin Assignment**

**Rationale:** Admin manually assigns roles in SalesVision UI for maximum control and flexibility.

**Implementation:**

Admin-only page: `/admin/users`
- List all users with their roles
- Create new users via `/admin/users/new`
- Edit user roles and hierarchy
- Activate/deactivate users

**Admin UI Specification:**

```typescript
// /admin/users/new page
interface UserCreateForm {
  email: string;           // Autocomplete from IAP-approved emails
  name: string;            // Full name
  role: 'admin' | 'manager' | 'employee';
  employeeId: string;      // Links to employee master data
  managerId?: string;      // UUID of manager (if role is employee)
}
```

**Backend endpoint:**
```python
@app.post("/api/admin/users")
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(verify_iap_token)
):
    # Only admin can create users
    if current_user.role != 'admin':
        raise HTTPException(403, "Only admin can create users")

    # Verify email is in IAP access list (optional check)
    # Create user in database
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        employee_id=user_data.employee_id,
        manager_id=user_data.manager_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    return new_user
```

**Who can manage users:**
- Only users with `role='admin'` can access `/admin/users`
- Only admin can create, edit, delete, activate/deactivate users
- Managers and employees cannot manage users

#### 7. Account Creation Flow

**New user first login:**

1. User visits app → IAP authenticates
2. Backend receives IAP token with email
3. Check if user exists in database
4. If not, create pending user:
   ```python
   new_user = User(
       email=decoded_token['email'],
       iap_sub=decoded_token['sub'],
       name=f"{decoded_token['given_name']} {decoded_token['family_name']}",
       role='pending',  # Requires admin approval
       is_active=False
   )
   ```
5. Show "Account pending approval" page
6. Admin approves and assigns role via admin UI
7. User can now access system

**Admin account creation UI:**

New page: `/admin/users/new`
- Form fields:
  - Email (autocomplete from Google Workspace)
  - Name
  - Role (dropdown)
  - Employee ID (links to employee data)
  - Manager (if role is employee)
- On submit → Create user record
- User gets email notification

---

## Database Backup & Recovery Strategy

### Three-Tier Backup System

#### Tier 1: Cloud SQL Automated Backups (Primary)

**What:** Google automatically backs up entire database daily

**Configuration:**
```bash
# Enable automated backups with point-in-time recovery
gcloud sql instances patch salesvision-db \
  --backup-start-time=03:00 \
  --retained-backups-count=30 \
  --enable-point-in-time-recovery \
  --region=us-central1
```

**Features:**
- Daily automatic snapshots at 3 AM
- 30-day retention (configurable up to 365 days)
- Point-in-time recovery (restore to any second within retention period)
- Stored in Google's redundant storage
- Zero maintenance required

**Recovery:**
```bash
# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=salesvision-db \
  --target-instance=salesvision-db

# Clone to new instance for testing
gcloud sql instances clone salesvision-db salesvision-db-test
```

**Cost:** Included with Cloud SQL (no additional charge)

#### Tier 2: Weekly CSV Exports (Compliance/Audit)

**What:** Export data to human-readable CSV format weekly

**Why:**
- Regulatory compliance requirements
- Human-readable format for audits
- Data portability (can import to Excel, other systems)
- Independent of database format

**Implementation:**
```python
# Weekly cron job (Cloud Run scheduled job or Cloud Functions)
from google.cloud import storage
import pandas as pd
from datetime import date

@app.post("/admin/export/weekly")
async def weekly_export(current_user: User = Depends(verify_admin)):
    """Export all tables to CSV in Cloud Storage"""

    storage_client = storage.Client()
    bucket = storage_client.bucket('salesvision-backups')
    timestamp = date.today().isoformat()

    tables = ['sales', 'customers', 'employees', 'credit', 'commissions',
              'products', 'inventory', 'cash', 'cheques', 'expenditures']

    for table_name in tables:
        # Query all data from table
        df = await query_table_to_dataframe(table_name)

        # Upload to Cloud Storage with versioning
        filename = f"weekly/{timestamp}/{table_name}.csv"
        blob = bucket.blob(filename)
        blob.upload_from_string(df.to_csv(index=False), content_type='text/csv')

    return {"exported_tables": len(tables), "timestamp": timestamp}
```

**Cloud Storage Configuration:**
```bash
# Create backup bucket with versioning
gsutil mb -l us-central1 gs://salesvision-backups
gsutil versioning set on gs://salesvision-backups

# Set lifecycle policy (keep for 1 year)
gsutil lifecycle set backup-lifecycle.json gs://salesvision-backups
```

**Lifecycle policy (backup-lifecycle.json):**
```json
{
  "lifecycle": {
    "rule": [{
      "action": {"type": "Delete"},
      "condition": {"age": 365}
    }]
  }
}
```

#### Tier 3: Audit Log (Change Tracking)

**What:** Log every data modification in separate table

**Schema:**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255),
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(255),
  action VARCHAR(50) NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_action ON audit_log(action);
```

**Implementation:**
```python
# Decorator to auto-log changes
def audit_log(table_name: str):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            user = kwargs.get('current_user')
            result = await func(*args, **kwargs)

            # Log the change
            await db.execute(
                insert(AuditLog).values(
                    user_id=user.id,
                    user_email=user.email,
                    table_name=table_name,
                    action=func.__name__.upper(),
                    new_values=result.dict(),
                    ip_address=request.client.host,
                    user_agent=request.headers.get('user-agent')
                )
            )
            return result
        return wrapper
    return decorator

@app.post("/api/sales")
@audit_log('sales')
async def create_sale(sale: SaleCreate, current_user: User = Depends(verify_iap_token)):
    # Create sale...
    return new_sale
```

**Why audit logs:**
- Never deleted (permanent record)
- Compliance requirement
- Troubleshoot data issues
- Detect unauthorized access
- Reconstruct history if needed

---

## Data Discrepancy Prevention

### How Production Systems Ensure Data Integrity

#### 1. Single Source of Truth

**PostgreSQL = ONLY source of truth**

```
❌ NO:  Frontend → CSV files
❌ NO:  Frontend → JSON files
❌ NO:  Direct database access
✅ YES: Frontend → API → PostgreSQL
```

**After migration:**
- Delete `db/csv/` (or rename to `db/sample-data/` as reference)
- Delete `db/ui/` (no longer needed)
- Remove `apps/web/scripts/csv-to-json.mjs`
- Remove `apps/web/src/lib/mock-data.ts`
- All data access through API endpoints

#### 2. Database Transactions (Atomic Operations)

**Problem:** Multi-step operations can fail halfway

**Solution:** Transactions ensure all-or-nothing

```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

async def create_sale_with_inventory_update(
    sale_data: SaleCreate,
    db: AsyncSession
):
    async with db.begin():  # Start transaction
        # Step 1: Create sale
        new_sale = Sale(**sale_data.dict())
        db.add(new_sale)

        # Step 2: Update inventory
        product = await db.get(Product, sale_data.product_code)
        product.stock_quantity -= sale_data.quantity

        # Step 3: Create commission record
        commission = Commission(
            employee_id=sale_data.staff_id,
            sale_id=new_sale.id,
            amount=calculate_commission(sale_data.amount)
        )
        db.add(commission)

        # If ANY step fails, ALL steps roll back
        await db.commit()
```

**Benefits:**
- If inventory update fails, sale is not created
- Database always in consistent state
- No orphaned records

#### 3. Data Validation (Pydantic Models)

**Backend enforces business rules:**

```python
from pydantic import BaseModel, Field, validator
from datetime import date
from decimal import Decimal

class SaleCreate(BaseModel):
    product_code: str = Field(..., min_length=1, max_length=100)
    quantity: int = Field(gt=0, description="Must be positive")
    unit_price: Decimal = Field(gt=0, decimal_places=2)
    amount: Decimal = Field(gt=0, decimal_places=2)
    date: date = Field(le=date.today(), description="Cannot be future date")
    client_number: str
    payment_type: str = Field(..., regex='^(Cash|Credit|Cheque)$')

    @validator('amount')
    def validate_amount(cls, amount, values):
        # Ensure amount = quantity × unit_price
        if 'quantity' in values and 'unit_price' in values:
            expected = values['quantity'] * values['unit_price']
            if abs(amount - expected) > Decimal('0.01'):
                raise ValueError('Amount must equal quantity × unit_price')
        return amount

    @validator('product_code')
    async def product_must_exist(cls, product_code, values):
        # Check product exists in database
        product = await get_product(product_code)
        if not product:
            raise ValueError(f'Product {product_code} does not exist')
        return product_code
```

**Benefits:**
- Invalid data rejected before reaching database
- Business rules centralized in one place
- Clear error messages to frontend

#### 4. Database Constraints (Enforce at DB Level)

**Double protection: backend + database**

```sql
-- Check constraints
ALTER TABLE sales
  ADD CONSTRAINT positive_quantity CHECK (quantity > 0),
  ADD CONSTRAINT positive_amount CHECK (amount > 0),
  ADD CONSTRAINT valid_payment CHECK (payment_type IN ('Cash', 'Credit', 'Cheque')),
  ADD CONSTRAINT date_not_future CHECK (date <= CURRENT_DATE);

-- Foreign key constraints (prevent orphaned records)
ALTER TABLE sales
  ADD CONSTRAINT fk_staff FOREIGN KEY (staff_id) REFERENCES users(id)
    ON DELETE RESTRICT,  -- Cannot delete user with sales
  ADD CONSTRAINT fk_product FOREIGN KEY (product_code) REFERENCES products(product_code)
    ON DELETE RESTRICT,
  ADD CONSTRAINT fk_client FOREIGN KEY (client_number) REFERENCES clients(client_number)
    ON DELETE RESTRICT;

-- Unique constraints (prevent duplicates)
ALTER TABLE products
  ADD CONSTRAINT unique_product_code UNIQUE (product_code);

ALTER TABLE users
  ADD CONSTRAINT unique_email UNIQUE (email),
  ADD CONSTRAINT unique_iap_sub UNIQUE (iap_sub);
```

**Benefits:**
- Database enforces rules even if backend has bugs
- Impossible to insert invalid data
- Prevents orphaned records

#### 5. Version Control for Schema (Alembic)

**Problem:** Database schema changes across environments

**Solution:** Alembic migration scripts track all changes

```bash
db/migrations/
├── alembic.ini
├── env.py
└── versions/
    ├── 001_initial_schema.py        (2025-01-15)
    ├── 002_add_audit_log.py         (2025-01-20)
    ├── 003_add_user_role_column.py  (2025-01-25)
    └── 004_add_check_constraints.py (2025-02-01)
```

**Migration example:**
```python
"""Add audit_log table

Revision ID: 002
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table('audit_log',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('user_id', sa.UUID(), sa.ForeignKey('users.id')),
        sa.Column('table_name', sa.String(100), nullable=False),
        sa.Column('action', sa.String(50), nullable=False),
        # ... more columns
    )

def downgrade():
    op.drop_table('audit_log')
```

**Benefits:**
- Schema changes tracked in Git
- Reproducible across dev/staging/production
- Can upgrade or rollback migrations
- Team knows what changed when

#### 6. Optimistic Locking (Prevent Concurrent Conflicts)

**Problem:** Two users edit same record simultaneously

**Solution:** Add version column

```sql
ALTER TABLE products ADD COLUMN version INTEGER DEFAULT 1;
```

**Backend logic:**
```python
async def update_product(product_id: str, updates: ProductUpdate, expected_version: int):
    result = await db.execute(
        update(Product)
        .where(Product.id == product_id)
        .where(Product.version == expected_version)  # Must match
        .values(**updates.dict(), version=expected_version + 1)
    )

    if result.rowcount == 0:
        # Someone else modified it
        raise HTTPException(409, "Product was modified by another user. Please refresh.")

    return await db.get(Product, product_id)
```

**Benefits:**
- Prevents lost updates
- User notified of conflicts
- Can reload fresh data and retry

---

## CSV Files Future State

### Decision: Keep as Sample Data

**Current state:**
- `db/csv/` - Test/fake data only (not real company data)
- `db/ui/` - Generated JSON from CSV

**After PostgreSQL migration:**

```
db/
├── sample-data/          [RENAMED from csv/]
│   ├── README.md         "Example data structure for development"
│   ├── sales/
│   ├── customers/
│   └── ...
├── migrations/           [NEW - Alembic migrations]
│   ├── versions/
│   └── alembic.ini
└── README.md             [UPDATED]
```

**Updated db/README.md:**
```markdown
# Database

## Production Data
All production data is stored in Cloud SQL PostgreSQL.
- Instance: salesvision-db
- Region: us-central1
- Backups: Automated daily backups with 30-day retention

## Sample Data
The `sample-data/` directory contains example CSV files used for:
- Development and testing
- Understanding data structure
- Seeding test databases

**These are NOT real company records.**

## Migrations
Database schema is managed via Alembic migrations in `migrations/versions/`.
```

**What to delete:**
- ✅ `db/ui/` - No longer needed (was for frontend consumption)
- ✅ `apps/web/scripts/csv-to-json.mjs` - No longer needed
- ✅ `apps/web/src/lib/mock-data.ts` - Replace with API calls

**What to keep:**
- ✅ `db/sample-data/` (renamed from csv) - Reference for developers
- ✅ Clear README explaining it's test data only

---

## Session Management

### IAP Session Configuration

**Session timeout:** 5 hours (configurable in IAP settings)

```bash
# Configure IAP session duration
gcloud iap settings set \
  --project=youngintlsaleswebapp \
  --resource-type=cloud-run \
  --service=salesvision-frontend \
  --session-duration=18000s  # 5 hours
```

### Frontend Draft Saving

**Problem:** User fills form, session expires, data lost

**Solution:** Auto-save drafts to localStorage temporarily

```typescript
// Example: Sales form
function SalesForm() {
  const [formData, setFormData] = useState<SaleCreate>(getLocalDraft() || {});

  // Save draft on every change
  useEffect(() => {
    localStorage.setItem('draft_sale', JSON.stringify(formData));
  }, [formData]);

  async function handleSubmit() {
    await saveSale(formData);
    // Clear draft after successful submit
    localStorage.removeItem('draft_sale');
  }

  return <form>...</form>;
}

function getLocalDraft(): SaleCreate | null {
  const draft = localStorage.getItem('draft_sale');
  return draft ? JSON.parse(draft) : null;
}
```

### Backend Session State

**Track user's last page for restore after re-login:**

```sql
ALTER TABLE sessions ADD COLUMN last_page_url VARCHAR(500);
```

```python
@app.middleware("http")
async def track_page_access(request: Request, call_next):
    response = await call_next(request)

    if request.state.user:
        await db.execute(
            update(Session)
            .where(Session.user_id == request.state.user.id)
            .values(
                last_page_url=str(request.url),
                last_accessed=datetime.now()
            )
        )

    return response
```

**After re-login, redirect to last page:**
```python
@app.get("/api/auth/me")
async def get_current_user(user: User = Depends(verify_iap_token)):
    session = await get_user_session(user.id)

    return {
        "user": user,
        "redirect_to": session.last_page_url if session else "/dashboard"
    }
```

---

## Migration Checklist

### Backend (FastAPI)
- [ ] Add Google IAP JWT verification library
- [ ] Create `auth.py` middleware
- [ ] Create `users` table migration
- [ ] Create `sessions` table migration
- [ ] Implement `/api/auth/me` endpoint
- [ ] Implement `/api/admin/users` CRUD endpoints
- [ ] Add role-based filtering to all data endpoints
- [ ] Migrate CSV data to PostgreSQL
- [ ] Add SQLAlchemy models for all domains
- [ ] Deploy backend to Cloud Run
- [ ] Enable IAP on backend service

### Frontend (Next.js)
- [ ] Replace `useAuth` hook with API fetch
- [ ] Remove `login/page.tsx`
- [ ] Remove localStorage auth logic
- [ ] Add API client with credentials
- [ ] Replace all `mock-data` imports with API calls
- [ ] Update role checks to use API user object
- [ ] Add loading states for API calls
- [ ] Handle API errors gracefully
- [ ] Update navigation based on new auth
- [ ] Redeploy frontend to Cloud Run
- [ ] Enable IAP on frontend service

### Infrastructure
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials
- [ ] Enable IAP on Cloud Run services
- [ ] Set up Cloud SQL PostgreSQL instance
- [ ] Configure automated backups (30-day retention)
- [ ] Enable point-in-time recovery on Cloud SQL
- [ ] Create Cloud Storage bucket for CSV exports (gs://salesvision-backups)
- [ ] Configure VPC connector for Cloud Run → Cloud SQL
- [ ] Add IAP users/groups in GCP Console
- [ ] Set up monitoring/logging for auth failures
- [ ] Configure session timeout policies (5 hours)
- [ ] Test IAP authentication flow end-to-end
- [ ] Set up weekly CSV export cron job

### Data
- [ ] Design PostgreSQL schema for all 13 tables (per databasedescription.md)
- [ ] Write Alembic migrations
- [ ] Write CSV → PostgreSQL migration scripts
- [ ] Validate data integrity after migration
- [ ] Archive CSV files
- [ ] Update data transformation pipeline (if needed)

---

## Key Files Reference

### Authentication
- `apps/web/src/hooks/use-auth.ts` - Auth hook (localStorage-based, TO BE REPLACED)
- `apps/web/src/app/login/page.tsx` - Login page (TO BE REMOVED)
- `apps/web/src/components/user-nav.tsx` - User dropdown with logout

### Data
- `apps/web/src/lib/mock-data.ts` - Central data exports (TO BE REPLACED with API calls)
- `db/ui/` - All static JSON data (source of truth currently)
- `db/csv/` - Original CSV data sources
- `apps/web/scripts/csv-to-json.mjs` - Transformation script

### Navigation & Layout
- `apps/web/src/components/app-sidebar.tsx` - Role-based navigation
- `apps/web/src/app/layout.tsx` - Root layout

### Protected Pages (22 files)
- `apps/web/src/app/dashboard/page.tsx` - Admin dashboard
- `apps/web/src/app/admin/page.tsx` - Employee/Manager dashboard
- `apps/web/src/app/sales/` - Sales pages (new, report, target, cumulative)
- `apps/web/src/app/customers/` - Customer pages (list, new)
- `apps/web/src/app/products/page.tsx` - Product management
- `apps/web/src/app/inventory/page.tsx` - Inventory management
- `apps/web/src/app/purchases/new/page.tsx` - Local purchases
- `apps/web/src/app/imports/new/page.tsx` - Product imports
- `apps/web/src/app/commissions/page.tsx` - Commission tracking
- `apps/web/src/app/credit/page.tsx` - Credit management
- `apps/web/src/app/reports/` - Cash and check reports
- `apps/web/src/app/employees/` - Employee management
- `apps/web/src/app/account/delegate/page.tsx` - Account delegation

---

## Data Structure Mapping

### Current JSON Structure → Future PostgreSQL

Based on `db/databasedescription.md`, here are the 13 tables needed:

1. **Sales** (sales.csv) - Main transaction records
2. **Credit** (credit.csv) - Payment status tracking
3. **OverdueCollection** (overdueCollection.csv) - Overdue payments
4. **Client** (client.csv) - Customer master data
5. **Employee** (employee.csv) - Staff roster
6. **Commission** (commission.csv) - Commission calculations
7. **Product** (product.csv) - Product catalog with costs
8. **PriceList** (priceList.csv) - Tiered pricing by client grade
9. **Stock** (stock.csv) - Inventory levels
10. **MonthlySalesTarget** (monthlySalesTarget.csv) - Sales goals
11. **Expenditure** (expenditure.csv) - Operating expenses
12. **Cash** (cash.csv) - Cash flow tracking
13. **Cheque** (cheque.csv) - Check payment tracking

**Additional tables needed for IAP:**
14. **users** - User accounts with IAP integration
15. **sessions** - Active sessions

### Key Relationships

```
users (IAP auth)
  ↓ 1:1
employees (sales data)
  ↓ 1:N
sales, customers, commissions
  ↓ N:1
products, clients
```

**Foreign key strategy:**
- `sales.staff_id` → `users.id`
- `customers.employee_id` → `users.employee_id`
- `users.manager_id` → `users.id` (self-reference for hierarchy)
- `sales.product_code` → `products.product_code`
- `sales.client_number` → `clients.client_number`

---

## Current Limitations Summary

### What Works
✅ Clean UI with 21 functional pages
✅ Role-based navigation rendering
✅ Client-side data filtering by role
✅ CSV → JSON transformation pipeline
✅ Google Genkit AI integration
✅ Deployed frontend on Cloud Run

### What Doesn't Work
❌ **No server-side authentication** - localStorage only
❌ **No data persistence** - static JSON files
❌ **No user account system** - hardcoded users
❌ **No session management** - never expires
❌ **Security easily bypassed** - client-side only
❌ **No audit trail** - no logging of access/changes
❌ **No real-time updates** - static data
❌ **No multi-user support** - no conflict resolution

---

## Next Steps

### Phase 1: Database Setup (Backend Foundation)
1. Set up Cloud SQL PostgreSQL instance
2. Create Alembic migration for all 13 + 2 tables
3. Write CSV → PostgreSQL migration scripts
4. Deploy FastAPI with database connection
5. Create basic CRUD endpoints for each domain

### Phase 2: Authentication (IAP Integration)
1. Enable IAP on Cloud Run services
2. Implement JWT verification in FastAPI
3. Create user management endpoints
4. Migrate frontend to use API for auth
5. Remove localStorage auth system

### Phase 3: Data Integration (API Calls)
1. Replace all `mock-data` imports with API calls
2. Implement role-based filtering in backend
3. Add error handling and loading states
4. Test data consistency across roles
5. Remove static JSON dependencies

### Phase 4: Production Hardening
1. Add session timeout policies
2. Implement audit logging
3. Add rate limiting
4. Set up monitoring/alerting
5. Security audit and penetration testing

---

## Implementation Decisions (User-Confirmed)

### ✅ Account Creation
**Decision:** Admin-only via SalesVision UI

- Frontend role switcher (login page) will be removed after IAP
- Only admin can create/edit/delete users
- Two-step access: (1) You add email to IAP in GCP, (2) Admin creates user with role in app

### ✅ Role Assignment
**Decision:** Manual admin assignment

- Admin assigns roles when creating users in `/admin/users/new`
- Stored in PostgreSQL `users` table
- No email-based rules or Google Groups integration

### ✅ Existing Users
**Decision:** Remove hardcoded test users

- Current test users (John Doe, Jane Smith, Alex Ray) are not real
- Frontend role switcher to be removed after IAP
- Real employees will be added via two-step process

### ✅ Session Duration
**Decision:** 5-hour timeout with auto-save

- IAP session expires after 5 hours
- Frontend auto-saves form drafts to localStorage
- Backend tracks last page URL for restore after re-login

### ✅ Historical Data
**Decision:** Current CSV data is test data only

- Not real company records
- Will rename `db/csv/` → `db/sample-data/` as reference
- Production data will be in Cloud SQL PostgreSQL

### ✅ Data Backups
**Decision:** Three-tier backup strategy

1. Cloud SQL automated daily backups (30-day retention)
2. Weekly CSV exports to Cloud Storage (1-year retention)
3. Audit log table (permanent record of all changes)

### 🔄 Still To Decide

1. **Employee Linking**: How to match IAP email to existing employee data in production CSV? Manual mapping during migration?

2. **Multi-tenancy**: Will there be multiple companies using this system, or single-tenant?

3. **Offline Access**: Any requirements for offline functionality, or always online?

---

## Conclusion

Current frontend is fully functional with client-side auth and static data. System ready for backend/database integration. IAP migration requires backend API, PostgreSQL setup, and frontend refactoring to replace localStorage with API-based auth. Core role-based logic can be reused with server-side enforcement.
