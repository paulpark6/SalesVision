# Data Agent Documentation

## 1. Role & Core Philosophy

**You are the Data Agent.** Your responsibility is the integrity, structure, and persistence of the Sales Vision data.

* **Source of Truth:** PostgreSQL (Cloud SQL in Prod, Docker in Dev).
* **Protocol:** Strict Referential Integrity. No orphaned records allowed.
* **Concurrency:** Optimistic Locking (Version Control) is required for all shared tables.
* **Diagram:** [SalesVision Data Model](https://dbdiagram.io/d/SalesVisionData-Model-691d3e936735e11170770c8f)

---

## 2. Current State & Infrastructure

✅ **Cloud SQL Instance**: `sales-Vision-db` (POSTGRES_15, us-central1)
✅ **Database**: `salesVision` created
✅ **Connection Name**: `youngintlsaleswebapp:us-central1:sales-Vision-db`
✅ **Secret Manager**: DATABASE_URL stored (version 1)
✅ **SQLAlchemy Models**: 14 models created
✅ **Alembic Migrations**: Initialized, migration generated and applied (f99bd1eb4948)
✅ **Schema Applied**: All 14 tables created successfully in Cloud SQL
✅ **Cloud SQL Proxy**: Configured for local development
✅ **Docker PostgreSQL**: Configured for local development

⚠️ **Action Required**: Define foreign key relationships between tables before proceeding with backend API.

---

## 3. Strict Foreign Key Rules (Ref List)

**Validation Mandate:** All writes must respect these 25 relationships.

**1. Core Sales Links**
* `sales.product_code` → `products.product_code`
* `sales.client_number` → `clients.client_number`
* `sales.staff_number` → `employees.staff_number`

**2. Payment Web**
* `credits.sale_num` → `sales.sale_num`
* `credits.client_number` → `clients.client_number`
* `credits.staff_number` → `employees.staff_number`
* `overdue_collections.credit_id` → `credits.credit_id`
* `overdue_collections.client_id` → `clients.client_number`
* `overdue_collections.staff_id` → `employees.staff_number`
* `cheques.client_id` → `clients.client_number`
* `cheques.staff_id` → `employees.staff_number`

**3. Hierarchy & Staff**
* `users.employee_id` → `employees.staff_number`
* `employees.manager_id` → `employees.staff_number` (Self-Ref)
* `commissions.staff_number` → `employees.staff_number`
* `clients.og_staff_id` → `employees.staff_number`
* `clients.current_staff_id` → `employees.staff_number`

**4. Catalog & Inventory**
* `stocks.product_code` → `products.product_code`
* `price_lists.product_code` → `products.product_code`
* `price_lists.client_num` → `clients.client_number`
* `monthly_sales_targets.product_code` → `products.product_code`
* `monthly_sales_targets.staff_id` → `employees.staff_number`
* `expenditures.product_code` → `products.product_code`

**5. Cash Flow**
* `cash_flows.client_name` → `clients.client_number`
* `cash_flows.staff_id` → `employees.staff_number`

---

## 4. Data Dictionary (Schema Definition)

### 0. Users (Authentication)
*Purpose: User accounts for authentication and role-based access control.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `id` | Integer | PK | |
| `email` | String | Unique, Not Null | |
| `employee_id` | String | Not Null | FK -> `employees.staff_number` |
| `role` | Enum | admin, manager, staff, viewer | |
| `is_active` | Boolean | Default: true | |
| `created_at` | Timestamp | | |
| `last_login` | Timestamp | | |

### 1. Employees (HR Master)
*Purpose: Clarify roles and activities to effectively integrate with the sales system.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `staff_number` | String | PK | |
| `manager_id` | String | Not Null | FK -> `employees.staff_number` |
| `position` | String | manager vs staff | |
| `name` | String | | |
| `division` | String | sales vs internal | |
| `working_start` | Date | | |
| `phone_number` | String | | |
| `emergency_contact_...` | String | Name, Relationship, Number | |

### 2. Clients (CRM Master)
*Purpose: Comprehensive client management, segmentation, and contact protocols.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `client_number` | String | PK | |
| `og_staff_id` | String | Not Null | FK -> `employees.staff_number` |
| `current_staff_id` | String | Not Null | FK -> `employees.staff_number` |
| `client_name` | String | Unique | |
| `client_grade` | String | A/B/C | |
| `client_category` | String | Industry type | |
| `average_amount` | Decimal | Monthly avg | |
| `yearly_amount` | Decimal | Previous year total | |
| `information` | Text | Descriptive info | |
| `contact_...` | String | Name, Position, Phone (1 & 2) | |
| `address` | String | | |

### 3. Products (Item Master)
*Purpose: Product catalog, costs, and classification.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `product_code` | String | PK | |
| `product_description` | String | | |
| `product_category` | String | Oil, Tire, Filter, Others | |
| `unit_cost` | Decimal | Import/Local cost | |
| `classification` | String | Import vs Local | |
| `credit_or_cash` | String | Buying method (Local) | |
| `amount` | Decimal | | |
| `upload_date` | Date | Cost versioning date | |

### 4. Sales (Core Data)
*Purpose: Central transaction record. Only CEO can see full views.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `sale_num` | Integer | PK, Increment | |
| `product_code` | String | Not Null | FK -> `products.product_code` |
| `client_number` | String | Not Null | FK -> `clients.client_number` |
| `staff_number` | String | | FK -> `employees.staff_number` |
| `sale_date` | Date | | |
| `quantity` | Integer | | |
| `unit_price` | Decimal | | |
| `sale_amount` | Decimal | | |
| `payment_type` | String | Cash, Cheque, Credit | |
| `inventory_status` | String | Sales, Returns, Damage, etc. | |
| `invoice_num` | String | Tax invoice number | |

### 5. Credits (Accounts Receivable)
*Purpose: Tracking deferred payments.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `credit_id` | Integer | PK, Increment | |
| `sale_num` | Integer | | FK -> `sales.sale_num` |
| `client_number` | String | Not Null | FK -> `clients.client_number` |
| `staff_number` | String | Not Null | FK -> `employees.staff_number` |
| `payment_status` | String | Credit (Pending) vs Pay (Done) | |
| `credit_amount` | Decimal | Amount to be paid | |
| `credit_due_date` | Date | | |
| `credit_payment_type` | String | Cheque, Cash, SetOff, etc. | |

### 6. Overdue Collections (Debt Recovery)
*Purpose: Action tracking for overdue payments.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `id` | String | PK | |
| `credit_id` | Integer | | FK -> `credits.credit_id` |
| `client_id` | String | Not Null | FK -> `clients.client_number` |
| `staff_id` | String | Not Null | FK -> `employees.staff_number` |
| `action` | Text | Collection attempt details | |

### 7. Commissions
*Purpose: Staff earnings calculation.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `id` | Integer | PK | |
| `staff_number` | String | Not Null | FK -> `employees.staff_number` |
| `commission` | Decimal | Calculated value | |

### 8. Stocks (Inventory)
*Purpose: Availability and discrepancies.*

| Column | Type | Details | Relationship |
|---|---|---|---|
| `id` | Integer | PK | |
| `product_code` | String | Unique | FK -> `products.product_code` |
| `stock_qty` | Integer | Physical count | |
| `stock_status` | String | | |
| `avg_sales_qty` | Decimal | For ordering estimates | |
| `check_date` | Date | | |

### 9. One-to-Many Config Tables

**Price Lists** (`price_lists`)
*   `product_code` (FK), `client_num` (FK), `price`.

**Monthly Sales Targets** (`monthly_sales_targets`)
*   `product_code` (FK), `staff_id` (FK), `sales_monthly_target`, `company_target`.

**Expenditures** (`expenditures`)
*   `product_code` (FK - Optional), `payment_amount`, `payment_method` (Cash/Credit), `expenditure_description`.

**Cash Flows** (`cash_flows`)
*   `client_name` (FK), `staff_id` (FK), `cash_origin` (Sales, Collection), `cash_amount`.

**Cheques** (`cheques`)
*   `client_id` (FK), `staff_id` (FK), `number_of_cheque` (Unique), `cheque_amount`, `approval_status`.

---

## 5. Advanced Logic & Business Rules

### A. Concurrency (Optimistic Locking)
*   **Mechanism:** Add `version` column to `products`, `clients`, `sales`, `stocks`.
*   **Logic:** `UPDATE ... SET version = version + 1 WHERE id = $id AND version = $current_version`.

### B. Aggregated Sales Logic
*   **Inventory:** Decrease `stocks.stock_qty` on Sale creation.
*   **Routing:**
    *   Cash -> `cash_flows`
    *   Credit -> `credits`
    *   Cheque -> `cheques`

### C. Commission Calculation (Deferred)
*   Run via scheduled job (nightly/monthly).
*   Dependent on: `sales`, `products.classification`, `clients.client_type`.

---

## 6. Migration & Seeding Strategy

### Seeding Order
1.  **Level 1 (Masters):** `employees` (Managers first!) → `products` → `clients`.
2.  **Level 2 (Auth):** `users` (Link to employees).
3.  **Level 3 (Config):** `price_lists`, `stocks`, `monthly_sales_targets`.
4.  **Level 4 (Transactions):** `sales`.
5.  **Level 5 (Downstream):** `credits`, `cheques`, `cash_flows`, `overdue_collections`.

### Schema Migration
*   **Command:** `alembic revision --autogenerate -m "apply_25_foreign_keys"`
*   **Rule:** Never edit models manually without generating a migration.
