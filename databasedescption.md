
### 1. Sales (Data Description Sales VIsion - Sales.csv)

> **Purpose:** To look at the sales record to see the total revenue and performance of each staff.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| iventoryinout | The inventory management system requires defining stock status as sales, returns, intgernal use ,broken, damage, missing | String |
| ProductCode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String |
| Invoice | invoice number (given values from tax office). | String |
| Date | dd/mm/yy | Date |
| Quantity | Quantity of product | Integer |
| ClientGrade | 3 different category: A, B, C where A is the biggest and C is the lowest | String |
| ClientNumber | Unique client number for each client name | String |
| ClientName | Name of client | String |
| Staff | Name of employee managing this client | String |
| UnitPrice | Price of product per unit | Decimal |
| Amount | Total amount of product = UnitPrice x Quantity | Decimal |
| PaymentType | Category value showing which type of payment: Cash, Credit, Cheque | String |

### 2. Credit (Data Description Sales VIsion - Credit.csv)

> **Purpose:** To see if client paid for the product or not.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| Date | dd/mm/yy | Date |
| ClientNumber | Unique client number for each client name | String |
| ClientName | Name of client | String |
| Staff | Name of employee managing this client | String |
| PaymentStatuts | Status of payment: Credit -> Client took product and did not pay yet... Pay -> Client has paid for product | String |
| CreditAmount | Amount that needs to be paid from client | Decimal |
| CreditPaymentType | Categorical column: Cheque, Cash, SetOff, penalty, mix | String |
| CreditDueDate | CreditPeriod (dd/mm/yy) | Date |

### 3. OverdueCollection (Data Description Sales VIsion - OverdueCollection.csv)

> **Purpose:** to show the overdue status to make action to collect.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| Date | dd/mm/yy | Date |
| ClientName | Name of client | String |
| Staff | Name of employee managing this client | String |
| CreditPeriod | Number of days the client requested to pay for the product | Integer |
| CreditAmount | Amount that needs to be paid from client | Integer |
| action | staffs have to describe their actions on saturday | String |

### 4. Client (Data Description Sales VIsion - Client.csv)

> **Purpose:** to establish a comprehensive client management protocol by accurately determining both the client's size/segment and our own company's sales scale, while also ensuring an accessible emergency contact system for immediate resolution.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| clinet category | industry of client: bus transpotation, garage, transportation, factory,vehicle rental,road contruction | String |
| ClientGrade | 3 different category: A, B, C where A is the biggest and C is the lowest | String |
| ClientNumber | Unique client number for each client name | String |
| ClientName | Name of client | String |
| contact name | Name of contact point | String |
| contact position | position of contact point | String |
| contact phone | phone number of contact point | String |
| contact name2 | Name of 2nd contact point | String |
| contact position2 | position of 2nd contact point | String |
| contact phone2 | phone number of 2nd contact point | String |
| address | address of client | String |
| Staff | Name of employee managing this client | String |
| clinetstype | distingush the client type: Own develop clients or transfer client from others | String |
| averageamount | average amount of month sales | Decimal |
| yearlyamount | total sales amount of the previous year | Decimal |
| information | staff describe: number of commercial vehicle,product specification,quantity per month | String |

### 5. Employee (Data Description Sales VIsion - Employee.csv)

> **Purpose:** to clarify roles and activities to effectively integrate with the sales system.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| staff number | to login | String |
| position | manager,staff | String |
| Staff | Name of employee managing this client | String |
| division | which part staffs work: sales and internal work | String |
| workingstart | when he starts his work | String (likely Date) |
| phonenumber | call to him to cummunicate | String |
| emergencycontact | name and (relationship) | String |
| emergencycall | point of contact for emergency company communications when the primary employee is unreachable. | String |
| whatsapps | text/call to him to cummunicate | String |

### 6. Commission (Data Description Sales VIsion - commission.csv)

> **Purpose:** to provide the commission to the staff depend on their sales,productclaaification and client type.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| staff number | to login | String |
| position | manager,staff | String |
| Staff | Name of employee managing this client | String |
| division | which part staffs work: sales and internal work | String |
| commission | according to sales, company provide commission | Decimal |
| monthlyreview | everymonth after closing sales of the month | Decimal |
| Classification | where is from: import or local purchaising | String |
| clinetstype | distingush the client type: Own develop clients or transfer client from others | String |
| importproduct | 5% total sales amount untill 2 m F CFA, after 2 m F CFA it adopt to 3 % | Decimal |
| localproduct | Base on the percentage of margin: (selling price -purchasing cost)/selling price... | Decimal |
| clinettransfercalculation | transfer clients for import product - 1%; Transfer clients for Local product -50% of localproduct margin | Decimal |

