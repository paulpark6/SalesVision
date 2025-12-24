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
