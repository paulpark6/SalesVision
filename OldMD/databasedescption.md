## Current State

✅ **Cloud SQL Instance**: `sales-Vision-db` (POSTGRES_15, us-central1)

✅ **Database**: `salesVision` created

✅ **Connection Name**: `youngintlsaleswebapp:us-central1:sales-Vision-db`

✅ **Secret Manager**: DATABASE_URL stored (version 1)

✅ **SQLAlchemy Models**: 14 models created (users, employees, clients, products, sales, credits, overdue_collections, commissions, price_lists, stocks, monthly_sales_targets, expenditures, cash_flows, cheques)

✅ **Alembic Migrations**: Initialized, migration generated and applied (f99bd1eb4948)

✅ **Schema Applied**: All 14 tables created successfully in Cloud SQL

✅ **Cloud SQL Proxy**: Configured for local development targeting Cloud SQL.
✅ **Docker PostgreSQL**: Configured for local development targeting Local DB (faster/offline).

✅ **Database Connectivity**: Tested and verified

⚠️ **Foreign Key Relationships**: NOT DEFINED - Tables exist but have no relational constraints

❌ **Seed Data**: Not loaded (optional)

**Model Files**: `/apps/api/app/models/` (14 files)
**Migration File**: `/apps/api/alembic/versions/f99bd1eb4948_initial_schema_with_14_tables.py`

**❗ ACTION REQUIRED**: Define foreign key relationships between tables before proceeding with backend API.

**Next Steps**:
1. User to specify foreign key relationships for all tables
2. Update models with ForeignKey constraints
3. Generate and apply relationship migration
4. Build backend API endpoints

---

### 0. Users (Authentication and Authorization)

> **Purpose:** User accounts for authentication and role-based access control.

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | Primary key | Integer | None |
| email | User email address (unique) | String | None |
| employee_id | Links to employee record | String | employees.staff_number |
| is_active | Account active status | Boolean | None |
| created_at | Account creation timestamp | DateTime | None |
| updated_at | Last update timestamp | DateTime | None |
| last_login | Last login timestamp | DateTime | None |

---

### 1. sales (Data Description Sales Vision - Sales.csv)

> **Purpose:** To look at the sales record to see the total revenue and performance of each staff.[1]

Only CEO can see this data

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| sale_num | Unique identifier for a sale, Primary Key | Integer | None |
| inventory_status | The inventory management system requires defining stock status as: sales, returns, internal use, broken, damage, missing | String | None |
| product_code | Unique product code for each product | String | Product.ProductCode |
| invoice_num | invoice number (given values from tax office). | String | None |
| sale_date | date of sale made (dd/mm/yy) | Date | None |
| quantity | Quantity of sold product | Integer | None |
| client_number | Unique client number for each client name | String | Client.ClientNumber |
| staff_number | staff number of employee managing this client | String | Employee.staff_number |
| unit_price | price of sale per unit | Decimal | products -> price list's unitcost |
| sale_amount | Total amount of sale = UnitSalePrice x Quantity | Decimal | None |
| payment_type | either cash, cheque, credit | String | None |
| payment_id | either cash_id, cheque_id, credit_id. Depends on payment_type. Need to comeback to this to discuss on how to add this column| ForeginKey | cash_id, cheque_id, credit_id |

### 2. credits (Data Description Sales Vision - Credit.csv)

> **Purpose:** To see if client paid for the product or not.[1] (Payment Type Table.)

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| credit_id | Primary Key | Integer | None |
| date | date of input dd/mm/yy | Date | None |
| client_number | Unique client number for each client name | String | Client.client_number |
| staff_number | staff number of employee managing this client | String | Employee.staff_number |
| payment_status | Status of payment: Credit -> Client took product and did not pay yet... Pay -> Client has paid for product | String | None |
| credit_amount | Amount that needs to be paid from client | Decimal | None |
| credit_payment_type | Categorical column: Cheque, Cash, SetOff, penalty, mix | String | None |
| credit_due_date | CreditPeriod (dd/mm/yy) | Date | None |
| sale_num | Specific refece to specific sale in sales table | Integer | sales.sale_num |

