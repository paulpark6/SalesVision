# Base Tables

## Expenditures
### Purpose: 
display total monthly expenditure, including the costs associated with locally purchased products.
### Tables Needed: - NONE
### Columns:
Date: dd/mm/yy showing the month of the expenditure.
payment_type: product purchaing and expenditure cost
product_code: Unique product code
ProductDescription: Description of code description
exenditurecategory: categorical variables of salary,company disposable items, delivery cost,sales support,commission,fuel,car repair,company tool&machine,electricity fee,water fee,rental fee,CNPS,impot tax.douane fee ,forwarder fee,other
Receipt_Availability: Binary variables of to prove the payment - yes or No
Cost: pay for payment way - purchaising and espenditure

## Employees
### Purpose: 
staff information
### Tables Needed: - Employees
Self left join table on manager_id
select * from Employees left join Employees on Employees.staff_number = Employees.manager_id 
### Columns:
staff_number -> unique identifier for each staff
position -> staff position
name -> staff name
division -> staff division
working_start -> staff workinhg start date
phone_number -> staff phone number
emergency_contact -> staff emergency contact
emergency_call -> staff emergency call
whatsapps -> staff whatsapps
manager_id -> staff manager id
manger_name -> staff manager name

## Clients
### Purpose:
client information
### Tables Needed:
### Columns:
client_number -> unique identifier for each client
client_name -> client name
client_category -> client category
client_grade -> client grade
contact_name -> client contact name
contact_position -> client contact position
contact_phone -> client contact phone
contact_name2 -> client contact name2
contact_position2 -> client contact position2
contact_phone2 -> client contact phone2
address -> client address
staff_managing -> staff managing client
client_type -> client type
average_amount -> client average amount
yearly_amount -> client yearly amount
information -> client information

## Products
### Purpose:
product information
### Tables Needed:
### Columns:
product_code -> unique identifier for each product
product_description -> product description
product_category -> product category
unit_cost -> product unit cost
classification -> product classification
credit_or_cash -> product credit or cash
amount_credit -> product amount credit
upload_date -> product upload date

## Credits
### Purpose:
credit information
### Tables Needed:
Clients
Employees
### Columns:
credit_id -> unique identifier for each credit
Clients.client_number -> client number
Clients.client_name -> client name
Employees.name -> staff name
payment_status -> payment status
credit_amount -> credit amount
credit_payment_type -> credit payment type
credit_due_date -> credit due date
sales_num -> sales number

## MonthlySalesTargets
### Purpose:
monthly sales target information for each staff
### Tables Needed:
Products
Employees
### Columns:
id -> unique identifier for each monthly sales target
Products.product_code -> product code
Employees.name -> staff name
sales_amount_3month -> sales amount for 3 months
sales_amount_2month -> sales amount for 2 months
sales_amount_1month -> sales amount for 1 month
sales_monthly_target -> sales monthly target
company_target -> company target

## Stocks
### Purpose:
stock information
### Tables Needed:
Products
### Columns:
id -> unique identifier for each stock
Products.product_code -> product code
Products.product_category -> product category
average_sales_quantity -> average sales quantity
duration_period -> duration period
check_date -> check date
monthly_review -> monthly review

## CashFlows
### Purpose:
cash flow information
### Tables Needed:
### Columns:
id -> unique identifier for each cash flow
date -> date
cash_origin -> cash origin
cash_amount -> cash amount
payment -> payment
payment_product -> payment product
payment_expenditure -> payment expenditure
weekly_review -> weekly review

## Cheques
### Purpose:
cheque information
### Tables Needed:
CashFlows
Clients
Employees
### Columns:
id -> unique identifier for each cheque
CashFlows.id -> cash flow id
receipt_date -> receipt date
due_date -> due date
Clients.client_name -> client name
Employees.name -> staff name
issue_bank -> issue bank
number_of_cheque -> number of cheque
deposit_bank -> deposit bank
deposit_date -> deposit date
cheque_amount -> cheque amount
approval_status -> approval status
weekly_review -> weekly review

## PriceLists
### Purpose:
price list information
### Tables Needed:
Products
Clients
### Columns:
id -> unique identifier for each price list
Products.product_code -> product code
Clients.client_grade -> client grade
price -> price

## Sales
### Purpose:
sales information
### Tables Needed:
Products
Clients
Employees
### Columns:
sale_num -> unique identifier for each sale
inventory_in_out -> inventory management system requires defining stock status as sales, returns, intgernal use ,broken, damage, missing
product_code -> unique product code
invoice_num -> invoice number
date -> date
quantity -> quantity of sold product
Clients.client_number -> client number
Employees.staff_number -> staff number
unit_price -> unit price
amount -> amount
cash_flows.payment_type -> payment type

## OverdueCollections
### Purpose:
overdue collection information
### Tables Needed:
Credits
Employees
### Columns:
credit_id -> unique identifier for each credit
date -> date
Clients.client_number -> client number
Employees.name -> staff name
credit_period -> credit period
credit_amount -> credit amount
action -> action

# Aggregation Tables

## Commissions
### Purpose:
commission information
### Tables Needed:
Employees
Products
### Columns:
id -> unique identifier for each commission
Employees.staff_number -> staff number
commission -> commission
monthly_review -> monthly review
Products.classification -> classification
client_transfer_calculation -> client transfer calculation

