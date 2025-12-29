# Database Planning & Implementation Guide

## Overview

SalesVision requires a PostgreSQL database to replace current CSV→JSON static data flow. No database infrastructure exists - must build from scratch: schema design, migrations, models, seed data, and Cloud SQL deployment.

**Current State:**
- ❌ No database (CSV files only)
- ❌ No Alembic migrations
- ❌ No SQLAlchemy models
- ❌ No database connection
- ✅ 13 tables documented in `databasedescription.md`
- ✅ CSV sample data exists (`db/csv/`)

**Target State:**
- Cloud SQL PostgreSQL (production)
- Docker PostgreSQL (local dev)
- Alembic migrations (version control)
- SQLAlchemy async models
- Automated backups
- Audit logging

---

## Database Schema Design

### 13-Table Architecture

Based on `databasedescription.md`, the system requires 13 core tables + 2 auth tables:

```
Core Business Tables:
├── users (employees + auth)
├── clients (customers)
├── products (catalog)
├── price_lists (tiered pricing)
├── sales (transactions)
├── credit_transactions (payment tracking)
├── overdue_collections (collection efforts)
├── check_payments (check tracking)
├── inventory (stock levels)
├── sales_targets (quotas)
├── commissions (employee earnings)
├── expenditures (expenses)
└── cash_flows (cash tracking)

Authentication Tables:
├── sessions (IAP sessions)
└── audit_log (change tracking)
```

---

### Table 1: users (Employees + Authentication)

**Purpose:** User accounts with IAP integration + employee data

**Schema:**
```sql
CREATE TABLE users (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_number VARCHAR(50) UNIQUE NOT NULL,
    iap_sub VARCHAR(255) UNIQUE,  -- Google IAP subject ID
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,

    -- Role & Access
    role VARCHAR(50) NOT NULL,  -- 'admin', 'manager', 'employee'
    position VARCHAR(50) NOT NULL,  -- Display position
    division VARCHAR(50),  -- 'sales', 'internal work'
    manager_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,

    -- Contact Info
    phone_number VARCHAR(50),
    whatsapp VARCHAR(50),
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),

    -- Employment
    working_start DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_staff_number ON users(staff_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_iap_sub ON users(iap_sub);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_active ON users(is_active);

-- Constraints
ALTER TABLE users
    ADD CONSTRAINT chk_role CHECK (role IN ('admin', 'manager', 'employee')),
    ADD CONSTRAINT chk_division CHECK (division IN ('sales', 'internal work') OR division IS NULL);
```

**Key Fields:**
- `staff_number` - Login ID (from CSV)
- `iap_sub` - Google IAP user identifier (for IAP migration)
- `role` - Internal role for authorization (admin/manager/employee)
- `position` - Display position (Director, Manager, Staff)
- `manager_id` - Self-referencing FK for hierarchy

**Sample Data:**
```sql
INSERT INTO users (staff_number, email, name, role, position, division, manager_id) VALUES
('owner', 'ceo@company.com', 'John Doe', 'admin', 'Director', 'sales', NULL),
('mgr-001', 'manager@company.com', 'Alex Ray', 'manager', 'Manager', 'sales', (SELECT id FROM users WHERE staff_number = 'owner')),
('emp-001', 'employee@company.com', 'Jane Smith', 'employee', 'Staff', 'sales', (SELECT id FROM users WHERE staff_number = 'mgr-001'));
```

---

### Table 2: clients (Customer Master Data)

**Purpose:** Comprehensive customer management with hierarchy

**Schema:**
```sql
CREATE TABLE clients (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,

    -- Classification
    client_grade VARCHAR(10) NOT NULL,  -- 'A', 'B', 'C', 'enduser'
    client_category VARCHAR(100),  -- Industry: bus, garage, factory, etc.
    client_type VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'own', 'transfer', 'pending'

    -- Account Management
    account_owner_id UUID NOT NULL REFERENCES users(id),
    is_blocked BOOLEAN DEFAULT false,
    block_reason TEXT,

    -- Primary Contact
    contact_name VARCHAR(255),
    contact_position VARCHAR(100),
    contact_phone VARCHAR(50),

    -- Secondary Contact
    contact_name_2 VARCHAR(255),
    contact_position_2 VARCHAR(100),
    contact_phone_2 VARCHAR(50),

    -- Location
    address TEXT,

    -- Business Intelligence
    average_monthly_sales DECIMAL(15, 2),
    previous_year_total DECIMAL(15, 2),
    company_info TEXT,  -- Fleet size, product needs, monthly volume

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_clients_number ON clients(client_number);
CREATE INDEX idx_clients_name ON clients(client_name);
CREATE INDEX idx_clients_owner ON clients(account_owner_id);
CREATE INDEX idx_clients_grade ON clients(client_grade);
CREATE INDEX idx_clients_type ON clients(client_type);
CREATE INDEX idx_clients_category ON clients(client_category);
CREATE INDEX idx_clients_blocked ON clients(is_blocked);

-- Constraints
ALTER TABLE clients
    ADD CONSTRAINT chk_client_grade CHECK (client_grade IN ('A', 'B', 'C', 'enduser')),
    ADD CONSTRAINT chk_client_type CHECK (client_type IN ('own', 'transfer', 'pending'));
```