### 3. overdue_collection (Data Description Sales Vision - OverdueCollection.csv)

> **Purpose:** to show the overdue status to make action to collect.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | Primary Key | Integer | None |
| credit_id | Primary Key | Integer | credits.id |
| date | date of data input | Date | None |
| client_id | id of client | String | clients.client_id |
| staff_id | id of employee managing this client | String | employees.staff_id |
| credit_due_date | Date when client requested to pay back. | Date | None |
| credit_amount | Amount that needs to be paid from client | Integer | None |
| action | description of staff's attempt to get money from client | String | None |

### 4. clients (Data Description Sales Vision - Client.csv)

> **Purpose:** to establish a comprehensive client management protocol by accurately determining both the client's size/segment and our own company's sales scale, while also ensuring an accessible emergency contact system for immediate resolution.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| client_number | Unique client number for each client name | String | None |
| client_name | Name of client | String | None |
| client_category | industry of client: bus transpotation, garage, transportation, factory,vehicle rental,road contruction | String | None |
| client_grade | 3 different category: A, B, C where A is the biggest and C is the lowest | String | None |
| contact_name | Name of contact point | String | None |
| contact_position | position of contact point | String | None |
| contact_phone | phone number of contact point | String | None |
| contact_name2 | Name of 2nd contact point | String | None |
| contact_position2 | position of 2nd contact point | String | None |
| contact_phone2 | phone number of 2nd contact point | String | None |
| address | address of client | String | None |
| og_staff_id | id of original employee managing this client | String | employees.staff_number |
| current_staff_id | id of current employee managing this client | String | employees.staff_number |
| client_type | distingush the client type: Own develop clients or transfer client from others | String | None |
| average_amount | average amount of month sales | Decimal | None |
| yearly_amount | total sales amount of the previous year | Decimal | None |
| information | staff describe: number of commercial vehicle,product specification,quantity per month | String | None |

### 5. employees (Data Description Sales Vision - Employee.csv)

> **Purpose:** to clarify roles and activities to effectively integrate with the sales system.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| staff_number | unique id for each employee | String | user.employee_id |
| position | categorical variable showing either manager or staff | String | None |
| name | Name of employee (first_name last_name) | String | None |
| division | categorical variable showing either sales or internal work | String | None |
| working_start | first start date of employee | String (likely Date) | None |
| phone_number | call to employee to cummunicate | String | None |
| emergency_contact_name | name of emergency contact | String | None |
| emergency_contact_relationship | relationship of emergency contact | String | None |
| emergency_contact_number | phone number of emergency contact | String | None |
| whatsapp | text/call to employee to cummunicate | String | None |
| manager_id | staff_numer of manager managing this employee | String | self join to employees.staff_number |

### 6. commissions (Data Description Sales Vision - commission.csv)

> **Purpose:** to provide the commission to the staff depend on their sales,productclaaification and client type.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each commission | String | None |
| staff_number | unique id of staff | String | employees.staff_number |
| commission | according to sales, classification of products, client transfer calculation, and product type, company will provide commission | Decimal | Need Sales Table, products table, client table to calculate commission |


### 7. products (Data Description Sales Vision - Product.csv)

> **Purpose:** to set the appropriate product quantity and cost for every product name.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| product_code | Unique product code for each product | String | None |
| product_description | Description of code description | String | None |
| product_category | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String | None |
| unit_cost | cost of product for import produts or purchaisng cost when it buy it in local | Decimal | None |
| classification | where is from: import or local purchaising | String | None |
| credit_or_cash | when it buys locally, pay it in cash or credit | String | None |
| amount | amount of cash or credit | Decimal | None |
| upload_date | the cost can vary by date: dd/mm/yy | Date | None |

### 8. price_lists (Data Description Sales Vision - price list.csv)

> **Purpose:** To show the specific pricing for all available products, segmented by each client grade.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each price list | String | None |
| product_code | Unique product code for each product | String | products.product_code |
| client_number | Unique client number for each client name | String | clients.client_number |
| price | sellin price - according to client grade for each product name | Decimal | None |