### 7. Product (Data Description Sales VIsion - Product.csv)

> **Purpose:** to set the appropriate product quantity and cost for every product name.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String |
| ProductCode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| unitcost | cost of product for import produts or purchaisng cost when it buy it in local | Decimal |
| Classification | where is from: import or local purchaising | String |
| creditorcash | when it buys locally, pay it in cash or credit | String |
| amount-credit | If it is credit, how muc | Decimal |
| uploadDate | the cost can vary by date: dd/mm/yy | Date |

### 8. Price List (Data Description Sales VIsion - price list.csv)

> **Purpose:** To show the specific pricing for all available products, segmented by each client grade.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| productcode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| clientgrade | 4 grade ( A,B,C and enduser) | String |
| price | sellin price - according to client grade for each product name | Decimal |

### 9. Stock (Data Description Sales VIsion - Stock.csv)

> **Purpose:** to verify the current stock availability for new orders and to identify any discrepancies or missing inventory units.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| ProductCategory | Categories will increase, but currently there are: Oil, Tire, Filter, Others | String |
| ProductCode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| aveagesales quantity | average sales quantity per month -to estimate the order time | Decimal |
| stockquantity | book inventory quantity | Integer / Decimal |
| durationperiod | stock quantity / avearage sales per month. | Decimal |
| checkDate | dd/mm/yy | Date |
| monthlyreview | mostly check it monthly and report it (designated date) | String |

### 10. Monthly Sales Target (Data Description Sales VIsion - monthly sales target.csv)

> **Purpose:** to input sales target in the subject month.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| productcode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| Staff | Name of employee managing this client | String |
| salesamount(-3month) | sales by clients,products 3months ago | Decimal |
| salesamount(-2month) | sales by clients,products 2months ago | Decimal |
| salesamount(-1month) | sales by clients,products 1month ago | Decimal |
| salesmonthlytarget | Sales plan for the products and quantity in the subject Month which is choosen | Decimal |
| companytarget | company give the target yearly so it is automatically divided into 12 months | Decimal |

### 11. Expenditure (Data Description Sales VIsion - expenditure.csv)

> **Purpose:** to display the total monthly expenditure, including the costs associated with locally purchased products.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| Date | dd/mm/yy | Date |
| paymentway | product purchaing and expenditure cost | String |
| productcode | Unique product code for each product | String |
| ProductDescription | Description of code description | String |
| exenditurecategory | salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax.douane fee ,forwarder fee,other | String |
| Receipt Availability | to prove the pay,ent - yes or No | String |
| cost | pay for payment way - purchaising and espenditure | Decimal |

### 12. Cash (Data Description Sales VIsion - Cash.csv)

> **Purpose:** How much cash flow is generated from operations like sales , collections and others? [1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| Date | dd/mm/yy | Date |
| ClientName | Name of client | String |
| Staff | Name of employee managing this client | String |
| Cashorigin | payment from clients (sales), payment from collection of credit(collection), transfer from director, others ( sub rent) | String |
| Cashamount | total amount from sales and collection | Decimal |
| payment | purchaising the product locally and expenditure | String |
| paymentproduct | purchaising the product locally | Decimal |
| paymentexpenditure | expenditure ( salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity,water,rental fee,other) | Decimal |
| weeklyreview | frequecy of report - weekly check the status(designated date) | String |

### 13. Cheque (Data Description Sales VIsion - Cheque.csv)

> **Purpose:** To monitor the cashing of a checque and, in the event of rejection, initiate follow-up procedures.[1]

| Column Name | Column Description | Values / Data Type |
|---|---|---|
| receiptDate | dd/mm/yy | Date |
| duedate | dd/mm/yy | Date |
| ClientName | Name of client | String |
| Staff | Name of employee managing this client | String |
| issue bank | payment from clients (sales) payment from collection of credit(collection) | String |
| number of cheque | number of cheque issued by the bank | String |
| deposit bank | company's bank for deposit (eco bank, bicici bank) | String |
| depositdate | dd/mm/yy | Date |
| chequeamount | amount on the cheque | Decimal |
| Approval status | bank approval status ; approval, reject( re issue the cheque, cash pay, re-deposit)... | String |
| weeklyreview | weekly check the status | String |