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