**Key Features:**
- **Client grading (A/B/C)** - Determines pricing tier
- **Client type** - Own developed vs transferred from others (affects commission)
- **Pending approval** - New clients require manager approval
- **Dual contacts** - Primary and backup contact persons

---

### Table 3: products (Product Catalog)

**Purpose:** Product catalog with cost tracking

**Schema:**
```sql
CREATE TABLE products (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_description TEXT NOT NULL,

    -- Classification
    product_category VARCHAR(100) NOT NULL,  -- 'Oil', 'Tire', 'Filter', 'Others'
    classification VARCHAR(50) NOT NULL,  -- 'import', 'local'

    -- Cost Information
    unit_cost DECIMAL(15, 2),
    cost_upload_date DATE,

    -- Purchase Details (for local products)
    purchase_payment_type VARCHAR(50),  -- 'cash', 'credit'
    credit_amount DECIMAL(15, 2),

    -- Status
    is_active BOOLEAN DEFAULT true,
    discontinuation_reason TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_category ON products(product_category);
CREATE INDEX idx_products_classification ON products(classification);
CREATE INDEX idx_products_active ON products(is_active);

-- Constraints
ALTER TABLE products
    ADD CONSTRAINT chk_product_classification CHECK (classification IN ('import', 'local')),
    ADD CONSTRAINT chk_purchase_payment CHECK (
        purchase_payment_type IN ('cash', 'credit', 'mix') OR purchase_payment_type IS NULL
    );
```

**Classification Impact:**
- **Import products**: 5% commission until 2M CFA, then 3%
- **Local products**: Commission based on profit margin %

---

### Table 4: price_lists (Tiered Pricing)

**Purpose:** Client-grade-specific pricing

**Schema:**
```sql
CREATE TABLE price_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    client_grade VARCHAR(10) NOT NULL,  -- 'A', 'B', 'C', 'enduser'
    price DECIMAL(15, 2) NOT NULL,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one active price per product-grade combination
    UNIQUE(product_id, client_grade, effective_date)
);

-- Indexes
CREATE INDEX idx_price_lists_product ON price_lists(product_id);
CREATE INDEX idx_price_lists_grade ON price_lists(client_grade);
CREATE INDEX idx_price_lists_effective ON price_lists(effective_date);

-- Constraints
ALTER TABLE price_lists
    ADD CONSTRAINT chk_price_grade CHECK (client_grade IN ('A', 'B', 'C', 'enduser')),
    ADD CONSTRAINT chk_price_positive CHECK (price > 0),
    ADD CONSTRAINT chk_price_dates CHECK (expiry_date IS NULL OR expiry_date > effective_date);
```

**Usage:**
- Query active price for product + client grade
- Track price history via effective_date
- Bulk update prices by grade

---

### Table 5: sales (Transaction Records)

**Purpose:** Core sales transaction tracking

**Schema:**
```sql
CREATE TABLE sales (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100),
    sale_date DATE NOT NULL,

    -- Inventory Action
    inventory_action VARCHAR(50) NOT NULL DEFAULT 'sale',
    -- 'sale', 'return', 'internal_use', 'broken', 'damaged', 'missing'

    -- Relationships
    product_id UUID NOT NULL REFERENCES products(id),
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Transaction Details
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,

    -- Payment Breakdown
    payment_type VARCHAR(50) NOT NULL,  -- 'cash', 'credit', 'check', 'prepayment', 'mixed-*'
    cash_amount DECIMAL(15, 2) DEFAULT 0,
    credit_amount DECIMAL(15, 2) DEFAULT 0,
    check_amount DECIMAL(15, 2) DEFAULT 0,
    prepayment_amount DECIMAL(15, 2) DEFAULT 0,

    -- Special Discount Approval (if price below standard)
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP,
    approval_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_invoice ON sales(invoice_number);
CREATE INDEX idx_sales_client ON sales(client_id);
CREATE INDEX idx_sales_employee ON sales(employee_id);
CREATE INDEX idx_sales_product ON sales(product_id);
CREATE INDEX idx_sales_payment_type ON sales(payment_type);
CREATE INDEX idx_sales_action ON sales(inventory_action);

-- Constraints
ALTER TABLE sales
    ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    ADD CONSTRAINT chk_unit_price_positive CHECK (unit_price > 0),
    ADD CONSTRAINT chk_total_amount_positive CHECK (total_amount > 0),
    ADD CONSTRAINT chk_sale_date_not_future CHECK (sale_date <= CURRENT_DATE),
    ADD CONSTRAINT chk_payment_sum CHECK (
        cash_amount + credit_amount + check_amount + prepayment_amount = total_amount
    );
```

**Key Features:**
- **Mixed payment types** - One sale can have cash + credit + check
- **Inventory actions** - Track sales, returns, damage, etc.
- **Approval workflow** - Special discounts require manager approval

---

### Table 6: credit_transactions (Payment Tracking)

**Purpose:** Track credit sales and payment status

