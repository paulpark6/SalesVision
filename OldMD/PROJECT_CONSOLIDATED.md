# Sales Vision Project - Consolidated Documentation

This document consolidates all project documentation into a single reference file.

---

# 1. PROJECT_MASTER_PLAN.md

# 📅 Sales Vision Project - Master Plan & Roadmap

**Goal**: Production-ready Sales Vision App by **February 1, 2025**.
**Executive Summary**: The project is currently ~40% complete. The Frontend is fully built and deployed. The critical remaining work is building the Backend API and Cloud SQL Database to replace the current static file system.

---

## 🚀 High-Level Status

| Component | Status | Progress | Key Insight |
|-----------|--------|----------|-------------|
| **Frontend** | ✅ COMPLETE | 100% | Deployed on Cloud Run. Fully functional UI with API integration. |
| **Data Pipeline** | ✅ COMPLETE | 100% | CSV-to-JSON transformation deprecated in favor of DB. |
| **Database** | ✅ COMPLETE | 100% | Cloud SQL instance active, Schema defined, Foreign Keys linked, Data seeded. |
| **Backend API** | ✅ ACTIVE | 75% | Core CRUD logic implemented for 14+ modules. |
| **Auth** | ⚠️ IN PROGRESS | 60% | Backend middleware ready. Syncing with Frontend roles. |

---

## 🗓️ 8-Week Timeline (Roadmap)

### Phase 1: Foundation (Weeks 1-2)
**Focus**: Database & Basic Connectivity
*   [x] **Infrastructure**: Set up Cloud SQL & Cloud Run.
*   [x] **Database**: Define Foreign Keys & Relationships in PostgreSQL.
*   [x] **API**: Connect FastAPI to Database.
*   [x] **Seed Data**: Migrate CSV data to PostgreSQL.

### Phase 2: Core Features (Weeks 3-4)
**Focus**: CRUD Operations (Create, Read, Update, Delete)
*   [x] **Sales Module**: Create/Edit sales via API. (Backend Ready)
*   [x] **Modules**:
  - [x] Sales: Complete CRUD + Frontend Integration
  - [x] Customers: Complete CRUD + Frontend Integration
  - [x] Products: Complete CRUD + Frontend Integration
  - [x] **Authentication**: Google IAP Integration (Backend Logic Ready)

### Phase 3: Advanced Logic & Auth (Weeks 5-6)
**Focus**: Business Rules & Security
*   [ ] **Security**: Implement Google IAP (Identity Aware Proxy).
*   [ ] **Commissions**: Implement commission calculation logic.
*   [ ] **RBAC**: Enforce Admin vs Manager vs Employee roles on the server.
*   [ ] **Inventory**: Stock tracking and auto-updates.

### Phase 4: Polish & Deploy (Weeks 7-8)
**Focus**: Production Readiness
*   [ ] **Testing**: End-to-end verification.
*   [ ] **Security Audit**: Review permissions and audit logs.
*   [ ] **Final Deployment**: Deploy fully integrated system to Cloud Run.
*   [ ] **Go Live**: User verification. **DEADLINE: FEB 1**.

---

## 🏗️ Architecture Overview

### Target Architecture
We are moving from a **Static/Client-Side** app to a **Secure/Three-Tier** application.

```mermaid
graph TD
    User[User] -->|HTTPS| IAP[Google Cloud IAP]
    IAP -->|Authenticated| FE[Frontend (Cloud Run)]
    FE -->|API Calls (JWT)| BE[Backend API (Cloud Run)]
    FE -->|API Calls (JWT)| BE[Backend API Non-Blocking (Cloud Run)]
    BE -->|SQLAlchemy ORM| DB[(Cloud SQL PostgreSQL)]
    
    subgraph "Local Development"
    LocalFE[Local Frontend] -->|API| LocalBE[Local Backend]
    LocalBE -->|Docker Network| LocalDB[(Docker PostgreSQL)]
    end
    
    subgraph Security Layer
    IAP
    end
    
    subgraph "Application Layer"
    FE
    BE
    end
    
    subgraph "Data Layer"
    DB
    end
```

