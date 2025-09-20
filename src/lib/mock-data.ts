
export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  target: 50000,
  current: 45231.89,
  lastYear: 42100.5,
};

export const teamSalesTargetData = {
  target: 135000,
  current: 131000,
  lastYear: 125000,
};

export const salesTargetChartData = [
  { name: '당월', sales: 45231.89, target: 50000 },
  { name: '전년 동월', sales: 42100.5, target: 40000 },
];

export const teamSalesTargetChartData = [
  { name: '당월', jane: 38000, alex: 52000, john: 41000, target: 135000 },
  { name: '전년 동월', jane: 35000, alex: 48000, john: 42000, target: 120000 },
];

export const cumulativeSalesTargetChartData = [
    { name: '당해년도', sales: 294000.5, target: 350000 },
    { name: '전년', sales: 273653.25, target: 300000 },
];

export const teamCumulativeSalesTargetChartData = [
    { name: '팀 당해년도', sales: 851500, target: 945000 },
    { name: '팀 전년', sales: 812500, target: 840000 },
];


export type DuePayment = {
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  amount: number;
  dueDate: string;
  status: 'due' | 'overdue' | 'nearing';
};

export const duePaymentsData: DuePayment[] = [
  {
    customer: { name: 'Liam Johnson', email: 'liam@example.com' },
    employee: 'Jane Smith',
    amount: 250.0,
    dueDate: '2024-07-10', // Overdue
    status: 'overdue',
  },
  {
    customer: { name: 'Olivia Smith', email: 'olivia@example.com' },
    employee: 'Alex Ray',
    amount: 150.75,
    dueDate: '2024-08-05', // due in < 14 days
    status: 'due',
  },
  {
    customer: { name: 'Noah Williams', email: 'noah@example.com' },
    employee: 'John Doe',
    amount: 350.0,
    dueDate: '2024-08-25', // nearing
    status: 'nearing',
  },
  {
    customer: { name: 'Emma Brown', email: 'emma@example.com' },
    employee: 'Jane Smith',
    amount: 450.0,
    dueDate: '2024-08-01', // due or overdue depending on current date
    status: 'due',
  },
  {
    customer: { name: 'Ava Jones', email: 'ava@example.com' },
    employee: 'Alex Ray',
    amount: 550.0,
    dueDate: '2024-08-28', // nearing
    status: 'nearing',
  },
    {
    customer: { name: 'James Wilson', email: 'james@example.com' },
    employee: 'John Doe',
    amount: 200.0,
    dueDate: '2024-07-15', // Overdue
    status: 'overdue',
  },
];

export type RecentSale = {
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  date: string;
};

export const recentSalesData: RecentSale[] = [
  {
    customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com' },
    amount: 1999.0,
    date: '2024-08-01',
  },
  {
    customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com' },
    amount: 39.0,
    date: '2024-08-01',
  },
  {
    customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
    amount: 299.0,
    date: '2024-07-31',
  },
  {
    customer: { name: 'William Kim', email: 'will@email.com' },
    amount: 99.0,
    date: '2024-07-30',
  },
  {
    customer: { name: 'Sofia Davis', email: 'sofia.davis@email.com' },
    amount: 39.0,
    date: '2024-07-30',
  },
];

export const salesTrendCsvData = `Date,Product Category,Product Code,Description,Customer Name,Customer Code,Customer Grade,Quantity,Price,Total Price,Payment Method,Employee Code,Invoice Number
2023-01-15,Electronics,E-001,Laptop,John Doe,C-101,A,2,1200,2400,Credit,EMP-01,INV-1001
2023-01-20,Clothing,C-005,T-Shirt,Jane Smith,C-102,B,5,25,125,Cash,EMP-02,
2023-02-10,Electronics,E-002,Smartphone,John Doe,C-101,A,1,800,800,Credit,EMP-01,INV-1002
2023-03-05,Books,B-010,Science Fiction Novel,Peter Jones,C-103,C,3,15,45,Cash,EMP-03,
2023-04-12,Clothing,C-008,Jeans,Jane Smith,C-102,B,2,75,150,Credit,EMP-02,INV-1003
2023-05-25,Electronics,E-001,Laptop,Alice Williams,C-104,A,1,1250,1250,Prepayment,EMP-01,INV-1004
2023-06-18,Home Goods,H-003,Coffee Maker,John Doe,C-101,A,1,100,100,Check,EMP-01,
2023-07-22,Clothing,C-005,T-Shirt,Peter Jones,C-103,C,10,20,200,Cash,EMP-03,
2023-08-30,Electronics,E-003,Tablet,Jane Smith,C-102,B,1,450,450,Credit,EMP-02,INV-1005
2023-09-14,Books,B-012,Cookbook,Alice Williams,C-104,A,2,30,60,Cash,EMP-01,
2023-11-01,Clothing,C-015,Winter Jacket,John Doe,C-101,A,1,200,200,Credit,EMP-01,INV-1006
2023-12-20,Electronics,E-004,Gaming Console,Jane Smith,C-102,B,1,500,500,Credit,EMP-02,INV-1007
`;

export const products = [
    { value: 'e-001', label: 'Laptop', basePrice: 1200 },
    { value: 'e-002', label: 'Smartphone', basePrice: 800 },
    { value: 'e-003', label: 'Tablet', basePrice: 450 },
    { value: 'e-004', label: 'Gaming Console', basePrice: 500 },
    { value: 'c-005', label: 'T-Shirt', basePrice: 25 },
    { value: 'c-008', label: 'Jeans', basePrice: 75 },
    { value: 'c-015', label: 'Winter Jacket', basePrice: 200 },
    { value: 'b-010', label: 'Science Fiction Novel', basePrice: 15 },
    { value: 'b-012', label: 'Cookbook', basePrice: 30 },
    { value: 'h-003', label: 'Coffee Maker', basePrice: 100 },
];

export const customers = [
    { value: 'c-101', label: 'John Doe', grade: 'A' },
    { value: 'c-102', label: 'Jane Smith', grade: 'B' },
    { value: 'c-103', label: 'Peter Jones', grade: 'C' },
    { value: 'c-104', label: 'Alice Williams', grade: 'A' },
    { value: 'c-105', label: 'Michael Brown', grade: 'B' },
];

export const employees = [
    { value: 'admin', label: 'John Doe (Admin)', role: 'admin' },
    { value: 'manager', label: 'Alex Ray (Manager)', role: 'manager' },
    { value: 'employee', label: 'Jane Smith (Employee)', role: 'employee' },
];
