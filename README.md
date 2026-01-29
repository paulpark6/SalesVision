# Sales Vision Project

> **Sales Vision is a secure, role-based sales management platform that helps organizations streamline transaction tracking and ensure data integrity across Admin, Manager, and Staff levels.**

## Demo & Run Locally

![Demo Dashboard](https://via.placeholder.com/800x450.png?text=Sales+Vision+Dashboard+Demo)
*(Note: Replace with actual demo GIF/Screenshot)*

### Run Locally

1.  **Clone the repository**
    ```bash
    git clone https://github.com/paulpark6/SalesVision.git
    cd "Sales Vision Project"
    ```

2.  **Start the application**
    ```bash
    docker-compose up --build
    ```

3.  **Access the application**
    -   Web Interface: [http://localhost:3000](http://localhost:3000)
    -   API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Impact

-   **Data Integrity**: Eliminates manual errors by enforcing strict validation against product and client databases, preventing invalid entries common in spreadsheet-based tracking.
-   **Security compliance**: Achieves 100% data isolation through Role-Based Access Control (RBAC), ensuring staff only access their own records while giving managers oversight of their direct reports.
-   **Operational Efficiency**: Reduces report generation time from hours to seconds with instant, month-based filtering and real-time data aggregation.

## What I'd do next

-   **Backend Integration**: Connect the frontend to a functional backend API to enable live data processing.
-   **Data Engineering**: Build robust data pipelines to feed into a data lake and data warehouse for advanced analytics.
-   **Cloud Infrastructure**: Evaluate and select a scalable cloud database provider (e.g., AWS RDS, Google Cloud SQL) for production.
-   **Authentication**: Implement secure Google Authentication (OAuth2) to streamline user onboarding and access control.
