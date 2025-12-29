# Sales Vision Project - Comprehensive Guide & Analysis

## 1. Project Overview
**Sales Vision** is a business management web application designed for a sales-driven organization. It facilitates the management of sales, customers, employees, inventory, and financial reports.

**Current Status**:
- **Frontend**: Fully functional, deployed on Cloud Run, synchronized with Backend API for core modules.
- **Backend**: Core CRUD endpoints implemented for 14+ modules, connected to Cloud SQL with business logic.
- **Database**: PostgreSQL on Cloud SQL is the primary source of truth, with foreign key relationships defined and data seeded.
- **Authentication**: Backend middleware implemented; current work involves synchronizing with frontend roles and IAP.

---

## 2. Architecture Breakdown

The project follows a **Three-Tier Architecture** (imminently moving from a client-side static model).

### 🌐 Web (Frontend)
- **Role**: The user interface for all stakeholders (Director, Managers, Staff).
- **Current Behavior**: Reads data from local JSON files (generated from CSVs). Handles routing, display logic, and client-side role filtering.
- **Future Behavior**: Will authenticate via Google IAP, then make REST API calls to the Backend to fetch/mutate data.

### 🔌 API (Backend)
- **Role**: The logic layer enforcing business rules, security, and data consistency.
- **Status**: Minimal scaffold. Needs implementing ~60 endpoints.
- **Responsibilities**:
    - **Authentication**: Validate Google IAP identity & manage sessions.
    - **Authorization**: Enforce RBAC (Role-Based Access Control).
    - **Data Operations**: CRUD operations on the database via SQLAlchemy.
    - **Validation**: Ensure data integrity using Pydantic models.

### 💾 Database (Storage)
- **Role**: The single source of truth for all business data.
- **Technology**: PostgreSQL 15 on Google Cloud SQL.
- **Structure**: 14 tables representing core business entities (Sales, Users, Products, etc.).
- **Management**: Managed via **Alembic** for migrations and **SQLAlchemy** for ORM.

---

## 3. Technology Stack

### Frontend
- **Framework**: **Next.js** (React)
- **Language**: **TypeScript**
- **Styling**: **Tailwind CSS**
- **Data Fetching**: Currently static imports; moving to `fetch` / `axios`.
- **Hosting**: Google Cloud Run (Dockerized).

### Backend
- **Framework**: **FastAPI** (Python 3.12+)
- **Server**: **Uvicorn** (ASGI)
- **ORM**: **SQLAlchemy** (Async)
- **Migrations**: **Alembic**
- **Validation**: **Pydantic v2**
- **Hosting**: Google Cloud Run (Dockerized).

### Database
- **Engine**: **PostgreSQL 15**
- **Hosting**: **Google Cloud SQL**
- **Local Dev**: Docker-compose (PostgreSQL container).

### Infrastructure / DevOps
- **Cloud Provider**: **Google Cloud Platform (GCP)**
- **Authentication**: **Google Cloud IAP** (Identity-Aware Proxy)
- **Containerization**: **Docker**
- **Secrets**: GCP Secret Manager & .env files.

---

## 4. Current Flaws & Critical Issues

### ⚠️ Security (In Progress)
1.  **Legacy Client-Side Auth**: Still visible in UI but backend now requires valid credentials/IAP for write operations.
2.  **RBAC Synchronization**: Backend enforces roles, but frontend UI elements need tighter coupling with backend permissions.

### ✅ Database Integrity (Resolved)
1.  **Foreign Keys**: Linked and enforced at the database level.
2.  **Single Source of Truth**: Frontend and Backend both point to Cloud SQL (directly or via API).

### ⚠️ Concurrency
1.  **Race Conditions**: Handling multiple users editing the same record still needs robust Optimistic Locking.

### ✅ Architecture (Resolved)
1.  **API Driven**: CSV-to-JSON pipeline deprecated; app is now API-driven.
2.  **Functional Backend**: Routers registered and logic implemented for all core domains.

---

## 5. Domain Models & Data Structure

The application covers these key domains:

1.  **User Management**: `users` (Staff, Managers, Admins)
2.  **CRM**: `clients` (Customer details, grading A/B/C)
3.  **Catalog**: `products` (Items, costs, categories), `price_lists` (Tiered pricing)
4.  **Sales**: `sales` (Transactions), `commissions` (Staff earnings)
5.  **Finance**: `cash_flows`, `expenditures`, `check_payments`, `credit_transactions`
6.  **Operations**: `inventory` (Stock), `overdue_collections` (Debt recovery), `sales_targets`.

---

## 6. Proposed Improved Structure & Restructuring

To make the project "make more sense" as a modern web app, we should restructure the files to group by **Domain/Feature** rather than **Type**.

### Current Structure (Type-based)
```text
/apps/api/app
  /models (all models)
  /schemas (all schemas)
  /routers (all routers)
  /crud (all crud ops)
```
*Issue*: To add a "Sale", you touch 4 different folders.

### Proposed Structure (Domain-based)
Group related logic together (Vertical Slice Architecture is often cleaner for FastAPI).

```text
/apps/api/app
  /modules
    /sales
      router.py
      service.py (crud)
      schemas.py
      models.py
    /users
      ...
    /inventory
      ...
  /core
    config.py
    security.py
    database.py
```
*Benefit*: Easier to maintain. Everything related to "Sales" is in one folder.

### Frontend Restructuring
Ensure the query/mutation layers are separated from UI components.
```text
/apps/web/src
  /features
    /sales
      /components
      /hooks (useSales, useCreateSale)
      /api (fetchers)
  /components (Shared UI)
  /app (Pages/Routing)
```

---

## 7. Next Steps for AI / Developers

If you are an AI reading this to continue work:

1.  **Fix Database Relationships**: Create an Alembic migration to `ADD CONSTRAINT FOREIGN KEY` for all 14 tables.
2.  **Implement Auth**: Build the `/auth/login` (or IAP verify) endpoint and `deps.get_current_user`.
3.  **Build Vertical Slices**: Pick one domain (e.g., **Products** or **Users**) and implement the full stack:
    - Backend: Model -> Schema -> CRUD -> Router.
    - Frontend: API Client -> Hook -> UI Component.
4.  **Connect**: Swap the frontend mock data import with the new API hook.
5.  **Repeat**: Proceed to the next domain.

---

# Testing 101: Dev vs Prod

This guide explains how to verify your application in both local development and production environments.

## 1. Local Development Testing (Day-to-day)

**Goal:** Verify features while coding, using local data and mock authentication.