**Schema:**
```sql
CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Sale
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Credit Details
    transaction_date DATE NOT NULL,
    credit_amount DECIMAL(15, 2) NOT NULL,
    credit_due_date DATE NOT NULL,

    -- Payment Status
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'partial', 'paid', 'overdue'
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    paid_date DATE,

    -- Payment Method When Settled
    credit_payment_type VARCHAR(50),  -- 'cash', 'check', 'setoff', 'penalty', 'mix'

    -- Notes
    payment_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_credit_client ON credit_transactions(client_id);
CREATE INDEX idx_credit_employee ON credit_transactions(employee_id);
CREATE INDEX idx_credit_status ON credit_transactions(payment_status);
CREATE INDEX idx_credit_due_date ON credit_transactions(credit_due_date);
CREATE INDEX idx_credit_transaction_date ON credit_transactions(transaction_date);

-- Constraints
ALTER TABLE credit_transactions
    ADD CONSTRAINT chk_credit_amount_positive CHECK (credit_amount > 0),
    ADD CONSTRAINT chk_paid_amount_valid CHECK (paid_amount >= 0 AND paid_amount <= credit_amount),
    ADD CONSTRAINT chk_payment_status CHECK (
        payment_status IN ('pending', 'partial', 'paid', 'overdue', 'written_off')
    );
```

**Status Transitions:**
```
pending → partial → paid
   ↓
overdue → written_off (optional)
```

---

### Table 7: overdue_collections (Collection Efforts)

**Purpose:** Track overdue payment collection actions

**Schema:**
```sql
CREATE TABLE overdue_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Credit Transaction
    credit_transaction_id UUID NOT NULL REFERENCES credit_transactions(id) ON DELETE CASCADE,

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Collection Details
    collection_date DATE NOT NULL,
    overdue_amount DECIMAL(15, 2) NOT NULL,
    credit_period_days INTEGER,
    days_overdue INTEGER,

    -- Action Taken
    collection_action TEXT NOT NULL,  -- Staff describes actions (Saturday reports)
    follow_up_required BOOLEAN DEFAULT true,
    next_follow_up_date DATE,

    -- Resolution
    resolved BOOLEAN DEFAULT false,
    resolution_date DATE,
    resolution_notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_overdue_client ON overdue_collections(client_id);
CREATE INDEX idx_overdue_employee ON overdue_collections(employee_id);
CREATE INDEX idx_overdue_date ON overdue_collections(collection_date);
CREATE INDEX idx_overdue_credit_tx ON overdue_collections(credit_transaction_id);
CREATE INDEX idx_overdue_follow_up ON overdue_collections(follow_up_required);
CREATE INDEX idx_overdue_resolved ON overdue_collections(resolved);
```

**Saturday Reports:**
Staff submit weekly collection actions - who they called, promises made, excuses given, next steps.

---

### Table 8: check_payments (Check Tracking)

**Purpose:** Monitor check payments and bank approvals

**Schema:**
```sql
CREATE TABLE check_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Related Transactions
    sale_id UUID REFERENCES sales(id),
    credit_transaction_id UUID REFERENCES credit_transactions(id),

    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id),
    employee_id UUID NOT NULL REFERENCES users(id),

    -- Check Details
    receipt_date DATE NOT NULL,
    due_date DATE NOT NULL,
    issuing_bank VARCHAR(255) NOT NULL,
    check_number VARCHAR(100) NOT NULL,
    check_amount DECIMAL(15, 2) NOT NULL,

    -- Deposit Details
    deposit_bank VARCHAR(255),  -- 'eco bank', 'bicici bank'
    deposit_date DATE,

    -- Bank Approval
    approval_status VARCHAR(50) NOT NULL DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
    approval_date DATE,

    -- If Rejected
    rejection_reason VARCHAR(50),  -- 'reissue', 'cash_pay', 'redeposit'
    reissued_check_id UUID REFERENCES check_payments(id),

    -- Notes
    notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_checks_client ON check_payments(client_id);
CREATE INDEX idx_checks_status ON check_payments(approval_status);
CREATE INDEX idx_checks_due_date ON check_payments(due_date);
CREATE INDEX idx_checks_deposit_date ON check_payments(deposit_date);
CREATE INDEX idx_checks_number ON check_payments(check_number);

-- Constraints
ALTER TABLE check_payments
    ADD CONSTRAINT chk_check_amount_positive CHECK (check_amount > 0),
    ADD CONSTRAINT chk_check_status CHECK (
        approval_status IN ('pending', 'approved', 'rejected', 'bounced')
    ),
    ADD CONSTRAINT chk_due_after_receipt CHECK (due_date >= receipt_date);
```

**Workflow:**
1. Check received → Create record (pending)
2. Deposited → Update deposit_date
3. Bank clears → approval_status = 'approved'
4. Bank rejects → approval_status = 'rejected', specify reason

---

### Table 9: inventory (Stock Management)

**Purpose:** Track product stock levels and reorder points

