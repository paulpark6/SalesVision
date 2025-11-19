## Current State

✅ **Cloud SQL Instance**: `sales-vision-db` (POSTGRES_15, us-central1)

✅ **Database**: `salesvision` created

✅ **Connection Name**: `youngintlsaleswebapp:us-central1:sales-vision-db`

✅ **Secret Manager**: DATABASE_URL stored (version 1)

✅ **SQLAlchemy Models**: 14 models created (users, employees, clients, products, sales, credits, overdue_collections, commissions, price_lists, stocks, monthly_sales_targets, expenditures, cash_flows, cheques)

✅ **Alembic Migrations**: Initialized, migration generated and applied (f99bd1eb4948)

✅ **Schema Applied**: All 14 tables created successfully in Cloud SQL

✅ **Cloud SQL Proxy**: Configured for local development

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
| role | User role for RBAC | Enum (admin, manager, staff, viewer) | None |
| is_active | Account active status | Boolean | None |
| created_at | Account creation timestamp | DateTime | None |
| updated_at | Last update timestamp | DateTime | None |
| last_login | Last login timestamp | DateTime | None |

---

### 1. Sales (Data Description Sales VIsion - Sales.csv)

> **Purpose:** To look at the sales record to see the total revenue and performance of each staff.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| iventoryinout | The inventory management system requires defining stock status as sales, returns, intgernal use ,broken, damage, missing | String | None |
| ProductCode | Unique product code for each product | String | products.product_code |
| ProductDescription | Description of code description | String | None |
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String | None |
| Invoice | invoice number (given values from tax office). | String | None |
| Date | dd/mm/yy | Date | None |
| Quantity | Quantity of product | Integer | None |
| ClientGrade | 3 different category: A, B, C where A is the biggest and C is the lowest | String | None |
| ClientNumber | Unique client number for each client name | String | clients.client_number |
| ClientName | Name of client | String | None |
| Staff | Name of employee managing this client | String | employees.name |
| UnitPrice | Price of product per unit | Decimal | None |
| Amount | Total amount of product = UnitPrice x Quantity | Decimal | None |
| PaymentType | Category value showing which type of payment: Cash, Credit, Cheque | String | None |

### 2. Credit (Data Description Sales VIsion - Credit.csv)

> **Purpose:** To see if client paid for the product or not.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| Date | dd/mm/yy | Date | None |
| ClientNumber | Unique client number for each client name | String | clients.client_number |
| ClientName | Name of client | String | None |
| Staff | Name of employee managing this client | String | employees.name |
| PaymentStatuts | Status of payment: Credit -> Client took product and did not pay yet... Pay -> Client has paid for product | String | None |
| CreditAmount | Amount that needs to be paid from client | Decimal | None |
| CreditPaymentType | Categorical column: Cheque, Cash, SetOff, penalty, mix | String | None |
| CreditDueDate | CreditPeriod (dd/mm/yy) | Date | None |

### 3. OverdueCollection (Data Description Sales VIsion - OverdueCollection.csv)

> **Purpose:** to show the overdue status to make action to collect.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| Date | dd/mm/yy | Date | None |
| ClientName | Name of client | String | clients.client_name |
| Staff | Name of employee managing this client | String | employees.name |
| CreditPeriod | Number of days the client requested to pay for the product | Integer | None |
| CreditAmount | Amount that needs to be paid from client | Integer | None |
| action | staffs have to describe their actions on saturday | String | None |

### 4. Client (Data Description Sales VIsion - Client.csv)

> **Purpose:** to establish a comprehensive client management protocol by accurately determining both the client's size/segment and our own company's sales scale, while also ensuring an accessible emergency contact system for immediate resolution.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| clinet category | industry of client: bus transpotation, garage, transportation, factory,vehicle rental,road contruction | String | None |
| ClientGrade | 3 different category: A, B, C where A is the biggest and C is the lowest | String | None |
| ClientNumber | Unique client number for each client name | String | None |
| ClientName | Name of client | String | None |
| contact name | Name of contact point | String | None |
| contact position | position of contact point | String | None |
| contact phone | phone number of contact point | String | None |
| contact name2 | Name of 2nd contact point | String | None |
| contact position2 | position of 2nd contact point | String | None |
| contact phone2 | phone number of 2nd contact point | String | None |
| address | address of client | String | None |
| Staff | Name of employee managing this client | String | employees.name |
| clinetstype | distingush the client type: Own develop clients or transfer client from others | String | None |
| averageamount | average amount of month sales | Decimal | None |
| yearlyamount | total sales amount of the previous year | Decimal | None |
| information | staff describe: number of commercial vehicle,product specification,quantity per month | String | None |

### 5. Employee (Data Description Sales VIsion - Employee.csv)

> **Purpose:** to clarify roles and activities to effectively integrate with the sales system.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| staff number | to login | String | user.employee_id |
| position | manager,staff | String | None |
| Staff | Name of employee managing this client | String | None |
| division | which part staffs work: sales and internal work | String | None |
| workingstart | when he starts his work | String (likely Date) | None |
| phonenumber | call to him to cummunicate | String | None |
| emergencycontact | name and (relationship) | String | None |
| emergencycall | point of contact for emergency company communications when the primary employee is unreachable. | String | None |
| whatsapps | text/call to him to cummunicate | String | None |

### 6. Commission (Data Description Sales VIsion - commission.csv)