### Key Components

#### 1. Frontend (Completed)
*   **Tech**: Next.js, TypeScript, Tailwind CSS.
*   **Role**: User Interface.
*   **Action**: Needs to be updated to fetch data from API instead of local JSON files.

#### 2. Backend (To Build)
*   **Tech**: FastAPI (Python).
*   **Role**: Business Logic & Data Gateway.
*   **Action**: Needs to implement REST endpoints for Sales, Customers, Employees, etc.

#### 3. Database (To Configure)
*   **Tech**: PostgreSQL on Cloud SQL (Production), Docker PostgreSQL (Local).
*   **Tools**: SQLAlchemy (ORM), Alembic (Migrations).
*   **Role**: Source of Truth.
*   **Action**: Needs Foreign Key relationships defined and data migrated from CSVs.

---

## 🎯 Project Goals

### Front End
*   **Goal**: Deployed, containerized Next.js app.
*   **Status**: **DONE**.
*   **Next**: Integrate with Backend API.

### Back End
*   **Goal**: Deployed FastAPI service on Cloud Run.
*   **Status**: **ACTIVE**.
*   **Next**: Finalize business logic and role-based access.

### Database
*   **Goal**: Hosted PostgreSQL on Cloud SQL.
*   **Status**: **DONE**.
*   **Next**: Maintain schema via migrations.

### Authentication
*   **Goal**: Secure, identity-based access.
*   **Status**: **IN PROGRESS**. (Backend middleware ready, UI synchronization pending).
*   **Next**: Migrate to Google IAP + Backend Session Management.

---

# 2. PROJECT_PLAN_ACTUAL.md

# Project Plan

## Front End

### Goal: [DONE]
Get a working version of the frontend deployed to Cloud Run and containerize it.

1. [x] Containerize the frontend using Docker.
2. [x] Deploy the frontend to Cloud Run.

### Key Features for Frontend:
1. Role-based UI
2. Client-side authentication
3. Grabbing the tables from Cloud Database and directly updating it (should be dealing with csv files, not JSON files). Edits should be simple like adding a row removing a row and updating a row. Also the data should be updated in real time so there could be conflicts when multiple users are editing the same row. We need to deal with this by using a version control system based on timestamps and names.
4. Google Genkit AI integration (not needed for now)
5. Docker image (linux/amd64)
6. API integration (needs backend)
7. Secure authentication (needs IAP + backend)

### Timeline:
1. make sure the data update is working (locally)
2. make sure the frontend can update data and upload to cloud using help of backend
3. make sure the frontend's user interface is working for different roles, for now check the role-based UI (no implementation of IAP or secure authentication yet)
4. make sure the frontend is containerized and deployed to Cloud Run

## Back End

### Goal:
Get a working version of the backend deployed to Cloud Run and containerize it.

1. Containerize the backend using Docker.
2. Deploy the backend to Cloud Run.

### Key Features for Backend:
1. Database connection [DONE]
2. SQLAlchemy models (Design and pipeline complete) [DONE]
3. API endpoints (Implemented: Sales, Clients, Products, etc.) [DONE]
4. Authentication middleware (Needs Google IAP integration) [PENDING]
5. CRUD operations (Implemented for core modules) [DONE]

## Database

### Goal: [DONE]
Get a working version of the database deployed to Cloud SQL and containerize it.

1. [x] Containerize the database using Docker (PostgreSQL 15 image).
    - Use `docker-compose.yml` for local orchestration.
    - Ensure persistent storage with Docker volumes.
2. [x] Deploy the database to Cloud SQL.

### Key Features for Database:
1. Database connection: Use `database.py` with environment variables to switch between Local Docker DB and Cloud SQL.
2. SQLAlchemy models: Use ORM for all 14 tables, creating relationships (Foreign Keys) to replace CSV parsing.
3. Local Data Persistence: Use Docker Volumes to save data locally.

## Authentication

### Goal:
Get a working version of the authentication deployed to Cloud Run and containerize it.

1. Containerize the authentication using Docker.
2. Deploy the authentication to Cloud Run.