### ✅ Checklist
- [ ] **URL**: [http://localhost:9002](http://localhost:9002)
- [ ] **Database**: Local PostgreSQL (running in Docker)
- [ ] **Authentication**: Mock (Select Role)

### 🧪 How to Test

1.  **Start the Environment**:
    ```bash
    npm run dev:db      # Starts local DB
    npm run dev:api     # Starts API
    npm run dev:web     # Starts Web App
    ```

2.  **Verify Login & Roles**:
    -   Go to Login Page.
    -   **Test Admin**: Select "Director" -> Verify you see all data and financial reports.
    -   **Test Manager**: Select "Manager" -> Verify you see your team's data.
    -   **Test Staff**: Select "Staff" -> Verify you see restricted view.

3.  **Verify Data Persistence**:
    -   Create a new sale or employee.
    -   Restart the API server (`Ctrl+C` then `npm run dev:api`).
    -   Refresh page to ensure data is still there (saved to local DB).

4.  **Verify Hot Reloading**:
    -   Change some text in a component file.
    -   Save the file.
    -   Browser should update automatically without full reload.

---

## 2. Cloud Dev Testing (Staging)

**Goal:** Verify your code against production-like data *before* deploying, or debug issues that only happen with cloud data.

### ✅ Checklist
- [ ] **URL**: [http://localhost:9002](http://localhost:9002) (Still running locally!)
- [ ] **Database**: **Cloud SQL Development Database** (via Proxy)
- [ ] **Authentication**: Mock (Select Role)

### 🧪 How to Test

1.  **Switch to Cloud Database**:
    ```bash
    # 1. Stop any running local database or proxy
    npm run dev:db:stop    # (If you have a stop script, otherwise Ctrl+C docker)
    
    # 2. Start Cloud Proxy
    npm run dev:proxy:cloud-dev
    
    # 3. Configure API to use Cloud DB
    cd apps/api
    ./scripts/setup-env.sh  -> Select Option 2 (Cloud Development)
    ```

2.  **Run the App**:
    ```bash
    npm run dev:api
    npm run dev:web
    ```

3.  **Verify Cloud Data**:
    -   Log in.
    -   You should see *different* data than your local environment (data from the cloud).
    -   **Be careful!** If you edit/delete data, you are changing the shared cloud development database.

---

## 3. Production Testing (Live App)

**Goal:** Verify the actual deployed application that end-users see.

### ✅ Checklist
- [ ] **URL**: `https://your-app-url.run.app` (or custom domain)
- [ ] **Database**: **Production Cloud SQL**
- [ ] **Authentication**: **Real Google Login** (IAP)

### 🧪 How to Test

1.  **Access the URL**:
    -   Go to your deployed URL.
    -   You should be redirected to Google Sign-In.

2.  **Verify IAP Login**:
    -   Sign in with your Google Account (`admin@salesvision.com`).
    -   You should not see the "Select Role" screen.
    -   You should be automatically logged in based on your email.

3.  **Smoke Test**:
    -   Check the "Health" or "Status" page if you have one.
    -   Verify critical paths (e.g., View Dashboard, Sales Report) load correctly.
    -   **Do NOT** create test data in Production unless you have a specific "Test Client" or plan to delete it immediately.

---

## Summary Table

| **URL** | `localhost:9002` | `localhost:9002` | `https://...` |
| **Database** | Local Docker | Cloud SQL (Dev DB) | Cloud SQL (Prod DB) |
| **Auth** | Mock (Click to Login) | Mock (Click to Login) | Google Workspace |
| **Data Safety** | Safe to wipe/reset | Shared (Be careful) | **CRITICAL** |
| **Speed** | Fast | Slower (Network latency) | Fast (Cloud-to-Cloud) |

---

## ❓ Critical FAQ

### Q1: How do I know if I'm running the correct Docker container?

Run this check command in your terminal:
```bash
docker ps
```

**What to look for:**
- **Local Dev**: You should see only **ONE** container: `sales-vision-db` (Postgres).
- **Cloud Dev**: You should see `cloud-sql-proxy` (if running via Docker, though we usually run it as a script).
- **If you see both**: **STOP!** You have a conflict. Kill the conflicting one.

### Q2: How do I verify my code is "Cloud Ready" (Deployment)?

**Confusion Alert ⚠️**: For **Local testing**, you do **NOT** need to build new Docker images or upload anything to the cloud.
- **Local Dev**: Uses "Hot Reloading". When you save a file (`ctrl+s`), the running app updates instantly. You are running the *source code*, not a built image.

**For Production Deployment**:
Yes, for Production, you must verify the new image is built and deployed.
1.  **Build & Deploy**: Run your deployment command (e.g., `gcloud run deploy ...`).
2.  **Verify Version**: Add a visible "Version" or "Commit Hash" in your app footer (e.g., in `layout.tsx`).
3.  **Check in Prod**: Go to your live URL (`https://...`) and check that footer number matches your latest commit.

# Sales Vision Startup Guide

This guide details how to start the Web App, Backend API, and Database for both Development (Local) and Production (Cloud) environments.

## 1. Development Environment (Local Data)
**Use Case:** Building features, testing changes, working offline. Uses a local Docker database.

### 🗄️ Database (Local Docker)
1.  **Start Container:**
    ```bash
    npm run dev:db
    ```
    *This starts a PostgreSQL container on `localhost:5432`.*

### ⚙️ Backend API
1.  **Configure Environment:**
    Ensure `apps/api/.env` is set to Local:
    ```env
    APP_ENV=development
    DATABASE_URL=postgresql://postgres:password@localhost:5432/sales_vision
    ```
2.  **Start API:**
    ```bash
    npm run dev:api
    ```
    *Running on: [http://localhost:8000/docs](http://localhost:8000/docs)*

### 🖥️ Frontend Web App
1.  **Start App:**
    ```bash
    npm run dev:web
    ```
    *Running on: [http://localhost:9002](http://localhost:9002)*

---

## 2. Production Environment (Real Data)
**Use Case:** Viewing live business data. Uses Google Cloud SQL.

> [!WARNING]
> **Port Conflict:** The Production Proxy uses port `5432` by default. You MUST stop your local Docker container (`docker stop sales-vision-db`) before starting the production proxy, OR change the proxy port to something else (like 5434).

### 🗄️ Database (Cloud SQL)
1.  **Stop Local DB:** `docker stop sales-vision-db`
2.  **Authenticate:** `gcloud auth login` (if needed)
3.  **Start Proxy:**
    *   **For Dev Cloud Data:**
        ```bash
        npm run dev:proxy:cloud-dev
        ```
        *Runs on Port `5433`*
    *   **For Prod Cloud Data:**
        ```bash
        npm run dev:proxy:cloud-prod
        ```
        *Runs on Port `5432`*

### ⚙️ Backend API
1.  **Configure Environment:**
    Update `apps/api/.env` to point to the Cloud Proxy:
    ```env
    APP_ENV=development
    # Use 5433 for cloud-dev, 5432 for cloud-prod
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5433/sales_vision_dev
    ```
2.  **Start API:**
    ```bash
    npm run dev:api
    ```

### 🖥️ Frontend Web App
1.  **Start App:**
    ```bash
    npm run dev:web
    ```

## 3. Switching Back to Local
To switch back to local development:
1.  Stop the Cloud SQL Proxy.
2.  Update `apps/api/.env` back to the local connection string.
3.  Run `npm run dev:db`.
4.  Restart the API.
#!/bin/bash

# RESTART_REAL_DATA.sh
# This script helps you restart both the backend and frontend to pick up 
# the new "Real Data" configuration.

 "🚀 Restarting SalesVision with Real Data configuration..."

# 1. Kill any existing next dev or uvicorn processes if they are running in the background
# (Optional - only if you want to force restart from this script)
# pkill -f "next dev"
# pkill -f "uvicorn"

 ""
 "📝 NEXT STEPS TO RUN MANUALLY:"
 "------------------------------------------------"
 "TAB 1: Cloud SQL Proxy (Already running? Keep it!)"
 "   ./apps/api/cloud-sql-proxy youngintlsaleswebapp:us-central1:sales-vision-db ..."
 ""
 "TAB 2: Backend API"
 "   cd apps/api"
 "   export APP_ENV=development"
 "   export DATABASE_URL=\"your_postgres_connection_string\""
 "   venv/bin/uvicorn app.main:app --reload --port 8000"
 ""
 "TAB 3: Frontend Web"
 "   cd apps/web"
 "   npm run dev"
 "------------------------------------------------"
 ""
 "🔍 VERIFICATION CHECKLIST:"
 "1. Open http://localhost:9002/login"
 "2. Click 'Login as Admin'"
 "3. Open Browser DevTools (F12) -> Network tab"
 "4. Look for the '/api/users/me' request"
 "5. VERIFY: No 'X-Mock-User-Email' header exists in the request."
 "6. VERIFY: The dashboard numbers match your Cloud SQL data."
 ""
 "Done! The app is now fully decoupled from mock data."
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

### Phase 1: Local Development (Weeks 1-2)
**Goal**: fast innovation loop using **Sales Vision Dev** database.
*   [x] **Infrastructure**: Create `sales_vision_dev` database on Cloud SQL.
*   [x] **Connectivity**: Install `cloud_sql_proxy` to connect localhost to Cloud DB.
*   [x] **Development**: Run `npm run dev` (Frontend on **Port 9002**) and `uvicorn` (Backend) locally.
*   [x] **Testing**: Verify changes immediately against the Dev DB.

### Phase 2: Packaging (Week 3)
**Goal**: Containerize the application for consistency.
*   [x] **Docker**: Create `Dockerfile` for Backend API.
*   [x] **Build**: Verify Docker build works locally.
*   [x] **Push**: Push images to Google Artifact Registry.

### Phase 3: Deployment (Week 4)
**Goal**: Deploy to a serverless environment.
*   [x] **Deploy**: Deploy Backend to Cloud Run (`sales-api`).
*   [x] **Connect**: Configure Cloud Run to talk to `sales_vision` (Prod DB).
*   [x] **Frontend**: Deploy Frontend to Cloud Run (`sales-web`).

### Phase 4: Security (Week 5)
**Goal**: Secure the application with Identity.
*   [ ] **IAP**: Enable Identity-Aware Proxy (Google Sign-In).
*   [ ] **Access**: Restrict access to `@yourcompany.com` emails.
*   [ ] **Verification**: Ensure only authenticated traffic reaches the API.

---

## 🧪 Testing & Environment Strategy

### Environments & Databases

| Environment | Application Location | Database Used | purpose |
| :--- | :--- | :--- | :--- |
| **Development** | **Your Laptop** (`localhost`) | **`sales_vision_dev`** | Safe playground. Sandbox data. Messy experiments allowed. |
| **Production** | **Google Cloud Run** | **`sales_vision`** | Real business data. Stable. Protected by IAP. |

> [!NOTE]
> **Why two databases?**
> Both live in the *same* Cloud SQL Instance (`sales-vision-db`) to save money, but they are different "files".
> *   **Dev DB**: You can delete tables, add fake data, and break things without affecting the business.
> *   **Prod DB**: The "Source of Truth" for the company.

### How to Test

#### 1. Testing "Dev" (While you code)
*   **Database**: `sales_vision_dev` (Cloud SQL Development DB)
*   **Proxy Command**: `./apps/api/cloud-sql-proxy youngintlsaleswebapp:us-central1:sales-vision-db --port 5433`
*   **Backend**: `npm run dev:api` (Runs on port 8000)
*   **Frontend**: `npm run dev` (Runs on **Port 9002**)
    > [!IMPORTANT]
    > **ALWAYS use Port 9002** (`http://localhost:9002`) for local development.
    > **DO NOT use Port 3002** or other random ports, as they may not be configured correctly.
*   **Access**: `http://localhost:9002`
*   **Data**: Writes to `sales_vision_dev`. Safe to mess up.

#### 2. Testing "Production" (Real Data)
*   **Database**: `sales_vision` (Cloud SQL Production DB)
*   **Proxy Command**: `./apps/api/cloud-sql-proxy youngintlsaleswebapp:us-central1:sales-vision-db --port 5432`
    *   *Note: You must change `.env` to point to port 5432 and DB `sales_vision` to test locally, OR use the deployed details.*
*   **Deployed App**: Access via `https://sales-vision-app.a.run.app`
*   **Data**: Writes to `sales_vision`. **BE CAREFUL**. This is real business data.

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

#### 2. Backend (Implemented/Active)
*   **Tech**: FastAPI (Python).
*   **Role**: Business Logic & Data Gateway.
*   **Action**: CORE CRUD endpoints implemented; focus shifted to advanced logic and role synchronization.

#### 3. Database (Completed)
*   **Tech**: PostgreSQL on Cloud SQL (Production), Docker PostgreSQL (Local).
*   **Tools**: SQLAlchemy (ORM), Alembic (Migrations).
*   **Role**: Source of Truth.
*   **Action**: Foreign Key relationships defined and data migrated from CSVs.

---

## 🎯 Project Goals

### Front End
*   **Goal**: Deployed, containerized Next.js app.
*   **Status**: **DONE**.
*   **Next**: Synchronize form fields with Backend API.

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

## 📚 Documentation Map

For detailed technical specifications, refer to:
*   **[PROJECT_DETAILED_STATUS.md](PROJECT_DETAILED_STATUS.md)**: Deep dive into schemas, API endpoints, logic, and gap analysis.

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

# Sales Vision Project - Comprehensive Guide & Analysis

## 1. Project Overview
**Sales Vision** is a business management web application designed for a sales-driven organization. It facilitates the management of sales, customers, employees, inventory, and financial reports.

**Current Status**:
- **Frontend**: Fully functional, deployed on Cloud Run, synchronized with Backend API for core modules.
- **Backend**: Core CRUD endpoints implemented for 14+ modules, connected to Cloud SQL with business logic.
- **Database**: PostgreSQL on Cloud SQL is the primary source of truth, with foreign key relationships defined and data seeded.
- **Authentication**: Backend middleware implemented; current work involves synchronizing with frontend roles and IAP.

---

## 2. Architecture Breakdown

The project follows a **Three-Tier Architecture** (imminently moving from a client-side static model).

### 🌐 Web (Frontend)
- **Role**: The user interface for all stakeholders (Director, Managers, Staff).
- **Current Behavior**: Reads data from local JSON files (generated from CSVs). Handles routing, display logic, and client-side role filtering.
- **Future Behavior**: Will authenticate via Google IAP, then make REST API calls to the Backend to fetch/mutate data.

### 🔌 API (Backend)
- **Role**: The logic layer enforcing business rules, security, and data consistency.
- **Status**: Minimal scaffold. Needs implementing ~60 endpoints.
- **Responsibilities**:
    - **Authentication**: Validate Google IAP identity & manage sessions.
    - **Authorization**: Enforce RBAC (Role-Based Access Control).
    - **Data Operations**: CRUD operations on the database via SQLAlchemy.
    - **Validation**: Ensure data integrity using Pydantic models.

### 💾 Database (Storage)
- **Role**: The single source of truth for all business data.
- **Technology**: PostgreSQL 15 on Google Cloud SQL.
- **Structure**: 14 tables representing core business entities (Sales, Users, Products, etc.).
- **Management**: Managed via **Alembic** for migrations and **SQLAlchemy** for ORM.

---

## 3. Technology Stack

### Frontend
- **Framework**: **Next.js** (React)
- **Language**: **TypeScript**
- **Styling**: **Tailwind CSS**
- **Data Fetching**: Currently static imports; moving to `fetch` / `axios`.
- **Hosting**: Google Cloud Run (Dockerized).

### Backend
- **Framework**: **FastAPI** (Python 3.12+)
- **Server**: **Uvicorn** (ASGI)
- **ORM**: **SQLAlchemy** (Async)
- **Migrations**: **Alembic**
- **Validation**: **Pydantic v2**
- **Hosting**: Google Cloud Run (Dockerized).

### Database
- **Engine**: **PostgreSQL 15**
- **Hosting**: **Google Cloud SQL**
- **Local Dev**: Docker-compose (PostgreSQL container).

### Infrastructure / DevOps
- **Cloud Provider**: **Google Cloud Platform (GCP)**
- **Authentication**: **Google Cloud IAP** (Identity-Aware Proxy)
- **Containerization**: **Docker**
- **Secrets**: GCP Secret Manager & .env files.

---

## 4. Current Flaws & Critical Issues

### ⚠️ Security (In Progress)
1.  **Legacy Client-Side Auth**: Still visible in UI but backend now requires valid credentials/IAP for write operations.
2.  **RBAC Synchronization**: Backend enforces roles, but frontend UI elements need tighter coupling with backend permissions.

### ✅ Database Integrity (Resolved)
1.  **Foreign Keys**: Linked and enforced at the database level.
2.  **Single Source of Truth**: Frontend and Backend both point to Cloud SQL (directly or via API).

### ⚠️ Concurrency
1.  **Race Conditions**: Handling multiple users editing the same record still needs robust Optimistic Locking.

### ✅ Architecture (Resolved)
1.  **API Driven**: CSV-to-JSON pipeline deprecated; app is now API-driven.
2.  **Functional Backend**: Routers registered and logic implemented for all core domains.

---

## 5. Domain Models & Data Structure

The application covers these key domains:

1.  **User Management**: `users` (Staff, Managers, Admins)
2.  **CRM**: `clients` (Customer details, grading A/B/C)
3.  **Catalog**: `products` (Items, costs, categories), `price_lists` (Tiered pricing)
4.  **Sales**: `sales` (Transactions), `commissions` (Staff earnings)
5.  **Finance**: `cash_flows`, `expenditures`, `check_payments`, `credit_transactions`
6.  **Operations**: `inventory` (Stock), `overdue_collections` (Debt recovery), `sales_targets`.

---

## 6. Proposed Improved Structure & Restructuring

To make the project "make more sense" as a modern web app, we should restructure the files to group by **Domain/Feature** rather than **Type**.

### Current Structure (Type-based)
```text
/apps/api/app
  /models (all models)
  /schemas (all schemas)
  /routers (all routers)
  /crud (all crud ops)
```
*Issue*: To add a "Sale", you touch 4 different folders.

### Proposed Structure (Domain-based)
Group related logic together (Vertical Slice Architecture is often cleaner for FastAPI).

```text
/apps/api/app
  /modules
    /sales
      router.py
      service.py (crud)
      schemas.py
      models.py
    /users
      ...
    /inventory
      ...
  /core
    config.py
    security.py
    database.py
```
*Benefit*: Easier to maintain. Everything related to "Sales" is in one folder.

### Frontend Restructuring
Ensure the query/mutation layers are separated from UI components.
```text
/apps/web/src
  /features
    /sales
      /components
      /hooks (useSales, useCreateSale)
      /api (fetchers)
  /components (Shared UI)
  /app (Pages/Routing)
```

---

## 7. Next Steps for AI / Developers

If you are an AI reading this to continue work:

1.  **Fix Database Relationships**: Create an Alembic migration to `ADD CONSTRAINT FOREIGN KEY` for all 14 tables.
2.  **Implement Auth**: Build the `/auth/login` (or IAP verify) endpoint and `deps.get_current_user`.
3.  **Build Vertical Slices**: Pick one domain (e.g., **Products** or **Users**) and implement the full stack:
    - Backend: Model -> Schema -> CRUD -> Router.
    - Frontend: API Client -> Hook -> UI Component.
4.  **Connect**: Swap the frontend mock data import with the new API hook.
5.  **Repeat**: Proceed to the next domain.

---
**Note to AI**: This file (`PROJECT_COMPREHENSIVE_GUIDE.md`) and `PROJECT_CONSOLIDATED.md` are the summaries of truth. `task.md` tracks immediate progress.


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
  Ready to update frontEndLogic.md with this info?


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


# Base Tables

## Expenditures
### Purpose: 
display total monthly expenditure, including the costs associated with locally purchased products.
### Tables Needed: - NONE
### Columns:
Date: dd/mm/yy showing the month of the expenditure.
payment_type: product purchaing and expenditure cost
product_code: Unique product code
ProductDescription: Description of code description
exenditurecategory: categorical variables of salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax.douane fee ,forwarder fee,other
Receipt_Availability: Binary variables of to prove the payment - yes or No
Cost: pay for payment way - purchaising and espenditure

## Employees
### Purpose: 
staff information
### Tables Needed: - Employees
Self left join table on manager_id
select * from Employees left join Employees on Employees.staff_number = Employees.manager_id 
### Columns:
staff_number -> unique identifier for each staff
position -> staff position
name -> staff name
division -> staff division
working_start -> staff workinhg start date
phone_number -> staff phone number
emergency_contact -> staff emergency contact
emergency_call -> staff emergency call
whatsapps -> staff whatsapps
manager_id -> staff manager id
manger_name -> staff manager name

## Clients
### Purpose:
client information
### Tables Needed:
### Columns:
client_number -> unique identifier for each client
client_name -> client name
client_category -> client category
client_grade -> client grade
contact_name -> client contact name
contact_position -> client contact position
contact_phone -> client contact phone
contact_name2 -> client contact name2
contact_position2 -> client contact position2
contact_phone2 -> client contact phone2
address -> client address
staff_managing -> staff managing client
client_type -> client type
average_amount -> client average amount
yearly_amount -> client yearly amount
information -> client information

## Products
### Purpose:
product information
### Tables Needed:
### Columns:
product_code -> unique identifier for each product
product_description -> product description
product_category -> product category
unit_cost -> product unit cost
classification -> product classification
credit_or_cash -> product credit or cash
amount_credit -> product amount credit
upload_date -> product upload date

## Credits
### Purpose:
credit information
### Tables Needed:
Clients
Employees
### Columns:
credit_id -> unique identifier for each credit
Clients.client_number -> client number
Clients.client_name -> client name
Employees.name -> staff name
payment_status -> payment status
credit_amount -> credit amount
credit_payment_type -> credit payment type
credit_due_date -> credit due date
sales_num -> sales number

## MonthlySalesTargets
### Purpose:
monthly sales target information for each staff
### Tables Needed:
Products
Employees
### Columns:
id -> unique identifier for each monthly sales target
Products.product_code -> product code
Employees.name -> staff name
sales_amount_3month -> sales amount for 3 months
sales_amount_2month -> sales amount for 2 months
sales_amount_1month -> sales amount for 1 month
sales_monthly_target -> sales monthly target
company_target -> company target

## Stocks
### Purpose:
stock information
### Tables Needed:
Products
### Columns:
id -> unique identifier for each stock
Products.product_code -> product code
Products.product_category -> product category
average_sales_quantity -> average sales quantity
duration_period -> duration period
check_date -> check date
monthly_review -> monthly review

## CashFlows
### Purpose:
cash flow information
### Tables Needed:
### Columns:
id -> unique identifier for each cash flow
date -> date
cash_origin -> cash origin
cash_amount -> cash amount
payment -> payment
payment_product -> payment product
payment_expenditure -> payment expenditure
weekly_review -> weekly review

## Cheques
### Purpose:
cheque information
### Tables Needed:
CashFlows
Clients
Employees
### Columns:
id -> unique identifier for each cheque
CashFlows.id -> cash flow id
receipt_date -> receipt date
due_date -> due date
Clients.client_name -> client name
Employees.name -> staff name
issue_bank -> issue bank
number_of_cheque -> number of cheque
deposit_bank -> deposit bank
deposit_date -> deposit date
cheque_amount -> cheque amount
approval_status -> approval status
weekly_review -> weekly review

## PriceLists
### Purpose:
price list information
### Tables Needed:
Products
Clients
### Columns:
id -> unique identifier for each price list
Products.product_code -> product code
Clients.client_grade -> client grade
price -> price

## Sales
### Purpose:
sales information
### Tables Needed:
Products
Clients
Employees
### Columns:
sale_num -> unique identifier for each sale
inventory_in_out -> inventory management system requires defining stock status as sales, returns, intgernal use ,broken, damage, missing
product_code -> unique product code
invoice_num -> invoice number
date -> date
quantity -> quantity of sold product
Clients.client_number -> client number
Employees.staff_number -> staff number
unit_price -> unit price
amount -> amount
cash_flows.payment_type -> payment type

## OverdueCollections
### Purpose:
overdue collection information
### Tables Needed:
Credits
Employees
### Columns:
credit_id -> unique identifier for each credit
date -> date
Clients.client_number -> client number
Employees.name -> staff name
credit_period -> credit period
credit_amount -> credit amount
action -> action

# Aggregation Tables

## Commissions
### Purpose:
commission information
### Tables Needed:
Employees
Products
### Columns:
id -> unique identifier for each commission
Employees.staff_number -> staff number
commission -> commission
monthly_review -> monthly review
Products.classification -> classification
client_transfer_calculation -> client transfer calculation



# Database Planning & Implementation Guide

## Overview

SalesVision requires a PostgreSQL database to replace current CSV→JSON static data flow. No database infrastructure exists - must build from scratch: schema design, migrations, models, seed data, and Cloud SQL deployment.

**Current State:**
- ❌ No database (CSV files only)
- ❌ No Alembic migrations
- ❌ No SQLAlchemy models
- ❌ No database connection
- ✅ 13 tables documented in `databasedescription.md`
- ✅ CSV sample data exists (`db/csv/`)

**Target State:**
- Cloud SQL PostgreSQL (production)
- Docker PostgreSQL (local dev)
- Alembic migrations (version control)
- SQLAlchemy async models
- Automated backups
- Audit logging

---

## Database Schema Design

### 13-Table Architecture

Based on `databasedescription.md`, the system requires 13 core tables + 2 auth tables:

```
Core Business Tables:
├── users (employees + auth)
├── clients (customers)
├── products (catalog)
├── price_lists (tiered pricing)
├── sales (transactions)
├── credit_transactions (payment tracking)
├── overdue_collections (collection efforts)
├── check_payments (check tracking)
├── inventory (stock levels)
├── sales_targets (quotas)
├── commissions (employee earnings)
├── expenditures (expenses)
└── cash_flows (cash tracking)

Authentication Tables:
├── sessions (IAP sessions)
└── audit_log (change tracking)
```

---

### Table 1: users (Employees + Authentication)

**Purpose:** User accounts with IAP integration + employee data

**Schema:**
```sql
CREATE TABLE users (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_number VARCHAR(50) UNIQUE NOT NULL,
    iap_sub VARCHAR(255) UNIQUE,  -- Google IAP subject ID
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,

    -- Role & Access
    role VARCHAR(50) NOT NULL,  -- 'admin', 'manager', 'employee'
    position VARCHAR(50) NOT NULL,  -- Display position
    division VARCHAR(50),  -- 'sales', 'internal work'
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,

    -- Contact Info
    phone_number VARCHAR(50),
    whatsapp VARCHAR(50),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),

    -- Employment
    working_start DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_staff_number ON users(staff_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_iap_sub ON users(iap_sub);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_active ON users(is_active);

-- Constraints
ALTER TABLE users
    ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'manager', 'employee')),
    ADD CONSTRAINT chk_division CHECK (division IN ('sales', 'internal work') OR division IS NULL);
```

**Key Fields:**
- `staff_number` - Login ID (from CSV)
- `iap_sub` - Google IAP user identifier (for IAP migration)
- `role` - Internal role for authorization (admin/manager/employee)
- `position` - Display position (Director, Manager, Staff)
- `manager_id` - Self-referencing FK for hierarchy

**Sample Data:**
```sql
INSERT INTO users (staff_number, email, name, role, position, division, manager_id) VALUES
('owner', 'ceo@company.com', 'John Doe', 'admin', 'Director', 'sales', NULL),
('mgr-001', 'manager@company.com', 'Alex Ray', 'manager', 'Manager', 'sales', (SELECT id FROM users WHERE staff_number = 'owner')),
('emp-001', 'employee@company.com', 'Jane Smith', 'employee', 'Staff', 'sales', (SELECT id FROM users WHERE staff_number = 'mgr-001'));
```

---

### Table 2: clients (Customer Master Data)

**Purpose:** Comprehensive customer management with hierarchy

**Schema:**
```sql
CREATE TABLE clients (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,

    -- Classification
    client_grade VARCHAR(10) NOT NULL,  -- 'A', 'B', 'C', 'enduser'
    client_category VARCHAR(100),  -- Industry: bus, garage, factory, etc.
    client_type VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'own', 'transfer', 'pending'

    -- Account Management
    account_owner_id UUID NOT NULL REFERENCES users(id),
    is_blocked BOOLEAN DEFAULT false,
    block_reason TEXT,

    -- Primary Contact
    contact_name VARCHAR(255),
    contact_position VARCHAR(100),
    contact_phone VARCHAR(50),

    -- Secondary Contact
    contact_name_2 VARCHAR(255),
    contact_position_2 VARCHAR(100),
    contact_phone_2 VARCHAR(50),

    -- Location
    address TEXT,

    -- Business Intelligence
    average_monthly_sales DECIMAL(15, 2),
    previous_year_total DECIMAL(15, 2),
    company_info TEXT,  -- Fleet size, product needs, monthly volume

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_clients_number ON clients(client_number);
CREATE INDEX idx_clients_name ON clients(client_name);
CREATE INDEX idx_clients_owner ON clients(account_owner_id);
CREATE INDEX idx_clients_grade ON clients(client_grade);
CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_category ON clients(client_category);
CREATE INDEX idx_clients_blocked ON clients(is_blocked);

-- Constraints
ALTER TABLE clients
    ADD CONSTRAINT chk_client_grade CHECK (client_grade IN ('A', 'B', 'C', 'enduser')),
    ADD CONSTRAINT chk_client_type CHECK (client_type IN ('own', 'transfer', 'pending'));
```

**Key Features:**
- **Client grading (A/B/C)** - Determines pricing tier
- **Client type** - Own developed vs transferred from others (affects commission)
- **Pending approval** - New clients require manager approval
- **Dual contacts** - Primary and backup contact persons

---

### Table 3: products (Product Catalog)

**Purpose:** Product catalog with cost tracking

**Schema:**
```sql
CREATE TABLE products (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_description TEXT NOT NULL,

    -- Classification
    product_category VARCHAR(100) NOT NULL,  -- 'Oil', 'Tire', 'Filter', 'Others'
    classification VARCHAR(50) NOT NULL,  -- 'import', 'local'

    -- Cost Information
    unit_cost DECIMAL(15, 2),
    cost_upload_date DATE,

    -- Purchase Details (for local products)
    purchase_payment_type VARCHAR(50),  -- 'cash', 'credit'
    credit_amount DECIMAL(15, 2),

    -- Status
    is_active BOOLEAN DEFAULT true,
    discontinuation_reason TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_category ON products(product_category);
CREATE INDEX idx_products_classification ON products(classification);
CREATE INDEX idx_products_active ON products(is_active);

-- Constraints
ALTER TABLE products
    ADD CONSTRAINT chk_product_classification CHECK (classification IN ('import', 'local')),
    ADD CONSTRAINT chk_purchase_payment CHECK (
        purchase_payment_type IN ('cash', 'credit', 'mix') OR purchase_payment_type IS NULL
    );
```

**Classification Impact:**
- **Import products**: 5% commission until 2M CFA, then 3%
- **Local products**: Commission based on profit margin %

---

### Table 4: price_lists (Tiered Pricing)

**Purpose:** Client-grade-specific pricing

**Schema:**
```sql
CREATE TABLE price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    client_grade VARCHAR(10) NOT NULL,  -- 'A', 'B', 'C', 'enduser'
    price DECIMAL(15, 2) NOT NULL,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one active price per product-grade combination
    UNIQUE(product_id, client_grade, effective_date)
);

-- Indexes
CREATE INDEX idx_price_lists_product ON price_lists(product_id);
CREATE INDEX idx_price_lists_grade ON price_lists(client_grade);
CREATE INDEX idx_price_lists_effective ON price_lists(effective_date);

-- Constraints
ALTER TABLE price_lists
    ADD CONSTRAINT chk_price_grade CHECK (client_grade IN ('A', 'B', 'C', 'enduser')),
    ADD CONSTRAINT chk_price_positive CHECK (price > 0),
    ADD CONSTRAINT chk_price_dates CHECK (expiry_date IS NULL OR expiry_date > effective_date);
```

**Usage:**
- Query active price for product + client grade
- Track price history via effective_date
- Bulk update prices by grade

---

### Table 5: sales (Transaction Records)

**Purpose:** Core sales transaction tracking

**Schema:**
```sql
CREATE TABLE sales (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100),
    sale_date DATE NOT NULL,

    -- Inventory Action
    inventory_action VARCHAR(50) NOT NULL DEFAULT 'sale',
    -- 'sale', 'return', 'internal_use', 'broken', 'damaged', 'missing'

    -- Relationships
    product_id UUID NOT NULL REFERENCES products(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Transaction Details
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,

    -- Payment Breakdown
    payment_type VARCHAR(50) NOT NULL,  -- 'cash', 'credit', 'check', 'prepayment', 'mixed-*'
    cash_amount DECIMAL(15, 2) DEFAULT 0,
    credit_amount DECIMAL(15, 2) DEFAULT 0,
    check_amount DECIMAL(15, 2) DEFAULT 0,
    prepayment_amount DECIMAL(15, 2) DEFAULT 0,

    -- Special Discount Approval (if price below standard)
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP,
    approval_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_sales_client ON sales(client_id);
CREATE INDEX idx_sales_employee ON sales(employee_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_payment_type ON sales(payment_type);
CREATE INDEX idx_sales_action ON sales(inventory_action);

-- Constraints
ALTER TABLE sales
    ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    ADD CONSTRAINT chk_unit_price_positive CHECK (unit_price > 0),
    ADD CONSTRAINT chk_total_amount_positive CHECK (total_amount > 0),
    ADD CONSTRAINT chk_sale_date_not_future CHECK (sale_date <= CURRENT_DATE),
    ADD CONSTRAINT chk_payment_sum CHECK (
        cash_amount + credit_amount + check_amount + prepayment_amount = total_amount
    );
```

**Key Features:**
- **Mixed payment types** - One sale can have cash + credit + check
- **Inventory actions** - Track sales, returns, damage, etc.
- **Approval workflow** - Special discounts require manager approval

---

### Table 6: credit_transactions (Payment Tracking)

**Purpose:** Track credit sales and payment status

**Schema:**
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Sale
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Credit Details
    transaction_date DATE NOT NULL,
    credit_amount DECIMAL(15, 2) NOT NULL,
    credit_due_date DATE NOT NULL,

    -- Payment Status
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'partial', 'paid', 'overdue'
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    paid_date DATE,

    -- Payment Method When Settled
    credit_payment_type VARCHAR(50),  -- 'cash', 'check', 'setoff', 'penalty', 'mix'

    -- Notes
    payment_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_credit_client ON credit_transactions(client_id);
CREATE INDEX idx_credit_employee ON credit_transactions(employee_id);
CREATE INDEX idx_credit_status ON credit_transactions(payment_status);
CREATE INDEX idx_credit_due_date ON credit_transactions(credit_due_date);
CREATE INDEX idx_credit_transaction_date ON credit_transactions(transaction_date);

-- Constraints
ALTER TABLE credit_transactions
    ADD CONSTRAINT chk_credit_amount_positive CHECK (credit_amount > 0),
    ADD CONSTRAINT chk_paid_amount_valid CHECK (paid_amount >= 0 AND paid_amount <= credit_amount),
    ADD CONSTRAINT chk_payment_status CHECK (
        payment_status IN ('pending', 'partial', 'paid', 'overdue', 'written_off')
    );
```

**Status Transitions:**
```
pending → partial → paid
   ↓
overdue → written_off (optional)
```

---

### Table 7: overdue_collections (Collection Efforts)

**Purpose:** Track overdue payment collection actions

**Schema:**
```sql
CREATE TABLE overdue_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Credit Transaction
    credit_transaction_id UUID NOT NULL REFERENCES credit_transactions(id) ON DELETE CASCADE,

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Collection Details
    collection_date DATE NOT NULL,
    overdue_amount DECIMAL(15, 2) NOT NULL,
    credit_period_days INTEGER,
    days_overdue INTEGER,

    -- Action Taken
    collection_action TEXT NOT NULL,  -- Staff describes actions (Saturday reports)
    follow_up_required BOOLEAN DEFAULT true,
    next_follow_up_date DATE,

    -- Resolution
    resolved BOOLEAN DEFAULT false,
    resolution_date DATE,
    resolution_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_overdue_client ON overdue_collections(client_id);
CREATE INDEX idx_overdue_employee ON overdue_collections(employee_id);
CREATE INDEX idx_overdue_date ON overdue_collections(collection_date);
CREATE INDEX idx_overdue_credit_tx ON overdue_collections(credit_transaction_id);
CREATE INDEX idx_overdue_follow_up ON overdue_collections(follow_up_required);
CREATE INDEX idx_overdue_resolved ON overdue_collections(resolved);
```

**Saturday Reports:**
Staff submit weekly collection actions - who they called, promises made, excuses given, next steps.

---

### Table 8: check_payments (Check Tracking)

**Purpose:** Monitor check payments and bank approvals

**Schema:**
```sql
CREATE TABLE check_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Transactions
    sale_id UUID REFERENCES sales(id),
    credit_transaction_id UUID REFERENCES credit_transactions(id),

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Check Details
    receipt_date DATE NOT NULL,
    due_date DATE NOT NULL,
    issuing_bank VARCHAR(255) NOT NULL,
    check_number VARCHAR(100) NOT NULL,
    check_amount DECIMAL(15, 2) NOT NULL,

    -- Deposit Details
    deposit_bank VARCHAR(255),  -- 'eco bank', 'bicici bank'
    deposit_date DATE,

    -- Bank Approval
    approval_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    approval_date DATE,

    -- If Rejected
    rejection_reason VARCHAR(50),  -- 'reissue', 'cash_pay', 'redeposit'
    reissued_check_id UUID REFERENCES check_payments(id),

    -- Notes
    notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_checks_client ON check_payments(client_id);
CREATE INDEX idx_checks_status ON check_payments(approval_status);
CREATE INDEX idx_checks_due_date ON check_payments(due_date);
CREATE INDEX idx_checks_deposit_date ON check_payments(deposit_date);
CREATE INDEX idx_checks_number ON check_payments(check_number);

-- Constraints
ALTER TABLE check_payments
    ADD CONSTRAINT chk_check_amount_positive CHECK (check_amount > 0),
    ADD CONSTRAINT chk_check_status CHECK (
        approval_status IN ('pending', 'approved', 'rejected', 'bounced')
    ),
    ADD CONSTRAINT chk_due_after_receipt CHECK (due_date >= receipt_date);
```

**Workflow:**
1. Check received → Create record (pending)
2. Deposited → Update deposit_date
3. Bank clears → approval_status = 'approved'
4. Bank rejects → approval_status = 'rejected', specify reason

---

### Table 9: inventory (Stock Management)

**Purpose:** Track product stock levels and reorder points

**Schema:**
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id),

    -- Stock Levels
    stock_quantity DECIMAL(15, 2) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(15, 2) DEFAULT 0,  -- For pending orders
    available_quantity DECIMAL(15, 2) GENERATED ALWAYS AS (stock_quantity - reserved_quantity) STORED,

    -- Reorder Intelligence
    average_sales_quantity DECIMAL(15, 2),  -- Monthly average
    duration_period DECIMAL(10, 2),  -- stock / avg sales (months of supply)
    reorder_level DECIMAL(15, 2) DEFAULT 20,
    reorder_quantity DECIMAL(15, 2),

    -- Tracking
    last_check_date DATE,
    last_reorder_date DATE,
    monthly_review_schedule VARCHAR(100),  -- "First Monday", "15th", etc.

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(available_quantity)
    WHERE available_quantity <= reorder_level;
CREATE INDEX idx_inventory_check_date ON inventory(last_check_date);

-- Constraints
ALTER TABLE inventory
    ADD CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0),
    ADD CONSTRAINT chk_reserved_non_negative CHECK (reserved_quantity >= 0),
    ADD CONSTRAINT chk_reorder_level_positive CHECK (reorder_level > 0);
```

**Auto-calculated Fields:**
- `available_quantity` = stock - reserved
- `duration_period` = stock / monthly average

**Low Stock Alert:**
```sql
SELECT p.product_code, p.product_description, i.available_quantity, i.reorder_level
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.available_quantity <= i.reorder_level;
```

---

### Table 10: sales_targets (Sales Quotas)

**Purpose:** Set and track employee sales targets

**Schema:**
```sql
CREATE TABLE sales_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    employee_id UUID NOT NULL REFERENCES users(id),
    product_id UUID REFERENCES products(id),  -- NULL = overall target

    -- Target Period
    target_month DATE NOT NULL,  -- First day of month (e.g., 2025-01-01)

    -- Target Amounts
    monthly_target DECIMAL(15, 2) NOT NULL,
    company_yearly_target DECIMAL(15, 2),  -- Divided by 12

    -- Historical Context
    sales_3_months_ago DECIMAL(15, 2),
    sales_2_months_ago DECIMAL(15, 2),
    sales_1_month_ago DECIMAL(15, 2),

    -- Progress Tracking
    current_month_sales DECIMAL(15, 2) DEFAULT 0,
    achievement_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN monthly_target > 0
        THEN (current_month_sales / monthly_target * 100)
        ELSE 0 END
    ) STORED,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One target per employee-product-month
    UNIQUE(employee_id, product_id, target_month)
);

-- Indexes
CREATE INDEX idx_targets_employee ON sales_targets(employee_id);
CREATE INDEX idx_targets_month ON sales_targets(target_month);
CREATE INDEX idx_targets_product ON sales_targets(product_id);

-- Constraints
ALTER TABLE sales_targets
    ADD CONSTRAINT chk_target_positive CHECK (monthly_target > 0);
```

**Target Setting:**
- Company sets yearly targets
- Divide by 12 for monthly
- Consider historical performance (last 3 months)
- Can set overall target (product_id = NULL) or product-specific

---

### Table 11: commissions (Employee Earnings)

**Purpose:** Calculate and track employee commissions

**Schema:**
```sql
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Employee
    employee_id UUID NOT NULL REFERENCES users(id),
    calculation_month DATE NOT NULL,  -- First day of month

    -- Employee Context
    position VARCHAR(50) NOT NULL,
    division VARCHAR(50),

    -- Commission Breakdown
    total_commission DECIMAL(15, 2) DEFAULT 0,
    import_product_commission DECIMAL(15, 2) DEFAULT 0,
    local_product_commission DECIMAL(15, 2) DEFAULT 0,
    transfer_client_commission DECIMAL(15, 2) DEFAULT 0,

    -- Calculation Details (JSON for transparency)
    calculation_details JSONB,  -- Store breakdown by sale

    -- Review & Approval
    monthly_review_notes TEXT,
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One commission record per employee-month
    UNIQUE(employee_id, calculation_month)
);

-- Indexes
CREATE INDEX idx_commissions_employee ON commissions(employee_id);
CREATE INDEX idx_commissions_month ON commissions(calculation_month);
CREATE INDEX idx_commissions_approved ON commissions(approved);

-- Constraints
ALTER TABLE commissions
    ADD CONSTRAINT chk_commission_non_negative CHECK (total_commission >= 0);
```

**Commission Rules:**
- **Import products**: 5% until 2M CFA, then 3%
- **Local products**: Based on margin % = (selling - cost) / selling
- **Transfer clients import**: 1%
- **Transfer clients local**: 50% of margin commission

---

### Table 12: expenditures (Business Expenses)

**Purpose:** Track all operating expenses

**Schema:**
```sql
CREATE TABLE expenditures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction Details
    expenditure_date DATE NOT NULL,
    payment_way VARCHAR(100) NOT NULL,  -- 'product purchasing', 'expenditure'

    -- Related Product (if applicable)
    product_id UUID REFERENCES products(id),

    -- Expense Details
    expenditure_category VARCHAR(100) NOT NULL,
    -- 'salary', 'delivery_cost', 'fuel', 'car_repair', 'electricity',
    -- 'water', 'rental_fee', 'cnps', 'import_tax', 'douane_fee',
    -- 'forwarder_fee', 'other'

    cost DECIMAL(15, 2) NOT NULL,

    -- Documentation
    receipt_available BOOLEAN DEFAULT false,
    receipt_file_url TEXT,

    -- Notes
    notes TEXT,

    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expenditures_date ON expenditures(expenditure_date);
CREATE INDEX idx_expenditures_category ON expenditures(expenditure_category);
CREATE INDEX idx_expenditures_product ON expenditures(product_id);
CREATE INDEX idx_expenditures_created_by ON expenditures(created_by);

-- Constraints
ALTER TABLE expenditures
    ADD CONSTRAINT chk_cost_positive CHECK (cost > 0);
```

**Categories:**
- **Salary** - Employee wages
- **Delivery cost** - Shipping to customers
- **Fuel** - Company vehicles
- **Rental fee** - Office rent
- **CNPS** - Social security contributions
- **Import tax, douane fee, forwarder fee** - Import costs

---

### Table 13: cash_flows (Cash Tracking)

**Purpose:** Monitor all cash inflows and outflows

**Schema:**
```sql
CREATE TABLE cash_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction Details
    transaction_date DATE NOT NULL,
    flow_type VARCHAR(50) NOT NULL,  -- 'inflow', 'outflow'

    -- Relationships
    client_id UUID REFERENCES clients(id),
    employee_id UUID REFERENCES users(id),

    -- Inflow Details
    cash_origin VARCHAR(100),  -- 'sales', 'collection', 'director_transfer', 'sub_rent'
    cash_inflow DECIMAL(15, 2) DEFAULT 0,

    -- Outflow Details
    payment_type VARCHAR(100),  -- 'product_purchase', 'expenditure'
    product_payment DECIMAL(15, 2) DEFAULT 0,
    expenditure_payment DECIMAL(15, 2) DEFAULT 0,

    -- Running Balance (can be calculated or stored)
    running_balance DECIMAL(15, 2),

    -- Review Schedule
    weekly_review_schedule VARCHAR(100),  -- "Every Saturday", etc.

    -- Notes
    notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_cash_flows_date ON cash_flows(transaction_date);
CREATE INDEX idx_cash_flows_type ON cash_flows(flow_type);
CREATE INDEX idx_cash_flows_client ON cash_flows(client_id);
CREATE INDEX idx_cash_flows_employee ON cash_flows(employee_id);

-- Constraints
ALTER TABLE cash_flows
    ADD CONSTRAINT chk_flow_type CHECK (flow_type IN ('inflow', 'outflow')),
    ADD CONSTRAINT chk_inflow_or_outflow CHECK (
        (flow_type = 'inflow' AND cash_inflow > 0) OR
        (flow_type = 'outflow' AND (product_payment + expenditure_payment) > 0)
    );
```

**Weekly Review:**
Finance team reviews cash position every week, reconciles against bank statements.

---

### Table 14: sessions (IAP Session Management)

**Purpose:** Track active user sessions with IAP tokens

**Schema:**
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Session Details
    iap_token_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,

    -- Session Lifecycle
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Session State
    last_page_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,

    -- Client Info
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Logout
    logged_out_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_active ON sessions(is_active);

-- Auto-cleanup expired sessions
CREATE INDEX idx_sessions_cleanup ON sessions(expires_at)
    WHERE is_active = true;
```

**Session Timeout:** 5 hours (configurable in IAP settings)

---

### Table 15: audit_log (Change Tracking)

**Purpose:** Permanent record of all data modifications

**Schema:**
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),

    -- What
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'

    -- Changes
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],  -- Array of field names that changed

    -- When & Where
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Context
    request_id VARCHAR(100),
    endpoint VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_record ON audit_log(record_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log(action);

-- Partitioning by month (optional, for large-scale)
-- CREATE TABLE audit_log_2025_01 PARTITION OF audit_log
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

**Never delete audit logs** - permanent compliance record.

---

## Foreign Key Relationships

### Entity Relationship Diagram

```
                    users (employees)
                      │
        ┌─────────────┼─────────────────────────┐
        │             │                         │
        ▼             ▼                         ▼
     clients       sales                  commissions
        │             │                         │
        ├──> sales    ├──> credit_transactions  │
        │             │         │                │
        │             │         └──> overdue_collections
        │             │         │
        │             │         └──> check_payments
        │             │
        │             └──> inventory (via products)
        │
        └──> cash_flows


    products
        │
        ├──> price_lists
        ├──> sales
        ├──> inventory
        ├──> sales_targets
        └──> expenditures (optional)
```

### Referential Integrity Rules

**Cascade Deletes:**
- `price_lists` → `products` (ON DELETE CASCADE)
- `sales` → `credit_transactions` (ON DELETE CASCADE)
- `credit_transactions` → `overdue_collections` (ON DELETE CASCADE)

**Restrict Deletes:**
- `users` → `sales` (ON DELETE RESTRICT - cannot delete user with sales)
- `clients` → `sales` (ON DELETE RESTRICT - cannot delete client with sales)
- `products` → `sales` (ON DELETE RESTRICT - cannot delete product with sales)

**Set Null:**
- `users.manager_id` → `users.id` (ON DELETE SET NULL - keep orphaned employees)

---

## Data Migration Strategy

### Phase 1: CSV to PostgreSQL Seed Data

**Transformation Script:** `db/migrations/seed_data.py`

```python
import pandas as pd
import asyncpg
import asyncio
from pathlib import Path

async def migrate_csv_to_postgres():
    conn = await asyncpg.connect(
        host='localhost',
        port=5432,
        user='app',
        password='app',
        database='appdb'
    )

    # 1. Migrate Employees First (no dependencies)
    employees_df = pd.read_csv('db/csv/employees/employees.csv')
    for _, row in employees_df.iterrows():
        await conn.execute('''
            INSERT INTO users (staff_number, name, position, division, phone_number)
            VALUES ($1, $2, $3, $4, $5)
        ''', row['value'], row['name'], row['role'], 'sales', '')

    # 2. Migrate Clients (depends on users)
    customers_df = pd.read_csv('db/csv/customers/customers.csv')
    for _, row in customers_df.iterrows():
        owner_id = await conn.fetchval('''
            SELECT id FROM users WHERE name = $1
        ''', row.get('Staff', 'Owner'))

        await conn.execute('''
            INSERT INTO clients (client_number, client_name, client_grade, account_owner_id)
            VALUES ($1, $2, $3, $4)
        ''', row['value'], row['label'], row.get('grade', 'C'), owner_id)

    # 3. Migrate Products
    products_df = pd.read_csv('db/csv/inventory/products.csv')
    for _, row in products_df.iterrows():
        await conn.execute('''
            INSERT INTO products (product_code, product_description, product_category, classification)
            VALUES ($1, $2, $3, $4)
        ''', row['value'], row['label'], 'Others', 'import')

    # 4. Migrate Sales (depends on users, clients, products)
    # ... similar pattern

    await conn.close()

asyncio.run(migrate_csv_to_postgres())
```

### Phase 2: Data Validation

**Validation Checks:**
```sql
-- Check referential integrity
SELECT 'Orphaned sales' AS issue, COUNT(*)
FROM sales s
LEFT JOIN users u ON s.employee_id = u.id
WHERE u.id IS NULL;

-- Check data quality
SELECT 'Negative quantities' AS issue, COUNT(*)
FROM sales
WHERE quantity <= 0;

-- Check duplicates
SELECT client_number, COUNT(*)
FROM clients
GROUP BY client_number
HAVING COUNT(*) > 1;
```

---

## Alembic Setup & Migrations

### Initialize Alembic

```bash
cd apps/api
alembic init alembic
```

**Configure `alembic.ini`:**
```ini
sqlalchemy.url = postgresql+asyncpg://app:app@localhost:5432/appdb
```

**Update `alembic/env.py`:**
```python
from app.db.base import Base
from app.models import *  # Import all models

target_metadata = Base.metadata

# Use async engine
from sqlalchemy.ext.asyncio import create_async_engine
config.get_main_option("sqlalchemy.url")
```

### Create Initial Migration

```bash
# Auto-generate migration from models
alembic revision --autogenerate -m "Initial schema with 15 tables"

# Review generated migration in alembic/versions/
# Edit if needed

# Apply migration
alembic upgrade head
```

### Migration Workflow

```bash
# Create new migration
alembic revision -m "Add column to sales table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View history
alembic history

# View current version
alembic current
```

---

## SQLAlchemy Models Structure

### Model File Organization

```
apps/api/app/models/
├── __init__.py          # Import all models
├── base.py              # Base class with common fields
├── user.py              # User model
├── client.py            # Client model
├── product.py           # Product model
├── price_list.py        # PriceList model
├── sale.py              # Sale model
├── credit.py            # CreditTransaction model
├── overdue.py           # OverdueCollection model
├── check.py             # CheckPayment model
├── inventory.py         # Inventory model
├── target.py            # SalesTarget model
├── commission.py        # Commission model
├── expenditure.py       # Expenditure model
├── cash_flow.py         # CashFlow model
├── session.py           # Session model
└── audit.py             # AuditLog model
```

### Base Model

**File:** `apps/api/app/models/base.py`
```python
from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class TimestampMixin:
    """Mixin for created_at and updated_at timestamps"""
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class UUIDMixin:
    """Mixin for UUID primary key"""
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
```

### Example: User Model

**File:** `apps/api/app/models/user.py`
```python
from sqlalchemy import Column, String, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, TimestampMixin, UUIDMixin

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    # Identity
    staff_number = Column(String(50), unique=True, nullable=False, index=True)
    iap_sub = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255), nullable=False)

    # Role & Access
    role = Column(String(50), nullable=False, index=True)
    position = Column(String(50), nullable=False)
    division = Column(String(50))
    manager_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), index=True)
    is_active = Column(Boolean, default=True, index=True)

    # Contact
    phone_number = Column(String(50))
    whatsapp = Column(String(50))
    emergency_contact = Column(String(255))
    emergency_phone = Column(String(50))

    # Employment
    working_start = Column(Date)
    last_login = Column(DateTime)

    # Relationships
    manager = relationship("User", remote_side="User.id", backref="team_members")
    clients = relationship("Client", back_populates="account_owner", foreign_keys="[Client.account_owner_id]")
    sales = relationship("Sale", back_populates="employee", foreign_keys="[Sale.employee_id]")
    commissions = relationship("Commission", back_populates="employee")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