**Schema:**
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(id),

    -- Stock Levels
    stock_quantity DECIMAL(15, 2) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(15, 2) DEFAULT 0,  -- For pending orders
    available_quantity DECIMAL(15, 2) GENERATED ALWAYS AS (stock_quantity - reserved_quantity) STORED,

    -- Reorder Intelligence
    average_sales_quantity DECIMAL(15, 2),  -- Monthly average
    duration_period DECIMAL(10, 2),  -- stock / avg sales (months of supply)
    reorder_level DECIMAL(15, 2) DEFAULT 20,
    reorder_quantity DECIMAL(15, 2),

    -- Tracking
    last_check_date DATE,
    last_reorder_date DATE,
    monthly_review_schedule VARCHAR(100),  -- "First Monday", "15th", etc.

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_low_stock ON inventory(available_quantity)
    WHERE available_quantity <= reorder_level;
CREATE INDEX idx_inventory_check_date ON inventory(last_check_date);

-- Constraints
ALTER TABLE inventory
    ADD CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0),
    ADD CONSTRAINT chk_reserved_non_negative CHECK (reserved_quantity >= 0),
    ADD CONSTRAINT chk_reorder_level_positive CHECK (reorder_level > 0);
```

**Auto-calculated Fields:**
- `available_quantity` = stock - reserved
- `duration_period` = stock / monthly average

**Low Stock Alert:**
```sql
SELECT p.product_code, p.product_description, i.available_quantity, i.reorder_level
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.available_quantity <= i.reorder_level;
```

---

### Table 10: sales_targets (Sales Quotas)

**Purpose:** Set and track employee sales targets

**Schema:**
```sql
CREATE TABLE sales_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    employee_id UUID NOT NULL REFERENCES users(id),
    product_id UUID REFERENCES products(id),  -- NULL = overall target

    -- Target Period
    target_month DATE NOT NULL,  -- First day of month (e.g., 2025-01-01)

    -- Target Amounts
    monthly_target DECIMAL(15, 2) NOT NULL,
    company_yearly_target DECIMAL(15, 2),  -- Divided by 12

    -- Historical Context
    sales_3_months_ago DECIMAL(15, 2),
    sales_2_months_ago DECIMAL(15, 2),
    sales_1_month_ago DECIMAL(15, 2),

    -- Progress Tracking
    current_month_sales DECIMAL(15, 2) DEFAULT 0,
    achievement_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE WHEN monthly_target > 0
        THEN (current_month_sales / monthly_target * 100)
        ELSE 0 END
    ) STORED,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One target per employee-product-month
    UNIQUE(employee_id, product_id, target_month)
);

-- Indexes
CREATE INDEX idx_targets_employee ON sales_targets(employee_id);
CREATE INDEX idx_targets_month ON sales_targets(target_month);
CREATE INDEX idx_targets_product ON sales_targets(product_id);

-- Constraints
ALTER TABLE sales_targets
    ADD CONSTRAINT chk_target_positive CHECK (monthly_target > 0);
```

**Target Setting:**
- Company sets yearly targets
- Divide by 12 for monthly
- Consider historical performance (last 3 months)
- Can set overall target (product_id = NULL) or product-specific

---

### Table 11: commissions (Employee Earnings)

**Purpose:** Calculate and track employee commissions

**Schema:**
```sql
CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Employee
    employee_id UUID NOT NULL REFERENCES users(id),
    calculation_month DATE NOT NULL,  -- First day of month

    -- Employee Context
    position VARCHAR(50) NOT NULL,
    division VARCHAR(50),

    -- Commission Breakdown
    total_commission DECIMAL(15, 2) DEFAULT 0,
    import_product_commission DECIMAL(15, 2) DEFAULT 0,
    local_product_commission DECIMAL(15, 2) DEFAULT 0,
    transfer_client_commission DECIMAL(15, 2) DEFAULT 0,

    -- Calculation Details (JSON for transparency)
    calculation_details JSONB,  -- Store breakdown by sale

    -- Review & Approval
    monthly_review_notes TEXT,
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- One commission record per employee-month
    UNIQUE(employee_id, calculation_month)
);

-- Indexes
CREATE INDEX idx_commissions_employee ON commissions(employee_id);
CREATE INDEX idx_commissions_month ON commissions(calculation_month);
CREATE INDEX idx_commissions_approved ON commissions(approved);

-- Constraints
ALTER TABLE commissions
    ADD CONSTRAINT chk_commission_non_negative CHECK (total_commission >= 0);
```

**Commission Rules:**
- **Import products**: 5% until 2M CFA, then 3%
- **Local products**: Based on margin % = (selling - cost) / selling
- **Transfer clients import**: 1%
- **Transfer clients local**: 50% of margin commission

---

### Table 12: expenditures (Business Expenses)

**Purpose:** Track all operating expenses

**Schema:**
```sql
CREATE TABLE expenditures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction Details
    expenditure_date DATE NOT NULL,
    payment_way VARCHAR(100) NOT NULL,  -- 'product purchasing', 'expenditure'

    -- Related Product (if applicable)
    product_id UUID REFERENCES products(id),

    -- Expense Details
    expenditure_category VARCHAR(100) NOT NULL,
    -- 'salary', 'delivery_cost', 'fuel', 'car_repair', 'electricity',
    -- 'water', 'rental_fee', 'cnps', 'import_tax', 'douane_fee',
    -- 'forwarder_fee', 'other'

    cost DECIMAL(15, 2) NOT NULL,

    -- Documentation
    receipt_available BOOLEAN DEFAULT false,
    receipt_file_url TEXT,

    -- Notes
    notes TEXT,

    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expenditures_date ON expenditures(expenditure_date);