### Key Features for Authentication:
1. Authentication middleware (need to design the authentication middleware, make sure IAP works)
2. CRUD operations (need to design the CRUD operations, make sure the data is updated in real time with timestamps and names)

## Data Pipeline

### Goal:
Get a working version of the data pipeline deployed to Cloud Run and containerize it.

1. Containerize the data pipeline using Docker.
2. Deploy the data pipeline to Cloud Run.

### Key Features for Data Pipeline:
1. Data pipeline (need to design the data pipeline)

## Deployment

### Goal:
Get a working version of the deployment deployed to Cloud Run and containerize it.

1. Containerize the deployment using Docker.
2. Deploy the deployment to Cloud Run.

### Key Features for Deployment:
1. Deployment (need to design the deployment)

## Testing

### Goal:
Get a working version of the testing deployed to Cloud Run and containerize it.

1. Containerize the testing using Docker.
2. Deploy the testing to Cloud Run.

### Key Features for Testing:
1. Testing (need to design the testing)

## Security

### Goal:
Get a working version of the security deployed to Cloud Run and containerize it.

1. Containerize the security using Docker.
2. Deploy the security to Cloud Run.

### Key Features for Security:
1. Security (need to design the security)

## Maintenance

### Goal:
Get a working version of the maintenance deployed to Cloud Run and containerize it.

1. Containerize the maintenance using Docker.
2. Deploy the maintenance to Cloud Run.

### Key Features for Maintenance:
1. Maintenance (need to design the maintenance)

---

# 3. IAP_Database.md

IAP & Hierarchical Access

What IAP Does:
- ✅ Authentication (who can access the app)
- ✅ User identity (email, name, Google ID)
- ❌ Authorization (what they can do inside app)
- ❌ Hierarchical access (who reports to whom)

What IAP DOESN'T Do:
- No role system (admin/manager/employee)
- No hierarchy tracking (manager → employee relationships)
- No permission management

Recommended Approach:

┌─────────────────────────────────────┐
│  Google Cloud IAP                   │
│  - Controls WHO can access app      │
│  - Authenticates via Google account │
└─────────────┬───────────────────────┘
              │
              │ User passes IAP gate
              ▼
┌─────────────────────────────────────┐
│  SalesVision Backend (PostgreSQL)   │
│  - Controls WHAT users can do       │
│  - Stores roles (admin/manager/emp) │
│  - Tracks hierarchy (who manages)   │
│  - Enforces permissions             │
└─────────────────────────────────────┘

Implementation:

1. IAP Access List (in GCP Console):
  - Add all employees by email: john@company.com, jane@company.com
  - They can now reach the app (but can't do anything yet)
2. User Management in SalesVision:
  - Admin creates user accounts in app UI (/admin/users/new)
  - Form: Email, Name, Role, Manager (if employee)
  - Stored in PostgreSQL users table
  - Backend checks if user exists + is active
3. Admin Controls:
  - Admin page: /admin/users (admin-only route)
  - Can create, edit, delete, activate/deactivate users
  - Can assign roles and set manager relationships
  - Can see all users and their access history

Two-Step Access:
Step 1: You add user email to IAP (GCP Console)
        ↓
Step 2: Admin creates user in app with role (SalesVision UI)
        ↓
User can now login AND has permissions

---
Backup & Data Management Strategy

Industry Standard Approach

PostgreSQL on Cloud SQL (recommended):

┌───────────────────────────────────────┐
│  Cloud SQL PostgreSQL                 │
│  - Primary database (source of truth)│
│  - Automated daily backups (Google)   │
│  - Point-in-time recovery (7-35 days) │
└───────────────────────────────────────┘
        │
        ├─ Automated Cloud SQL Backups (Google manages)
        │  • Daily automatic snapshots
        │  • Retained for 7 days (configurable to 365)
        │  • One-click restore
        │
        ├─ Manual Exports (your control)
        │  • Weekly CSV export jobs
        │  • Stored in Cloud Storage bucket
        │  • Audit trail for compliance
        │
        └─ Application-Level Audit Log
           • Who changed what data when
           • Stored in separate `audit_log` table
           • Never deleted (compliance)

Recommended Backup Strategy

1. Cloud SQL Automated Backups (Primary)
- What: Google automatically backs up entire database
- Frequency: Daily at 3 AM
- Retention: 30 days (configurable)
- Cost: Included with Cloud SQL
- Recovery: Point-in-time restore to any second

Configuration:
gcloud sql instances patch salesvision-db \
  --backup-start-time=03:00 \
  --retained-backups-count=30 \
  --enable-point-in-time-recovery

2. CSV Export Jobs (Secondary/Compliance)
- What: Export data to CSV format weekly
- Why: Human-readable format, regulatory compliance, data portability
- Storage: Cloud Storage bucket with versioning

Implementation:
# Weekly cron job in Cloud Run/Cloud Functions
@app.post("/admin/export/weekly")
async def weekly_export():
    # Export each table to CSV
    for table in ['sales', 'customers', 'employees', ...]:
        df = await query_table(table)
        filename = f"{table}_{date.today()}.csv"
        df.to_csv(f"gs://salesvision-backups/weekly/{filename}")

3. Audit Log (Change Tracking)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  table_name VARCHAR(100),
  record_id UUID,
  action VARCHAR(50),  -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);

