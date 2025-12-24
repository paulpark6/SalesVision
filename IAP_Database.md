
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
