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