Every data change logged → can recreate history if needed.

---
CSV Files Going Forward

Current CSV files = TEST DATA ONLY

Options:

Option A: Delete Test CSVs After Migration (Recommended)

db/
├── csv/ [DELETE after PostgreSQL setup]
├── ui/ [DELETE after API integration]
└── README.md [Update: "Data now in Cloud SQL"]

Pros: Clean codebase, no confusion
Cons: Lose test data structure reference

Option B: Keep as Examples

db/
├── sample-data/ [Rename from csv/]
│   └── README.md "Example data structure for testing"
└── README.md [Update: "Production data in Cloud SQL"]

Pros: New developers can see data structure
Cons: Might accidentally use test data

Option C: CSV Import Feature (Future)

Keep CSV transformation script for admin to bulk import data:
- Admin uploads CSV via UI
- Backend validates and imports to PostgreSQL
- Useful for migrating from other systems

My Recommendation: Option B (keep as examples) with clear README

---
Data Discrepancies Prevention

How companies handle this:

1. Single Source of Truth

PostgreSQL = ONLY source of truth
- No CSV files in production
- No JSON files in production
- API is only way to read/write data

2. Database Transactions

# Atomic operations - all succeed or all fail
async with db.transaction():
    await create_sale(sale_data)
    await update_inventory(product_id, -quantity)
    await create_commission(employee_id, commission)
# If ANY step fails, ALL roll back

3. Data Validation

# Backend enforces rules
class SaleCreate(BaseModel):
    product_code: str
    quantity: int = Field(gt=0)  # Must be positive
    amount: Decimal = Field(gt=0)
    date: date = Field(le=date.today())  # Can't be future

4. Database Constraints

-- Database enforces integrity
ALTER TABLE sales
  ADD CONSTRAINT positive_quantity CHECK (quantity > 0),
  ADD CONSTRAINT positive_amount CHECK (amount > 0),
  ADD CONSTRAINT valid_date CHECK (date <= CURRENT_DATE);

-- Prevent orphaned records
ALTER TABLE sales
  ADD FOREIGN KEY (staff_id) REFERENCES users(id),
  ADD FOREIGN KEY (product_code) REFERENCES products(product_code);

5. Version Control for Schema

Alembic migrations track database schema changes:
db/migrations/versions/
├── 001_initial_schema.py
├── 002_add_user_role_column.py
├── 003_add_audit_log_table.py

Every schema change tracked in Git → reproducible across environments.

6. Concurrency Control

Optimistic locking prevents conflicting updates:
-- Add version column
ALTER TABLE products ADD COLUMN version INTEGER DEFAULT 1;

-- Update only if version matches
UPDATE products
SET stock = 50, version = version + 1
WHERE id = 'ABC' AND version = 3;

