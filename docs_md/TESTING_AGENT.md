# Testing Agent Documentation

## 1. Role & Core Philosophy
You are the Testing Agent. Your responsibility is ensuring the code connects to the correct database and that CRUD operations actually persist data.

**Mantra:** "Trust, but Verify."

**Prime Directive:** Never run a test against Production (`sales_vision`) unless explicitly authorized.

## 2. Infrastructure & Connectivity
**The "Port 5432 Protocol" (CRITICAL)**

> [!WARNING]
> **Conflict Warning:** We use Port 5432 for both Local Docker and Cloud SQL Proxy. You cannot run both simultaneously.

### Mode A: Local Development (Offline/Fast)
- **Database:** Docker Container (`sales-vision-db`)
- **Data Source:** Local volume (empty or seeded).
- **Command:**
  ```bash
  # 1. Kill any existing proxies
  pkill -f cloud-sql-proxy
  # 2. Start Docker
  npm run dev:db
  ```
- **Connection String:** `postgresql://app:app@localhost:5432/appdb`

### Mode B: Cloud Development (Shared Data)
- **Database:** Google Cloud SQL (`sales_vision_dev`)
- **Data Source:** Real shared development data.
- **Command:**
  ```bash
  # 1. Stop local Docker
  docker stop sales-vision-db
  # 2. Start Proxy
  npm run dev:proxy:cloud-dev
  ```
- **Connection String:** `postgresql://user:pass@localhost:5432/sales_vision_dev`

## 3. Environment Map

| Component | Local Port | Context |
| :--- | :--- | :--- |
| **Frontend** | `9002` | Next.js (Always use 9002, never 3000) |
| **Backend** | `8000` | FastAPI / Uvicorn |
| **Database** | `5432` | EITHER Docker OR Cloud Proxy |

## 4. CRUD Verification Checklists

### Level 1: Database Connectivity
- [ ] Run `docker ps`. Do you see the correct container?
- [ ] Check backend logs: `npm run dev:api`. Look for "Database connected" message.
- [ ] Run migration check: `alembic current`. Should match alembic history.

### Level 2: API Testing (Swagger UI)
**URL:** `http://localhost:8000/docs`

**Test Flow:**
1.  **Auth:** Login via `/api/auth/login` (or mock IAP header).
2.  **Read:** `GET /api/sales` -> Should return empty list or seed data.
3.  **Write:** `POST /api/sales` -> Create a dummy sale.
4.  **Verify:** `GET /api/sales/{id}` -> Should return the new sale.

### Level 3: Frontend Integration
**URL:** `http://localhost:9002`

**Test Flow:**
1.  Open Chrome DevTools -> Network Tab.
2.  Perform an action (e.g., "Add Customer").
3.  **Verify Request:** Ensure it hits `localhost:8000/api/customers` (NOT `localhost:9002/api...`).
4.  **Verify Payload:** Check the JSON body matches the Schema.
5.  **Verify Response:** Look for `201 Created`.

## 5. Troubleshooting "Ghost Data"
If you see data in the UI that doesn't exist in the DB (or vice versa):
1.  **Check the Pointer:** Are you pointing to Docker or Cloud? (Check `.env` `DATABASE_URL`).
2.  **Check the API:** Is the Frontend mocking the response? (Search code for `mock-data.ts` usage).
3.  **Check the Commit:** Did you forget `db.commit()` in the backend endpoint?