CREATE INDEX idx_expenditures_category ON expenditures(expenditure_category);
CREATE INDEX idx_expenditures_product ON expenditures(product_id);
CREATE INDEX idx_expenditures_created_by ON expenditures(created_by);

-- Constraints
ALTER TABLE expenditures
    ADD CONSTRAINT chk_cost_positive CHECK (cost > 0);
```

**Categories:**
- **Salary** - Employee wages
- **Delivery cost** - Shipping to customers
- **Fuel** - Company vehicles
- **Rental fee** - Office rent
- **CNPS** - Social security contributions
- **Import tax, douane fee, forwarder fee** - Import costs

---

### Table 13: cash_flows (Cash Tracking)

**Purpose:** Monitor all cash inflows and outflows

**Schema:**
```sql
CREATE TABLE cash_flows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction Details
    transaction_date DATE NOT NULL,
    flow_type VARCHAR(50) NOT NULL,  -- 'inflow', 'outflow'

    -- Relationships
    client_id UUID REFERENCES clients(id),
    employee_id UUID REFERENCES users(id),

    -- Inflow Details
    cash_origin VARCHAR(100),  -- 'sales', 'collection', 'director_transfer', 'sub_rent'
    cash_inflow DECIMAL(15, 2) DEFAULT 0,

    -- Outflow Details
    payment_type VARCHAR(100),  -- 'product_purchase', 'expenditure'
    product_payment DECIMAL(15, 2) DEFAULT 0,
    expenditure_payment DECIMAL(15, 2) DEFAULT 0,

    -- Running Balance (can be calculated or stored)
    running_balance DECIMAL(15, 2),

    -- Review Schedule
    weekly_review_schedule VARCHAR(100),  -- "Every Saturday", etc.

    -- Notes
    notes TEXT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_cash_flows_date ON cash_flows(transaction_date);
CREATE INDEX idx_cash_flows_type ON cash_flows(flow_type);
CREATE INDEX idx_cash_flows_client ON cash_flows(client_id);
CREATE INDEX idx_cash_flows_employee ON cash_flows(employee_id);

-- Constraints
ALTER TABLE cash_flows
    ADD CONSTRAINT chk_flow_type CHECK (flow_type IN ('inflow', 'outflow')),
    ADD CONSTRAINT chk_inflow_or_outflow CHECK (
        (flow_type = 'inflow' AND cash_inflow > 0) OR
        (flow_type = 'outflow' AND (product_payment + expenditure_payment) > 0)
    );
```

**Weekly Review:**
Finance team reviews cash position every week, reconciles against bank statements.

---

### Table 14: sessions (IAP Session Management)

**Purpose:** Track active user sessions with IAP tokens

**Schema:**
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Session Details
    iap_token_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,

    -- Session Lifecycle
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Session State
    last_page_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,

    -- Client Info
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Logout
    logged_out_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_active ON sessions(is_active);

-- Auto-cleanup expired sessions
CREATE INDEX idx_sessions_cleanup ON sessions(expires_at)
    WHERE is_active = true;
```

**Session Timeout:** 5 hours (configurable in IAP settings)

---

### Table 15: audit_log (Change Tracking)

**Purpose:** Permanent record of all data modifications

**Schema:**
```sql
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Who
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50),

    -- What
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,  -- 'INSERT', 'UPDATE', 'DELETE'

    -- Changes
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],  -- Array of field names that changed

    -- When & Where
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,

    -- Context
    request_id VARCHAR(100),
    endpoint VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_audit_table ON audit_log(table_name);
CREATE INDEX idx_audit_record ON audit_log(record_id);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_log(action);

-- Partitioning by month (optional, for large-scale)
-- CREATE TABLE audit_log_2025_01 PARTITION OF audit_log
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

**Never delete audit logs** - permanent compliance record.

---

## Foreign Key Relationships

### Entity Relationship Diagram

```
                    users (employees)
                      │
        ┌─────────────┼─────────────────────────┐
        │             │                         │
        ▼             ▼                         ▼
     clients       sales                  commissions
        │             │                         │
        ├──> sales    ├──> credit_transactions  │
        │             │         │                │
        │             │         └──> overdue_collections
        │             │         │
        │             │         └──> check_payments
        │             │
        │             └──> inventory (via products)
        │
        └──> cash_flows


    products
        │
        ├──> price_lists
        ├──> sales
        ├──> inventory
        ├──> sales_targets
        └──> expenditures (optional)