-- If 0 rows updated → someone else changed it → retry

---
Summary of Recommendations

User Access Management

1. ✅ Remove frontend role switcher after IAP
2. ✅ Add all employee emails to IAP (GCP Console)
3. ✅ Build admin UI for user management (/admin/users)
4. ✅ Store roles + hierarchy in PostgreSQL users table
5. ✅ Admin-only can create/edit/delete users in app
6. ✅ IAP authentication + backend authorization = secure

Data & Backups

1. ✅ Cloud SQL PostgreSQL as single source of truth
2. ✅ Enable automated daily backups (30 day retention)
3. ✅ Weekly CSV exports to Cloud Storage (compliance)
4. ✅ Audit log for all data changes
5. ✅ Delete or rename test CSV files after migration
6. ✅ Use database constraints + transactions for consistency

Session Management

1. ✅ 5 hour timeout (IAP configurable)
2. ✅ Auto-save: Frontend saves form drafts to localStorage temporarily
3. ✅ On re-login: User sees their last page (backend tracks session
state)

---

# 4. gcp_guide.md

# Google Cloud SQL Navigation Guide

Now that your database is live on Google Cloud, here is how to view and manage it.

## 1. Accessing the Console
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Ensure you have selected the correct project: **`youngintlsaleswebapp`** (Top bar dropdown).
3.  In the Search bar at the top, type **"SQL"** and select **SQL** from the results.

## 2. Viewing Your Instance
You should see an instance list. Look for:
*   **Instance ID**: `sales-vision-db`
*   **Type**: PostgreSQL 15
*   **Status**: Green checkmark (Runnable)

Click on `sales-vision-db` to open the **Overview** page.

## 3. Key Tabs
### Overview
*   **Connect to this instance**: Shows the "Connection name" used by the proxy (`youngintlsaleswebapp:us-central1:sales-vision-db`).
*   **Resources**: Shows CPU/Memory usage.

### Databases
*   Click **Databases** on the left menu.
*   You should see `sales_vision` (the one we just created) and `postgres` (system default).

### Users
*   Click **Users** on the left menu.
*   You should see `postgres` (the admin user).
*   *Security Tip*: You can add application-specific users here later for better security (e.g., `app_user`).

### Data Explorer (Cloud SQL Studio)
Google provides a built-in tool to query data without a separate client!
1.  Click **Cloud SQL Studio** on the left menu.
2.  **Sign in**:
    *   **Database**: `sales_vision`
    *   **User**: `postgres`
    *   **Password**: (The one you put in your `.env` file)
3.  Click **Authenticate**.
4.  **Run a Query**:
    In the editor window, type:
    ```sql
    SELECT * FROM employees;
    ```
    Click **Run**. You should see the 5 employees we seeded.

## 4. Monitoring & Logs
*   **Operations**: Shows a history of actions (like "Restart", "Update").
*   **Logs**: Click **Logs** to see database logs. This is useful if the API fails to connect—you can see if the DB rejected the connection.

## 5. Connecting from Local Machine
You are already doing this!
*   **The Proxy**: The terminal running `./apps/api/cloud-sql-proxy ...` is your secure bridge.
*   **Your Apps**: Any app (DBeaver, VS Code, Python) connecting to `localhost:5432` is actually talking to this Cloud DB.

---

# 5. frontEndLogic.md

# Frontend Logic Documentation

## Overview

SalesVision frontend uses client-side role-based authentication with static JSON data. No backend API integration exists - all data served from transformed CSV files. Three-tier user hierarchy with page-level access control.

## Authentication System

### Core Implementation
**File:** `apps/web/src/hooks/use-auth.ts`
**Storage:** localStorage key `'salesvision_auth'`

### Login Flow
1. **Login Page:** `apps/web/src/app/login/page.tsx`
   - User selects role: 'director', 'staff', or 'manager'
   - Role selection IS the authentication

## User Hierarchy & Roles

### Three-Tier System

#### 1. Admin (Director/CEO)
**Internal role:** `'admin'`
**Access level:** Full system access, all employee data, all customer data

