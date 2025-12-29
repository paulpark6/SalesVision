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
