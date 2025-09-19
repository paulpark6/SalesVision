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

export const salesTargetChartData = [
  { name: 'This Month', sales: 45231.89, target: 50000 },
  { name: 'Last Year (Same Period)', sales: 42100.5, target: 40000 },
];

export type DuePayment = {
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  dueDate: string;
  status: 'due' | 'overdue' | 'nearing';
};

export const duePaymentsData: DuePayment[] = [
  {
    customer: { name: 'Liam Johnson', email: 'liam@example.com' },
    amount: 250.0,
    dueDate: '2024-07-25',
    status: 'overdue',
  },
  {
    customer: { name: 'Olivia Smith', email: 'olivia@example.com' },
    amount: 150.75,
    dueDate: '2024-08-05',
    status: 'due',
  },
  {
    customer: { name: 'Noah Williams', email: 'noah@example.com' },
    amount: 350.0,
    dueDate: '2024-08-15',
    status: 'nearing',
  },
  {
    customer: { name: 'Emma Brown', email: 'emma@example.com' },
    amount: 450.0,
    dueDate: '2024-07-28',
    status: 'overdue',
  },
  {
    customer: { name: 'Ava Jones', email: 'ava@example.com' },
    amount: 550.0,
    dueDate: '2024-08-20',
    status: 'nearing',
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