```

### Example: Sale Model

**File:** `apps/api/app/models/sale.py`
```python
from sqlalchemy import Column, String, Integer, Date, ForeignKey, Boolean, DateTime, CheckConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, UUIDMixin, TimestampMixin

class Sale(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sales"

    # Transaction Details
    invoice_number = Column(String(100), index=True)
    sale_date = Column(Date, nullable=False, index=True)
    inventory_action = Column(String(50), nullable=False, default='sale', index=True)

    # Foreign Keys
    product_id = Column(UUID(as_uuid=True), ForeignKey('products.id'), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey('clients.id'), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)

    # Transaction Amounts
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(15, 2), nullable=False)
    total_amount = Column(Numeric(15, 2), nullable=False)

    # Payment Breakdown
    payment_type = Column(String(50), nullable=False, index=True)
    cash_amount = Column(Numeric(15, 2), default=0)
    credit_amount = Column(Numeric(15, 2), default=0)
    check_amount = Column(Numeric(15, 2), default=0)
    prepayment_amount = Column(Numeric(15, 2), default=0)

    # Approval
    requires_approval = Column(Boolean, default=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    approval_date = Column(DateTime)
    approval_notes = Column(String)

    # Relationships
    product = relationship("Product", back_populates="sales")
    client = relationship("Client", back_populates="sales")
    employee = relationship("User", back_populates="sales", foreign_keys=[employee_id])
    approver = relationship("User", foreign_keys=[approved_by])
    credit_transactions = relationship("CreditTransaction", back_populates="sale", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('quantity > 0', name='chk_quantity_positive'),
        CheckConstraint('unit_price > 0', name='chk_unit_price_positive'),
        CheckConstraint('total_amount > 0', name='chk_total_amount_positive'),
        CheckConstraint('sale_date <= CURRENT_DATE', name='chk_sale_date_not_future'),
        CheckConstraint(
            'cash_amount + credit_amount + check_amount + prepayment_amount = total_amount',
            name='chk_payment_sum'
        ),
    )
```

---

## Cloud SQL Configuration

### Production Setup

**Create Cloud SQL Instance:**
```bash
gcloud sql instances create salesvision-db \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=SECURE_PASSWORD \
    --backup-start-time=03:00 \
    --enable-bin-log \
    --retained-backups-count=30 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=4
```

**Create Database:**
```bash
gcloud sql databases create salesvision \
    --instance=salesvision-db
```

**Create User:**
```bash
gcloud sql users create app-user \
    --instance=salesvision-db \
    --password=APP_PASSWORD
```

**Enable IAM Authentication (Recommended):**
```bash
gcloud sql users create app-service-account@youngintlsaleswebapp.iam \
    --instance=salesvision-db \
    --type=CLOUD_IAM_SERVICE_ACCOUNT
```

### Connection Configuration

**Production (Cloud Run):**
```python
# Use Unix socket for Cloud SQL Proxy
DATABASE_URL = "postgresql+asyncpg://user:pass@/salesvision?host=/cloudsql/youngintlsaleswebapp:us-central1:salesvision-db"
```

**Local Development:**
```python
DATABASE_URL = "postgresql+asyncpg://app:app@localhost:5432/appdb"
```

**Environment Variables:**
```bash
# .env
DATABASE_URL=postgresql+asyncpg://app:app@localhost:5432/appdb
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=0
DB_ECHO=false
```

### VPC Connector (for Cloud Run)

```bash
gcloud compute networks vpc-access connectors create salesvision-connector \
    --region=us-central1 \
    --subnet=default \
    --min-instances=2 \
    --max-instances=10
```

**Deploy Cloud Run with VPC:**
```bash
gcloud run deploy salesvision-backend \
    --image=gcr.io/youngintlsaleswebapp/api:latest \
    --region=us-central1 \
    --vpc-connector=salesvision-connector \
    --set-env-vars=DATABASE_URL="postgresql+asyncpg://..."
```

---

## Backup Strategy

### Tier 1: Automated Cloud SQL Backups

**Configuration:**
```bash
gcloud sql instances patch salesvision-db \
    --backup-start-time=03:00 \
    --retained-backups-count=30 \
    --enable-point-in-time-recovery
```

**Features:**
- Daily snapshots at 3 AM
- 30-day retention
- Point-in-time recovery to any second
- No additional cost

**Restore:**
```bash
# List backups
gcloud sql backups list --instance=salesvision-db

# Restore from specific backup
gcloud sql backups restore BACKUP_ID \
    --backup-instance=salesvision-db

# Clone instance for testing
gcloud sql instances clone salesvision-db salesvision-db-test
```

### Tier 2: Weekly CSV Exports

**Endpoint:** `POST /api/admin/export/weekly`

**Implementation:** See `frontEndLogic.md` "Database Backup & Recovery Strategy" section

**Storage:** Cloud Storage bucket with versioning (gs://salesvision-backups)

### Tier 3: Audit Log

Permanent record in `audit_log` table - never deleted, partitioned by month for performance.

---

## Data Integrity Enforcement

### Database Constraints

**Implemented in schema:**
- Primary keys (all tables)
- Foreign keys with referential actions
- Check constraints (positive amounts, valid dates)
- Unique constraints (prevent duplicates)
- NOT NULL constraints (required fields)

### Application-Level Validation

**Pydantic models** enforce rules before database:
```python
from pydantic import BaseModel, Field, validator
from datetime import date

class SaleCreate(BaseModel):
    product_code: str
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)
    sale_date: date = Field(le=date.today())

    @validator('sale_date')
    def validate_not_future(cls, v):
        if v > date.today():
            raise ValueError("Sale date cannot be in the future")
        return v