> **Purpose:** to provide the commission to the staff depend on their sales,productclaaification and client type.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| staff number | to login | String | employees.staff_number |
| position | manager,staff | String | None |
| Staff | Name of employee managing this client | String | employees.name |
| division | which part staffs work: sales and internal work | String | None |
| commission | according to sales, company provide commission | Decimal | None |
| monthlyreview | everymonth after closing sales of the month | Decimal | None |
| Classification | where is from: import or local purchaising | String | None |
| clinetstype | distingush the client type: Own develop clients or transfer client from others | String | None |
| importproduct | 5% total sales amount untill 2 m F CFA, after 2 m F CFA it adopt to 3 % | Decimal | None |
| localproduct | Base on the percentage of margin: (selling price -purchasing cost)/selling price... | Decimal | None |
| clinettransfercalculation | transfer clients for import product - 1%; Transfer clients for Local product -50% of localproduct margin | Decimal | None |

### 7. Product (Data Description Sales VIsion - Product.csv)

> **Purpose:** to set the appropriate product quantity and cost for every product name.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String | None |
| ProductCode | Unique product code for each product | String | None |
| ProductDescription | Description of code description | String | None |
| unitcost | cost of product for import produts or purchaisng cost when it buy it in local | Decimal | None |
| Classification | where is from: import or local purchaising | String | None |
| creditorcash | when it buys locally, pay it in cash or credit | String | None |
| amount-credit | If it is credit, how muc | Decimal | None |
| uploadDate | the cost can vary by date: dd/mm/yy | Date | None |

### 8. Price List (Data Description Sales VIsion - price list.csv)

> **Purpose:** To show the specific pricing for all available products, segmented by each client grade.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| productcode | Unique product code for each product | String | products.product_code |
| ProductDescription | Description of code description | String | None |
| clientgrade | 4 grade ( A,B,C and enduser) | String | None |
| price | sellin price - according to client grade for each product name | Decimal | None |

### 9. Stock (Data Description Sales VIsion - Stock.csv)

> **Purpose:** to verify the current stock availability for new orders and to identify any discrepancies or missing inventory units.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String | None |
| ProductCode | Unique product code for each product | String | products.product_code |
| ProductDescription | Description of code description | String | None |
| aveagesales quantity | average sales quantity per month -to estimate the order time | Decimal | None |
| stockquantity | book inventory quantity | Integer / Decimal | None |
| durationperiod | stock quantity / avearage sales per month. | Decimal | None |
| checkDate | dd/mm/yy | Date | None |
| monthlyreview | mostly check it monthly and report it (designated date) | String | None |

### 10. Monthly Sales Target (Data Description Sales VIsion - monthly sales target.csv)

> **Purpose:** to input sales target in the subject month.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| productcode | Unique product code for each product | String | products.product_code |
| ProductDescription | Description of code description | String | None |
| Staff | Name of employee managing this client | String | employees.name |
| salesamount(-3month) | sales by clients,products 3months ago | Decimal | None |
| salesamount(-2month) | sales by clients,products 2months ago | Decimal | None |
| salesamount(-1month) | sales by clients,products 1month ago | Decimal | None |
| salesmonthlytarget | Sales plan for the products and quantity in the subject Month which is choosen | Decimal | None |
| companytarget | company give the target yearly so it is automatically divided into 12 months | Decimal | None |

### 11. Expenditure (Data Description Sales VIsion - expenditure.csv)

> **Purpose:** to display the total monthly expenditure, including the costs associated with locally purchased products.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| Date | dd/mm/yy | Date | None |
| paymentway | product purchaing and expenditure cost | String | None |
| productcode | Unique product code for each product | String | products.product_code |
| ProductDescription | Description of code description | String | None |
| exenditurecategory | salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax.douane fee ,forwarder fee,other | String | None |
| Receipt Availability | to prove the pay,ent - yes or No | String | None |
| cost | pay for payment way - purchaising and espenditure | Decimal | None |

### 12. Cash (Data Description Sales VIsion - Cash.csv)

> **Purpose:** How much cash flow is generated from operations like sales , collections and others? [1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| Date | dd/mm/yy | Date | None |
| ClientName | Name of client | String | clients.client_name |
| Staff | Name of employee managing this client | String | employees.name |
| Cashorigin | payment from clients (sales), payment from collection of credit(collection), transfer from director, others ( sub rent) | String | None |
| Cashamount | total amount from sales and collection | Decimal | None |
| payment | purchaising the product locally and expenditure | String | None |
| paymentproduct | purchaising the product locally | Decimal | None |
| paymentexpenditure | expenditure ( salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity,water,rental fee,other) | Decimal | None |
| weeklyreview | frequecy of report - weekly check the status(designated date) | String | None |

### 13. Cheque (Data Description Sales VIsion - Cheque.csv)

> **Purpose:** To monitor the cashing of a checque and, in the event of rejection, initiate follow-up procedures.[1]

| Column Name | Column Description | Values / Data Type | Relationship |
|---|---|---|---|
| receiptDate | dd/mm/yy | Date | None |
| duedate | dd/mm/yy | Date | None |
| ClientName | Name of client | String | clients.client_name |
| Staff | Name of employee managing this client | String | employees.name |
| issue bank | payment from clients (sales) payment from collection of credit(collection) | String | None |
| number of cheque | number of cheque issued by the bank | String | None |
| deposit bank | company's bank for deposit (eco bank, bicici bank) | String | None |
| depositdate | dd/mm/yy | Date | None |
| chequeamount | amount on the cheque | Decimal | None |
| Approval status | bank approval status ; approval, reject( re issue the cheque, cash pay, re-deposit)... | String | None |
| weeklyreview | weekly check the status | String | None |