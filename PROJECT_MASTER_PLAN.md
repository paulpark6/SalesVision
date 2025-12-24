# 📅 Sales Vision Project - Master Plan & Roadmap

**Goal**: Production-ready Sales Vision App by **February 1, 2025**.
**Executive Summary**: The project is currently ~40% complete. The Frontend is fully built and deployed. The critical remaining work is building the Backend API and Cloud SQL Database to replace the current static file system.

---

## 🚀 High-Level Status

| Component | Status | Progress | Key Insight |
|-----------|--------|----------|-------------|
| **Frontend** | ✅ COMPLETE | 100% | Deployed on Cloud Run. Fully functional UI with static data. |
| **Data Pipeline** | ✅ COMPLETE | 100% | CSV-to-JSON transformation working perfectly. |
| **Database** | ⚠️ PENDING | 15% | Tables created in Cloud SQL, but no relationships or data connections. |
| **Backend API** | ❌ NOT STARTED | 5% | Skeleton only. Needs 68+ endpoints implementing. |
| **Auth** | ⚠️ INSECURE | 30% | Client-side only. Needs Google IAP + Backend integration. |

---

## 🗓️ 8-Week Timeline (Roadmap)

### Phase 1: Foundation (Weeks 1-2)
**Focus**: Database & Basic Connectivity
*   [x] **Infrastructure**: Set up Cloud SQL & Cloud Run.
*   [ ] **Database**: Define Foreign Keys & Relationships in PostgreSQL.
*   [ ] **API**: Connect FastAPI to Database.
*   [ ] **Seed Data**: Migrate CSV data to PostgreSQL.

### Phase 2: Core Features (Weeks 3-4)
**Focus**: CRUD Operations (Create, Read, Update, Delete)
*   [ ] **Sales Module**: Create/Edit sales via API.
*   [ ] **Customers Module**: Manage customer data.
*   [ ] **Product Catalog**: Product & Pricing management.
*   [ ] **Integration**: Connect Frontend forms to Backend APIs.

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
*   **Status**: **PENDING**.
*   **Next**: Build API routers and connect to DB.

### Database
*   **Goal**: Hosted PostgreSQL on Cloud SQL.
*   **Status**: **PARTIAL**. (Instance exists, tables exist, but logic missing).
*   **Next**: Define relationships and migrate data.

### Authentication
*   **Goal**: Secure, identity-based access.
*   **Status**: **PARTIAL**. (Client-side mock auth).
*   **Next**: Migrate to Google IAP + Backend Session Management.

---

## 📚 Documentation Map

For detailed technical specifications, refer to:
*   **[PROJECT_DETAILED_STATUS.md](PROJECT_DETAILED_STATUS.md)**: Deep dive into schemas, API endpoints, logic, and gap analysis.