```

### Transaction Management

**All multi-step operations wrapped in transactions:**
```python
async def create_sale_with_inventory(sale_data: SaleCreate, db: AsyncSession):
    async with db.begin():
        # 1. Create sale
        sale = Sale(**sale_data.dict())
        db.add(sale)

        # 2. Update inventory
        inventory = await db.get(Inventory, sale_data.product_id)
        inventory.stock_quantity -= sale_data.quantity

        # 3. Create credit transaction if needed
        if sale_data.credit_amount > 0:
            credit = CreditTransaction(sale_id=sale.id, ...)
            db.add(credit)

        await db.commit()  # All succeed or all rollback
```

---

## File Structure

### What Exists
```
db/
├── csv/                        # Source CSV data (test data)
├── ui/                         # JSON output (delete after migration)
└── databasedescription.md      # Schema documentation
```

### What to Create
```
db/
├── sample-data/                # Rename from csv/ (keep as reference)
│   ├── README.md              # Explain it's test data
│   └── ... (CSV files)
├── migrations/                 # Alembic migration system
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 001_initial_schema.py
│       ├── 002_add_audit_log.py
│       └── ...
├── scripts/
│   ├── seed_data.py           # CSV → PostgreSQL migration
│   ├── validate_data.py       # Data quality checks
│   └── backup_to_csv.py       # PostgreSQL → CSV export
└── README.md                  # Updated with production info
```

---

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Create Cloud SQL PostgreSQL instance (production)
- [ ] Start Docker PostgreSQL container (local dev)
- [ ] Initialize Alembic in `apps/api`
- [ ] Configure `alembic.ini` and `env.py`
- [ ] Create database connection module (`apps/api/app/db/session.py`)

### Phase 2: Models & Schema
- [ ] Create SQLAlchemy base model (`apps/api/app/models/base.py`)
- [ ] Create all 15 model files
- [ ] Generate initial Alembic migration
- [ ] Review and edit migration script
- [ ] Apply migration to local database
- [ ] Verify schema with `\dt`, `\d tablename` in psql

### Phase 3: Data Migration
- [ ] Write CSV → PostgreSQL transformation script
- [ ] Test migration on local database
- [ ] Validate data integrity (foreign keys, constraints)
- [ ] Create seed data for development
- [ ] Test rollback procedures

### Phase 4: Production Deployment
- [ ] Apply migrations to Cloud SQL
- [ ] Configure VPC connector
- [ ] Update Cloud Run services with DATABASE_URL
- [ ] Test database connectivity from Cloud Run
- [ ] Enable automated backups
- [ ] Configure backup monitoring

### Phase 5: Integration
- [ ] Update FastAPI to use database connection
- [ ] Replace CSV data with database queries
- [ ] Test all CRUD operations
- [ ] Implement audit logging
- [ ] Performance testing and optimization

---

## Migration Commands Reference

```bash
# Local Development
docker-compose -f docker/docker-compose.dev.yml up -d db
psql postgresql://app:app@localhost:5432/appdb

