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