### 9. Stocks (Data Description Sales Vision - Stock.csv)

> **Purpose:** to verify the current stock availability for new orders and to identify any discrepancies or missing inventory units.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| ID | unique id for each stock | String | None |
| product_code | Unique product code for each product | String | products.product_code |
| avg_sales_qty | average sales quantity per current month to estimate the order time | Decimal | Value from aggregated views of Sales table |
| avg_sales_price | average sales price per unit stock. | Decimal | None |
| stock_qty | number of items available in stock | Integer | None |
| check_date | dd/mm/yy date of stock input | Date | None |
| monthly_review_date | mostly check it monthly and report it (designated date) | Date | None |
| monthly_review_desc | mostly check it monthly and report it with description | String | None |
| stock_status | The inventory management system requires defining stock status as: sales, returns, internal use, broken, damage, missing | String | None |

### 10. monthly_sales_targets (Data Description Sales Vision - monthly sales target.csv)

> **Purpose:** to input sales target in the subject month.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| product_code | Unique product code for each product | String | products.product_code |
| staff_id | Name of employee managing this client | String | employees.staff_id |
| input_date | data inputed date for sales target | Date | None |
| target_date | sales amount target_date | Date | None |
| salesmonthlytarget | sales monthly target for the products and quantity in the subject Month which is choosen | Decimal | None |
| companytarget | company target for the subject month | Decimal | None |

### 11. expenditures (Data Description Sales Vision - expenditure.csv)

> **Purpose:** to display the total monthly expenditure, including the costs associated with locally purchased products.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each expenditure | String | None |
| date | date of data input (dd/mm/yy) | Date | None |
| payment_method | product purchaing method: Cash or Credit | String | None |
| payment_amount | product/expenditure cost | Decimal | None |
| product_code | Unique product code for each product | String | products.product_code |
| expenditure_description | salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax, douane fee,forwarder fee,other | String | None |
| receipt_availability | to prove the payment - yes or No | String | None |

### 12. cash_flows (Data Description Sales Vision - Cash.csv)

> **Purpose:** How much cash flow is generated from operations like sales , collections and others? [1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each cash flow | String | None |
| Date | date of data input (dd/mm/yy) | Date | None |
| client_name | Name of client | String | clients.client_name |
| staff_id | id of employee managing this client | String | employees.staff_id |
| cash_origin | payment from clients (sales), payment from collection of credit(collection), transfer from director, others ( sub rent) | String | None |
| cash_amount | total amount from sales and collection | Decimal | None |
| payment | purchaising the product locally and expenditure | String | None |
| payment_product | purchaising the product locally | Decimal | None |
| payment_expenditure | expenditure ( salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity,water,rental fee,other) | Decimal | None |
| weeklyreview | frequecy of report - weekly check the status(designated date) | String | None |

### 13. cheques (Data Description Sales Vision - Cheque.csv)

> **Purpose:** To monitor the cashing of a checque and, in the event of rejection, initiate follow-up procedures.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| id | unique id for each cheque | String | None |
| receipt_date | date of data input (dd/mm/yy) | Date | None |
| due_date | dd/mm/yy due date of receipt | Date | None |
| client_id | id of client | String | clients.client_id |
| staff_id | id of employee managing this client | String | employees.staff_id |
| issue_bank | payment from clients (sales) payment from collection of credit(collection) | String | None |
| number_of_cheque | number of cheque issued by the bank | String | None |
| deposit_bank | company's bank for deposit (eco bank, bicici bank) | String | None |
| deposit_date | dd/mm/yy date of deposit | Date | None |
| cheque_amount | amount on the cheque | Decimal | None |
| approval_status | bank approval status ; approval, reject( re issue the cheque, cash pay, re-deposit)... | String | None |
| weekly_review | weekly check the status | String | None |



### Reference this:
https://dbdiagram.io/d/SalesVisionData-Model-691d3e936735e11170770c8f