# Alembic
cd apps/api
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
alembic downgrade -1
alembic history
alembic current

# Cloud SQL
gcloud sql instances list
gcloud sql databases list --instance=salesvision-db
gcloud sql connect salesvision-db --user=app-user
gcloud sql operations list --instance=salesvision-db
gcloud sql backups list --instance=salesvision-db

# Data Migration
python db/scripts/seed_data.py
python db/scripts/validate_data.py
```

---

## Conclusion

Database infrastructure complete plan: 15 tables covering all business domains, proper foreign key relationships, indexes for performance, constraints for integrity, Alembic for migrations, Cloud SQL for production, automated backups, audit trail. Ready to replace CSV→JSON static data with proper PostgreSQL backend.


## Current State

✅ **Cloud SQL Instance**: `sales-Vision-db` (POSTGRES_15, us-central1)

✅ **Database**: `salesVision` created

✅ **Connection Name**: `youngintlsaleswebapp:us-central1:sales-Vision-db`

✅ **Secret Manager**: DATABASE_URL stored (version 1)

✅ **SQLAlchemy Models**: 14 models created (users, employees, clients, products, sales, credits, overdue_collections, commissions, price_lists, stocks, monthly_sales_targets, expenditures, cash_flows, cheques)

✅ **Alembic Migrations**: Initialized, migration generated and applied (f99bd1eb4948)

✅ **Schema Applied**: All 14 tables created successfully in Cloud SQL

✅ **Cloud SQL Proxy**: Configured for local development targeting Cloud SQL.
✅ **Docker PostgreSQL**: Configured for local development targeting Local DB (faster/offline).

✅ **Database Connectivity**: Tested and verified

⚠️ **Foreign Key Relationships**: NOT DEFINED - Tables exist but have no relational constraints

❌ **Seed Data**: Not loaded (optional)

**Model Files**: `/apps/api/app/models/` (14 files)
**Migration File**: `/apps/api/alembic/versions/f99bd1eb4948_initial_schema_with_14_tables.py`

**❗ ACTION REQUIRED**: Define foreign key relationships between tables before proceeding with backend API.

**Next Steps**:
1. User to specify foreign key relationships for all tables
2. Update models with ForeignKey constraints
3. Generate and apply relationship migration
4. Build backend API endpoints

---

### 0. Users (Authentication and Authorization)

> **Purpose:** User accounts for authentication and role-based access control.

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | Primary key | Integer | None |
| email | User email address (unique) | String | None |
| employee_id | Links to employee record | String | employees.staff_number |
| is_active | Account active status | Boolean | None |
| created_at | Account creation timestamp | DateTime | None |
| updated_at | Last update timestamp | DateTime | None |
| last_login | Last login timestamp | DateTime | None |

---

### 1. sales (Data Description Sales Vision - Sales.csv)

> **Purpose:** To look at the sales record to see the total revenue and performance of each staff.[1]

Only CEO can see this data

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| sale_num | Unique identifier for a sale, Primary Key | Integer | None |
| inventory_status | The inventory management system requires defining stock status as: sales, returns, internal use, broken, damage, missing | String | None |
| product_code | Unique product code for each product | String | Product.ProductCode |
| invoice_num | invoice number (given values from tax office). | String | None |
| sale_date | date of sale made (dd/mm/yy) | Date | None |
| quantity | Quantity of sold product | Integer | None |
| client_number | Unique client number for each client name | String | Client.ClientNumber |
| staff_number | staff number of employee managing this client | String | Employee.staff_number |
| unit_price | price of sale per unit | Decimal | products -> price list's unitcost |
| sale_amount | Total amount of sale = UnitSalePrice x Quantity | Decimal | None |
| payment_type | either cash, cheque, credit | String | None |
| payment_id | either cash_id, cheque_id, credit_id. Depends on payment_type. Need to comeback to this to discuss on how to add this column| ForeginKey | cash_id, cheque_id, credit_id |

### 2. credits (Data Description Sales Vision - Credit.csv)

> **Purpose:** To see if client paid for the product or not.[1] (Payment Type Table.)

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| credit_id | Primary Key | Integer | None |
| date | date of input dd/mm/yy | Date | None |
| client_number | Unique client number for each client name | String | Client.client_number |
| staff_number | staff number of employee managing this client | String | Employee.staff_number |
| payment_status | Status of payment: Credit -> Client took product and did not pay yet... Pay -> Client has paid for product | String | None |
| credit_amount | Amount that needs to be paid from client | Decimal | None |
| credit_payment_type | Categorical column: Cheque, Cash, SetOff, penalty, mix | String | None |
| credit_due_date | CreditPeriod (dd/mm/yy) | Date | None |
| sale_num | Specific refece to specific sale in sales table | Integer | sales.sale_num |

### 3. overdue_collection (Data Description Sales Vision - OverdueCollection.csv)

> **Purpose:** to show the overdue status to make action to collect.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | Primary Key | Integer | None |
| credit_id | Primary Key | Integer | credits.id |
| date | date of data input | Date | None |
| client_id | id of client | String | clients.client_id |
| staff_id | id of employee managing this client | String | employees.staff_id |
| credit_due_date | Date when client requested to pay back. | Date | None |
| credit_amount | Amount that needs to be paid from client | Integer | None |
| action | description of staff's attempt to get money from client | String | None |

### 4. clients (Data Description Sales Vision - Client.csv)

> **Purpose:** to establish a comprehensive client management protocol by accurately determining both the client's size/segment and our own company's sales scale, while also ensuring an accessible emergency contact system for immediate resolution.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| client_number | Unique client number for each client name | String | None |
| client_name | Name of client | String | None |
| client_category | industry of client: bus transpotation, garage, transportation, factory,vehicle rental,road contruction | String | None |
| client_grade | 3 different category: A, B, C where A is the biggest and C is the lowest | String | None |
| contact_name | Name of contact point | String | None |
| contact_position | position of contact point | String | None |
| contact_phone | phone number of contact point | String | None |
| contact_name2 | Name of 2nd contact point | String | None |
| contact_position2 | position of 2nd contact point | String | None |
| contact_phone2 | phone number of 2nd contact point | String | None |
| address | address of client | String | None |
| og_staff_id | id of original employee managing this client | String | employees.staff_number |
| current_staff_id | id of current employee managing this client | String | employees.staff_number |
| client_type | distingush the client type: Own develop clients or transfer client from others | String | None |
| average_amount | average amount of month sales | Decimal | None |
| yearly_amount | total sales amount of the previous year | Decimal | None |
| information | staff describe: number of commercial vehicle,product specification,quantity per month | String | None |

### 5. employees (Data Description Sales Vision - Employee.csv)

> **Purpose:** to clarify roles and activities to effectively integrate with the sales system.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| staff_number | unique id for each employee | String | user.employee_id |
| position | categorical variable showing either manager or staff | String | None |
| name | Name of employee (first_name last_name) | String | None |
| division | categorical variable showing either sales or internal work | String | None |
| working_start | first start date of employee | String (likely Date) | None |
| phone_number | call to employee to cummunicate | String | None |
| emergency_contact_name | name of emergency contact | String | None |
| emergency_contact_relationship | relationship of emergency contact | String | None |
| emergency_contact_number | phone number of emergency contact | String | None |
| whatsapp | text/call to employee to cummunicate | String | None |
| manager_id | staff_numer of manager managing this employee | String | self join to employees.staff_number |

### 6. commissions (Data Description Sales Vision - commission.csv)

> **Purpose:** to provide the commission to the staff depend on their sales,productclaaification and client type.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each commission | String | None |
| staff_number | unique id of staff | String | employees.staff_number |
| commission | according to sales, classification of products, client transfer calculation, and product type, company will provide commission | Decimal | Need Sales Table, products table, client table to calculate commission |


### 7. products (Data Description Sales Vision - Product.csv)

> **Purpose:** to set the appropriate product quantity and cost for every product name.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| product_code | Unique product code for each product | String | None |
| product_description | Description of code description | String | None |
| product_category | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String | None |
| unit_cost | cost of product for import produts or purchaisng cost when it buy it in local | Decimal | None |
| classification | where is from: import or local purchaising | String | None |
| credit_or_cash | when it buys locally, pay it in cash or credit | String | None |
| amount | amount of cash or credit | Decimal | None |
| upload_date | the cost can vary by date: dd/mm/yy | Date | None |

### 8. price_lists (Data Description Sales Vision - price list.csv)

> **Purpose:** To show the specific pricing for all available products, segmented by each client grade.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each price list | String | None |
| product_code | Unique product code for each product | String | products.product_code |
| client_number | Unique client number for each client name | String | clients.client_number |
| price | sellin price - according to client grade for each product name | Decimal | None |

### 9. Stocks (Data Description Sales Vision - Stock.csv)

> **Purpose:** to verify the current stock availability for new orders and to identify any discrepancies or missing inventory units.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| ID | unique id for each stock | String | None |
| product_code | Unique product code for each product | String | products.product_code |
| avg_sales_qty | average sales quantity per current month to estimate the order time | Decimal | Value from aggregated views of Sales table |
| avg_sales_price | average sales price per unit stock. | Decimal | None |
| stock_qty | number of items available in stock | Integer | None |
| check_date | dd/mm/yy date of stock input | Date | None |
| monthly_review_date | mostly check it monthly and report it (designated date) | Date | None |
| monthly_review_desc | mostly check it monthly and report it with description | String | None |
| stock_status | The inventory management system requires defining stock status as: sales, returns, internal use, broken, damage, missing | String | None |

### 10. monthly_sales_targets (Data Description Sales Vision - monthly sales target.csv)

> **Purpose:** to input sales target in the subject month.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| product_code | Unique product code for each product | String | products.product_code |
| staff_id | Name of employee managing this client | String | employees.staff_id |
| input_date | data inputed date for sales target | Date | None |
| target_date | sales amount target_date | Date | None |
| salesmonthlytarget | sales monthly target for the products and quantity in the subject Month which is choosen | Decimal | None |
| companytarget | company target for the subject month | Decimal | None |

### 11. expenditures (Data Description Sales Vision - expenditure.csv)

> **Purpose:** to display the total monthly expenditure, including the costs associated with locally purchased products.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each expenditure | String | None |
| date | date of data input (dd/mm/yy) | Date | None |
| payment_method | product purchaing method: Cash or Credit | String | None |
| payment_amount | product/expenditure cost | Decimal | None |
| product_code | Unique product code for each product | String | products.product_code |
| expenditure_description | salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax, douane fee,forwarder fee,other | String | None |
| receipt_availability | to prove the payment - yes or No | String | None |

### 12. cash_flows (Data Description Sales Vision - Cash.csv)

> **Purpose:** How much cash flow is generated from operations like sales , collections and others? [1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each cash flow | String | None |
| Date | date of data input (dd/mm/yy) | Date | None |
| client_name | Name of client | String | clients.client_name |
| staff_id | id of employee managing this client | String | employees.staff_id |
| cash_origin | payment from clients (sales), payment from collection of credit(collection), transfer from director, others ( sub rent) | String | None |
| cash_amount | total amount from sales and collection | Decimal | None |
| payment | purchaising the product locally and expenditure | String | None |
| payment_product | purchaising the product locally | Decimal | None |
| payment_expenditure | expenditure ( salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity,water,rental fee,other) | Decimal | None |
| weeklyreview | frequecy of report - weekly check the status(designated date) | String | None |

### 13. cheques (Data Description Sales Vision - Cheque.csv)

> **Purpose:** To monitor the cashing of a checque and, in the event of rejection, initiate follow-up procedures.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each cheque | String | None |
| receipt_date | date of data input (dd/mm/yy) | Date | None |
| due_date | dd/mm/yy due date of receipt | Date | None |
| client_id | id of client | String | clients.client_id |
| staff_id | id of employee managing this client | String | employees.staff_id |
| issue_bank | payment from clients (sales) payment from collection of credit(collection) | String | None |
| number_of_cheque | number of cheque issued by the bank | String | None |
| deposit_bank | company's bank for deposit (eco bank, bicici bank) | String | None |
| deposit_date | dd/mm/yy date of deposit | Date | None |
| cheque_amount | amount on the cheque | Decimal | None |
| approval_status | bank approval status ; approval, reject( re issue the cheque, cash pay, re-deposit)... | String | None |
| weekly_review | weekly check the status | String | None |



### Reference this:
https://dbdiagram.io/d/SalesVisionData-Model-691d3e936735e11170770c8f

# Dashboard Data Fix Summary

## Issues Fixed

### 1. **Hardcoded Mock Data** ✅
**Problem**: Dashboard was showing hardcoded data instead of pulling from Cloud SQL database.

**Solution**: 
- Created new `/analytics/summary` endpoint in FastAPI backend
- Endpoint queries real data from Cloud SQL:
  - `total_sales`: SUM of `sale_amount` from `sales` table
  - `active_clients`: COUNT of clients from `clients` table
  - `inventory_value`: Calculated from `stocks` table (stock_qty × unit_cost)
  - `commission_due`: SUM of commissions from `commissions` table

**Files Modified**:
- `apps/api/app/schemas/analytics.py` - Added `DashboardSummary` schema
- `apps/api/app/routers/analytics.py` - Added `/analytics/summary` endpoint
- `apps/web/src/app/(tables)/dashboard/page.tsx` - Updated to fetch from API

### 2. **Console "Not Found" Error** 🔍
**Likely Cause**: Missing favicon or asset file

**This is a minor issue** - Next.js is looking for a favicon that doesn't exist. This doesn't affect functionality but can be fixed by adding a `favicon.ico` to `/apps/web/public/`.

## Database Field Mappings Used

| Dashboard Stat | Database Query |
|---------------|----------------|
| **Total Sales** | `SUM(sales.sale_amount)` |
| **Active Clients** | `COUNT(clients.client_number)` |
| **Inventory Value** | `SUM(stocks.stock_qty × products.unit_cost)` |
| **Commission Due** | `SUM(commissions.commission)` |

## Testing

To verify the fix:

1. **Restart backend** (changes to analytics router):
   ```bash
   cd /Users/paulpark/SandBox/Sales\ Vision\ Project/apps/api
   # Kill current process and restart
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Frontend reloads automatically** (Next.js hot reload)