```

### Referential Integrity Rules

**Cascade Deletes:**
- `price_lists` → `products` (ON DELETE CASCADE)
- `sales` → `credit_transactions` (ON DELETE CASCADE)
- `credit_transactions` → `overdue_collections` (ON DELETE CASCADE)

**Restrict Deletes:**
- `users` → `sales` (ON DELETE RESTRICT - cannot delete user with sales)
- `clients` → `sales` (ON DELETE RESTRICT - cannot delete client with sales)
- `products` → `sales` (ON DELETE RESTRICT - cannot delete product with sales)

**Set Null:**
- `users.manager_id` → `users.id` (ON DELETE SET NULL - keep orphaned employees)

---

## Data Migration Strategy

### Phase 1: CSV to PostgreSQL Seed Data

**Transformation Script:** `db/migrations/seed_data.py`

```python
import pandas as pd
import asyncpg
import asyncio
from pathlib import Path

async def migrate_csv_to_postgres():
    conn = await asyncpg.connect(
        host='localhost',
        port=5432,
        user='app',
        password='app',
        database='appdb'
    )

    # 1. Migrate Employees First (no dependencies)
    employees_df = pd.read_csv('db/csv/employees/employees.csv')
    for _, row in employees_df.iterrows():
        await conn.execute('''
            INSERT INTO users (staff_number, name, position, division, phone_number)
            VALUES ($1, $2, $3, $4, $5)
        ''', row['value'], row['name'], row['role'], 'sales', '')

    # 2. Migrate Clients (depends on users)
    customers_df = pd.read_csv('db/csv/customers/customers.csv')
    for _, row in customers_df.iterrows():
        owner_id = await conn.fetchval('''
            SELECT id FROM users WHERE name = $1
        ''', row.get('Staff', 'Owner'))

        await conn.execute('''
            INSERT INTO clients (client_number, client_name, client_grade, account_owner_id)
            VALUES ($1, $2, $3, $4)
        ''', row['value'], row['label'], row.get('grade', 'C'), owner_id)

    # 3. Migrate Products
    products_df = pd.read_csv('db/csv/inventory/products.csv')
    for _, row in products_df.iterrows():
        await conn.execute('''
            INSERT INTO products (product_code, product_description, product_category, classification)
            VALUES ($1, $2, $3, $4)
        ''', row['value'], row['label'], 'Others', 'import')

    # 4. Migrate Sales (depends on users, clients, products)
    # ... similar pattern

    await conn.close()

asyncio.run(migrate_csv_to_postgres())
```

### Phase 2: Data Validation

**Validation Checks:**
```sql
-- Check referential integrity
SELECT 'Orphaned sales' AS issue, COUNT(*)
FROM sales s
LEFT JOIN users u ON s.employee_id = u.id
WHERE u.id IS NULL;

-- Check data quality
SELECT 'Negative quantities' AS issue, COUNT(*)
FROM sales
WHERE quantity <= 0;

-- Check duplicates
SELECT client_number, COUNT(*)
FROM clients
GROUP BY client_number
HAVING COUNT(*) > 1;
```

---

## Alembic Setup & Migrations

### Initialize Alembic

```bash
cd apps/api
alembic init alembic
```

**Configure `alembic.ini`:**
```ini
sqlalchemy.url = postgresql+asyncpg://app:app@localhost:5432/appdb
```

**Update `alembic/env.py`:**
```python
from app.db.base import Base
from app.models import *  # Import all models

target_metadata = Base.metadata

# Use async engine
from sqlalchemy.ext.asyncio import create_async_engine
config.get_main_option("sqlalchemy.url")
```

### Create Initial Migration

```bash
# Auto-generate migration from models
alembic revision --autogenerate -m "Initial schema with 15 tables"

# Review generated migration in alembic/versions/
# Edit if needed

# Apply migration
alembic upgrade head
```

### Migration Workflow

```bash
# Create new migration
alembic revision -m "Add column to sales table"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View history
alembic history

# View current version
alembic current
```

---

## SQLAlchemy Models Structure

### Model File Organization

```
apps/api/app/models/
├── __init__.py          # Import all models
├── base.py              # Base class with common fields
├── user.py              # User model
├── client.py            # Client model
├── product.py           # Product model
├── price_list.py        # PriceList model
├── sale.py              # Sale model
├── credit.py            # CreditTransaction model
├── overdue.py           # OverdueCollection model
├── check.py             # CheckPayment model
├── inventory.py         # Inventory model
├── target.py            # SalesTarget model
├── commission.py        # Commission model
├── expenditure.py       # Expenditure model
├── cash_flow.py         # CashFlow model
├── session.py           # Session model
└── audit.py             # AuditLog model
```

### Base Model

**File:** `apps/api/app/models/base.py`
```python
from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class TimestampMixin:
    """Mixin for created_at and updated_at timestamps"""
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class UUIDMixin:
    """Mixin for UUID primary key"""
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
```

### Example: User Model

**File:** `apps/api/app/models/user.py`
```python
from sqlalchemy import Column, String, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, TimestampMixin, UUIDMixin

