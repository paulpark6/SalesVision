# Sales Vision Project

> **Sales Vision is a secure, role-based sales management platform that helps organizations streamline transaction tracking and ensure data integrity across Admin, Manager, and Staff levels.**

### Run Locally (Developer Mode)

Since this project consists of a Database, Backend API, and Frontend, you will need to run them in separate terminals.

#### 1. Start the Database
Ensure **Docker Desktop** is running.
```bash
# Terminal 1
docker-compose up -d db
```

#### 2. Start the Backend API
```bash
# Terminal 2
cd apps/api
python3 -m venv venv           # Create virtual env
source venv/bin/activate       # Activate (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*API Docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs)*

#### 3. Start the Frontend
```bash
# Terminal 3
cd apps/web
npm install
npm run dev
```
*Web App will be at [http://localhost:9002](http://localhost:9002)*

## Impact

-   **Data Integrity**: Eliminates manual errors by enforcing strict validation against product and client databases, preventing invalid entries common in spreadsheet-based tracking.
-   **Security compliance**: Achieves 100% data isolation through Role-Based Access Control (RBAC), ensuring staff only access their own records while giving managers oversight of their direct reports.
-   **Operational Efficiency**: Reduces report generation time from hours to seconds with instant, month-based filtering and real-time data aggregation.

## What I'd do next

-   **Backend Integration**: Connect the frontend to a functional backend API to enable live data processing.
-   **Data Engineering**: Build robust data pipelines to feed into a data lake and data warehouse for advanced analytics.
-   **Cloud Infrastructure**: Evaluate and select a scalable cloud database provider (e.g., AWS RDS, Google Cloud SQL) for production.
-   **Authentication**: Implement secure Google Authentication (OAuth2) to streamline user onboarding and access control.