3. **Check dashboard** at `http://localhost:9002/dashboard`
   - Numbers should now reflect actual database contents
   - If database is empty, all values will show 0
   - If database has data, real sums/counts will display

4. **Verify in browser console**:
   - Open DevTools → Network tab
   - Look for successful `GET /api/analytics/summary/` request
   - Response should show real numbers from database

## Next Steps

If you want to populate test data to see non-zero values:
- Add sample sales records via `/sales/new`
- Add clients via `/customers/new`
- Add products and stock data

The dashboard will automatically update to show the latest data from Cloud SQL! 🎉


# Sales Vision Project - Claude Memory

## Communication Style
- Max concision. Drop grammar if needed.
- End plans with unresolved Q list. Ultra-concise format.
- Commit msgs: terse, no fluff.

## State Tracking Protocol
**CRITICAL**: Before ANY code changes:
1. Check relevant .md file in root (backendAPIPlan.md, frontEndLogic.md, DataPlan.md, databasedescption.md)
2. After changes: Update Current State section in that .md
3. Mark ✅/❌ status changes
4. Keep .md files as source of truth for module state

## Plan Files Reference Map & Edit Rules

make sure to update PROJECT_STATUS.md file as we go too.

### backendAPIPlan.md → `/backend` changes
**When to update**: Any change to `/backend` folder
**What to update**:
- Current State ✅/❌ checkboxes (endpoints added? DB connected? Auth working?)
- Phase completion status if full phase done
- Add new endpoints to relevant phase list
- Update dependency status (if new packages installed)