class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    # Identity
    staff_number = Column(String(50), unique=True, nullable=False, index=True)
    iap_sub = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255), nullable=False)

    # Role & Access
    role = Column(String(50), nullable=False, index=True)
    position = Column(String(50), nullable=False)
    division = Column(String(50))
    manager_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), index=True)
    is_active = Column(Boolean, default=True, index=True)

    # Contact
    phone_number = Column(String(50))
    whatsapp = Column(String(50))
    emergency_contact = Column(String(255))
    emergency_phone = Column(String(50))

    # Employment
    working_start = Column(Date)
    last_login = Column(DateTime)

    # Relationships
    manager = relationship("User", remote_side="User.id", backref="team_members")
    clients = relationship("Client", back_populates="account_owner", foreign_keys="[Client.account_owner_id]")
    sales = relationship("Sale", back_populates="employee", foreign_keys="[Sale.employee_id]")
    commissions = relationship("Commission", back_populates="employee")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
```

### Example: Sale Model

**File:** `apps/api/app/models/sale.py`
```python
from sqlalchemy import Column, String, Integer, Date, ForeignKey, Boolean, DateTime, CheckConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .base import Base, UUIDMixin, TimestampMixin

class Sale(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sales"

    # Transaction Details
    invoice_number = Column(String(100), index=True)
    sale_date = Column(Date, nullable=False, index=True)
    inventory_action = Column(String(50), nullable=False, default='sale', index=True)

    # Foreign Keys
    product_id = Column(UUID(as_uuid=True), ForeignKey('products.id'), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey('clients.id'), nullable=False, index=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)

    # Transaction Amounts
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(15, 2), nullable=False)
    total_amount = Column(Numeric(15, 2), nullable=False)

    # Payment Breakdown
    payment_type = Column(String(50), nullable=False, index=True)
    cash_amount = Column(Numeric(15, 2), default=0)
    credit_amount = Column(Numeric(15, 2), default=0)
    check_amount = Column(Numeric(15, 2), default=0)
    prepayment_amount = Column(Numeric(15, 2), default=0)

    # Approval
    requires_approval = Column(Boolean, default=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    approval_date = Column(DateTime)
    approval_notes = Column(String)

    # Relationships
    product = relationship("Product", back_populates="sales")
    client = relationship("Client", back_populates="sales")
    employee = relationship("User", back_populates="sales", foreign_keys=[employee_id])
    approver = relationship("User", foreign_keys=[approved_by])
    credit_transactions = relationship("CreditTransaction", back_populates="sale", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('quantity > 0', name='chk_quantity_positive'),
        CheckConstraint('unit_price > 0', name='chk_unit_price_positive'),
        CheckConstraint('total_amount > 0', name='chk_total_amount_positive'),
        CheckConstraint('sale_date <= CURRENT_DATE', name='chk_sale_date_not_future'),
        CheckConstraint(
            'cash_amount + credit_amount + check_amount + prepayment_amount = total_amount',
            name='chk_payment_sum'
        ),
    )
```

---

## Cloud SQL Configuration

### Production Setup

**Create Cloud SQL Instance:**
```bash
gcloud sql instances create salesvision-db \
    --database-version=POSTGRES_16 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=SECURE_PASSWORD \
    --backup-start-time=03:00 \
    --enable-bin-log \
    --retained-backups-count=30 \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=4
```

**Create Database:**
```bash
gcloud sql databases create salesvision \
    --instance=salesvision-db
```

**Create User:**
```bash
gcloud sql users create app-user \
    --instance=salesvision-db \
    --password=APP_PASSWORD
```

**Enable IAM Authentication (Recommended):**
```bash
gcloud sql users create app-service-account@youngintlsaleswebapp.iam \
    --instance=salesvision-db \
    --type=CLOUD_IAM_SERVICE_ACCOUNT
```

### Connection Configuration

**Production (Cloud Run):**
```python
# Use Unix socket for Cloud SQL Proxy
DATABASE_URL = "postgresql+asyncpg://user:pass@/salesvision?host=/cloudsql/youngintlsaleswebapp:us-central1:salesvision-db"
```

**Local Development:**
```python
DATABASE_URL = "postgresql+asyncpg://app:app@localhost:5432/appdb"
```

**Environment Variables:**
```bash
# .env
DATABASE_URL=postgresql+asyncpg://app:app@localhost:5432/appdb
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=0
DB_ECHO=false
```

### VPC Connector (for Cloud Run)

```bash
gcloud compute networks vpc-access connectors create salesvision-connector \
    --region=us-central1 \
    --subnet=default \
    --min-instances=2 \
    --max-instances=10
```

**Deploy Cloud Run with VPC:**
```bash
gcloud run deploy salesvision-backend \
    --image=gcr.io/youngintlsaleswebapp/api:latest \
    --region=us-central1 \
    --vpc-connector=salesvision-connector \
    --set-env-vars=DATABASE_URL="postgresql+asyncpg://..."
```

---

## Backup Strategy

### Tier 1: Automated Cloud SQL Backups

**Configuration:**
```bash
gcloud sql instances patch salesvision-db \
    --backup-start-time=03:00 \
    --retained-backups-count=30 \
    --enable-point-in-time-recovery
```

**Features:**
- Daily snapshots at 3 AM
- 30-day retention
- Point-in-time recovery to any second
- No additional cost

**Restore:**
```bash
# List backups
gcloud sql backups list --instance=salesvision-db

# Restore from specific backup
gcloud sql backups restore BACKUP_ID \
    --backup-instance=salesvision-db

# Clone instance for testing
gcloud sql instances clone salesvision-db salesvision-db-test
```

### Tier 2: Weekly CSV Exports

**Endpoint:** `POST /api/admin/export/weekly`

**Implementation:** See `frontEndLogic.md` "Database Backup & Recovery Strategy" section

**Storage:** Cloud Storage bucket with versioning (gs://salesvision-backups)

### Tier 3: Audit Log

Permanent record in `audit_log` table - never deleted, partitioned by month for performance.

---

## Data Integrity Enforcement

### Database Constraints

**Implemented in schema:**
- Primary keys (all tables)
- Foreign keys with referential actions
- Check constraints (positive amounts, valid dates)
- Unique constraints (prevent duplicates)
- NOT NULL constraints (required fields)

### Application-Level Validation

**Pydantic models** enforce rules before database:
```python
from pydantic import BaseModel, Field, validator
from datetime import date

class SaleCreate(BaseModel):
    product_code: str
    quantity: int = Field(gt=0)
    unit_price: Decimal = Field(gt=0)
    sale_date: date = Field(le=date.today())

    @validator('sale_date')
    def validate_not_future(cls, v):
        if v > date.today():
            raise ValueError("Sale date cannot be in the future")
        return v
```

### Transaction Management

**All multi-step operations wrapped in transactions:**
```python
async def create_sale_with_inventory(sale_data: SaleCreate, db: AsyncSession):
    async with db.begin():
        # 1. Create sale
        sale = Sale(**sale_data.dict())
        db.add(sale)

        # 2. Update inventory
        inventory = await db.get(Inventory, sale_data.product_id)
        inventory.stock_quantity -= sale_data.quantity

        # 3. Create credit transaction if needed
        if sale_data.credit_amount > 0:
            credit = CreditTransaction(sale_id=sale.id, ...)
            db.add(credit)

        await db.commit()  # All succeed or all rollback
```

---

## File Structure

### What Exists
```
db/
├── csv/                        # Source CSV data (test data)
├── ui/                         # JSON output (delete after migration)
└── databasedescription.md      # Schema documentation
```

### What to Create
```
db/
├── sample-data/                # Rename from csv/ (keep as reference)
│   ├── README.md              # Explain it's test data
│   └── ... (CSV files)
├── migrations/                 # Alembic migration system
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 001_initial_schema.py
│       ├── 002_add_audit_log.py
│       └── ...
├── scripts/
│   ├── seed_data.py           # CSV → PostgreSQL migration
│   ├── validate_data.py       # Data quality checks
│   └── backup_to_csv.py       # PostgreSQL → CSV export
└── README.md                  # Updated with production info
```

---

## Implementation Checklist

### Phase 1: Database Setup
- [ ] Create Cloud SQL PostgreSQL instance (production)
- [ ] Start Docker PostgreSQL container (local dev)
- [ ] Initialize Alembic in `apps/api`
- [ ] Configure `alembic.ini` and `env.py`
- [ ] Create database connection module (`apps/api/app/db/session.py`)

### Phase 2: Models & Schema
- [ ] Create SQLAlchemy base model (`apps/api/app/models/base.py`)
- [ ] Create all 15 model files
- [ ] Generate initial Alembic migration
- [ ] Review and edit migration script
- [ ] Apply migration to local database
- [ ] Verify schema with `\dt`, `\d tablename` in psql

### Phase 3: Data Migration
- [ ] Write CSV → PostgreSQL transformation script
- [ ] Test migration on local database
- [ ] Validate data integrity (foreign keys, constraints)
- [ ] Create seed data for development
- [ ] Test rollback procedures

### Phase 4: Production Deployment
- [ ] Apply migrations to Cloud SQL
- [ ] Configure VPC connector
- [ ] Update Cloud Run services with DATABASE_URL
- [ ] Test database connectivity from Cloud Run
- [ ] Enable automated backups
- [ ] Configure backup monitoring

### Phase 5: Integration
- [ ] Update FastAPI to use database connection
- [ ] Replace CSV data with database queries
- [ ] Test all CRUD operations
- [ ] Implement audit logging
- [ ] Performance testing and optimization

---

## Migration Commands Reference

```bash
# Local Development
docker-compose -f docker/docker-compose.dev.yml up -d db
psql postgresql://app:app@localhost:5432/appdb

# Alembic
cd apps/api
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
alembic downgrade -1
alembic history
alembic current

# Cloud SQL
gcloud sql instances list
gcloud sql databases list --instance=salesvision-db
gcloud sql connect salesvision-db --user=app-user
gcloud sql operations list --instance=salesvision-db
gcloud sql backups list --instance=salesvision-db

# Data Migration
python db/scripts/seed_data.py
python db/scripts/validate_data.py
```

---

## Conclusion

Database infrastructure complete plan: 15 tables covering all business domains, proper foreign key relationships, indexes for performance, constraints for integrity, Alembic for migrations, Cloud SQL for production, automated backups, audit trail. Ready to replace CSV→JSON static data with proper PostgreSQL backend.