#### 2. Manager
**Internal role:** `'manager'`
**Access level:** Team data + own data

#### 3. Employee (Staff)
**Internal role:** `'employee'`
**Access level:** Own data only

## Google IAP Migration Strategy

### Recommended Two-Step Access Model

```
┌─────────────────────────────────────┐
│  Step 1: Google Cloud IAP           │
│  - Controls WHO can access app      │
│  - Authenticates via Google account │
└─────────────┬───────────────────────┘
              │ User passes IAP gate
              ▼
┌─────────────────────────────────────┐
│  Step 2: SalesVision Backend        │
│  - Controls WHAT users can do       │
│  - Stores roles in PostgreSQL       │
└─────────────────────────────────────┘
```

---

# 6. datatable_aggregation.md

# Base Tables

## Expenditures
### Purpose: display total monthly expenditure, including the costs associated with locally purchased products.

## Employees
### Purpose: staff information

## Clients
### Purpose: client information

## Products
### Purpose: product information

## Credits
### Purpose: credit information

## MonthlySalesTargets
### Purpose: monthly sales target information for each staff

## Stocks
### Purpose: stock information

## CashFlows
### Purpose: cash flow information

## Cheques
### Purpose: cheque information

## PriceLists
### Purpose: price list information

## Sales
### Purpose: sales information

## OverdueCollections
### Purpose: overdue collection information

# Aggregation Tables

## Commissions
### Purpose: commission information

---

# 7. DataPlan.md

# Database Planning & Implementation Guide

## Overview
SalesVision requires a PostgreSQL database to replace current CSV→JSON static data flow.

## Database Schema Design
### 13-Table Architecture
1. **users**: Employees + Authentication
2. **clients**: Customer Master Data
3. **products**: Product Catalog
4. **price_lists**: Tiered Pricing
5. **sales**: Transaction Records
6. **credit_transactions**: Payment Tracking
7. **overdue_collections**: Collection Efforts
8. **check_payments**: Check Tracking
9. **inventory**: Stock Management
10. **sales_targets**: Sales Quotas
11. **commissions**: Employee Earnings
12. **expenditures**: Business Expenses
13. **cash_flows**: Cash Tracking

---

# 8. databasedescption.md

## Current State

✅ **Cloud SQL Instance**: `sales-Vision-db` (POSTGRES_15, us-central1)
✅ **Database**: `salesVision` created
✅ **Secret Manager**: DATABASE_URL stored
✅ **SQLAlchemy Models**: 14 models created
✅ **Alembic Migrations**: Initialized and applied
✅ **Database Connectivity**: Verified
⚠️ **Foreign Key Relationships**: NOT DEFINED in initial migration
❌ **Seed Data**: Not loaded

**❗ ACTION REQUIRED**: Define foreign key relationships between tables before proceeding with backend API.

---

# 9. CLAUDE.md

# Sales Vision Project - Claude Memory

## Communication Style
- Max concision. Drop grammar if needed.
- End plans with unresolved Q list.

## State Tracking Protocol
**CRITICAL**: Before ANY code changes:
1. Check relevant .md file in root
2. After changes: Update Current State section in that .md
3. Mark ✅/❌ status changes
4. Keep .md files as source of truth

---

# 10. backendAPIPlan.md

# Backend API Planning & Implementation Guide

## Overview
SalesVision backend API must be built from minimal FastAPI scaffold. Need full REST API with 60+ endpoints, JWT auth, role-based access control, database integration, business logic, and Cloud Run deployment.

**Current State (Updated 2025-11-15):**
- ✅ FastAPI 0.111.0+ installed
- ✅ SQLAlchemy 2.0+ with asyncpg
- ✅ Cloud SQL database running
- ✅ 14 tables created in PostgreSQL
- ✅ Database connectivity verified
- ❌ Only 2 endpoints exist (`/healthz/ready`, `/healthz/live`)
- ❌ No business logic routers
- ❌ No authentication system

**Target State:**
- 11 business domain routers
- JWT authentication + IAP integration
- Role-based access control middleware
- 60+ REST endpoints
- Database CRUD operations