**Example**: Added `/api/v1/customers` GET endpoint
→ Update: "❌ No CRUD operations" → "✅ Customer read endpoint implemented"

---

### frontEndLogic.md → `/frontend` changes
**When to update**: Any change to `/frontend` folder
**What to update**:
- Page implementation status (if new page added/completed)
- Component library usage (if new Radix component used)
- Integration status (AI features, new API calls)
- Deployment status (if Cloud Run config changed)

**Example**: Added customer detail page with edit form
→ Update: Add to page inventory, mark edit functionality as ✅

---

### DataPlan.md → `/db/ui`, CSV/JSON pipeline
**When to update**: Changes to CSV files, JSON output, transformation scripts
**What to update**:
- CSV structure changes (new columns, format changes)
- JSON schema updates (new fields, nested objects)
- Pipeline script changes (transformation logic)
- Data validation rules added/modified

**Example**: Added `customer_lifetime_value` column to customers.csv
→ Update: CSV schema section, JSON output schema, transformation notes

---

### databasedescption.md → DB schema, migrations, models
**When to update**: SQLAlchemy models, Alembic migrations, DB structure
**What to update**:
- Table creation status (migration run? model defined?)
- Column additions/changes in models
- Relationship definitions (ForeignKey, backref)
- Migration history (new migration files)
- Index/constraint additions

**Example**: Created `customers` table with SQLAlchemy model + Alembic migration
→ Update: Mark customers table as ✅ implemented, add column list, note migration file name

## Current Architecture Reality
**Live**: Frontend on Cloud Run, static JSON, Genkit AI
**Not Built**: Backend logic, DB connections, migrations, Cloud SQL
**Docker**: Frontend image only (linux/amd64 in Artifact Registry)

## Workflow
1. User requests change
2. Identify affected .md file(s)
3. Read current state from .md
4. Make changes
5. Update .md Current State section
6. If unresolved Qs exist → list at end (concise, no grammar)

## Example Q Format
```
Unresolved Qs:
- Auth strategy? JWT vs session?
- Pagination limit default?
- CSV upload max size?
```


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


