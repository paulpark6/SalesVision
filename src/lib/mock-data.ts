
import type { NavItem } from '@/types/nav-item';
import { PlaceHolderImages } from './placeholder-images';

export const salesTrendCsvData = `Date,Category,Product,Units Sold,Revenue
2023-01-05,Electronics,Laptop,10,12000
2023-01-12,Clothing,T-Shirt,50,1250
2023-01-15,Electronics,Smartphone,20,15000
2023-02-03,Books,Novel,30,450
2023-02-20,Clothing,Jeans,40,2400
2023-03-10,Electronics,Headphones,100,5000
2023-03-25,Books,Cookbook,15,300
2023-04-05,Clothing,Jacket,25,3750
2023-04-18,Electronics,Tablet,15,9000
2023-05-12,Books,Biography,10,200
2023-06-01,Clothing,Shorts,60,1800
2023-06-22,Electronics,Smartwatch,30,6000`;


export const overviewData = {
    totalRevenue: 45231.89,
    subscriptions: 2350,
    sales: 12234,
    activeNow: 573,
};

export const recentSalesData = [
    {
        customer: {
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
        },
        amount: 1999.0,
    },
    {
        customer: {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
        },
        amount: 39.0,
    },
    {
        customer: {
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
        },
        amount: 299.0,
    },
    {
        customer: {
            name: "William Kim",
            email: "will@email.com",
        },
        amount: 99.0,
    },
    {
        customer: {
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
        },
        amount: 39.0,
    },
];

export type DuePayment = {
    id: string;
    customer: {
        name: string;
        email: string;
    };
    employee: string;
    dueDate: string;
    amount: number;
    collectionPlan?: string;
};

export const duePaymentsData: DuePayment[] = [
    {
        id: "INV-001",
        customer: {
            name: "Innovate Inc.",
            email: "contact@innovate.com",
        },
        employee: "Jane Smith",
        dueDate: "2023-08-15",
        amount: 2500.75,
        collectionPlan: "Sent reminder email on 8/16. Follow up call scheduled for 8/20.",
    },
    {
        id: "INV-002",
        customer: {
            name: "Solutions Co.",
            email: "accounts@solutions.co",
        },
        employee: "Alex Ray",
        dueDate: "2023-09-20",
        amount: 550.0,
    },
    {
        id: "INV-003",
        customer: {
            name: "Tech Hub",
            email: "billing@techhub.com",
        },
        employee: "John Doe",
        dueDate: "2023-09-30",
        amount: 1200.0,
    },
    {
        id: "INV-004",
        customer: {
            name: "Innovate Inc.",
            email: "contact@innovate.com",
        },
        employee: "Jane Smith",
        dueDate: "2023-05-10",
        amount: 300.50,
        collectionPlan: "Customer promised payment by 6/1. No payment received.",
    },
    {
        id: "INV-005",
        customer: {
            name: "Gadget Corp",
            email: "finance@gadgetcorp.com",
        },
        employee: "Jane Smith",
        dueDate: "2023-09-25",
        amount: 890.0,
    },
     {
        id: "INV-006",
        customer: {
            name: "Quantum Systems",
            email: "billing@quantum.com",
        },
        employee: "Alex Ray",
        dueDate: "2022-08-01",
        amount: 1500.00,
        collectionPlan: "Legal action initiated."
    },
];

export const salesTargetData = {
    current: 42150.50,
    target: 45000.00,
}

export const salesTargetChartData = [
  { name: '매출', sales: 42150.50, target: 45000.00 },
];

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];


export const products = [
    { value: 'p-001', label: 'Premium Laptop', basePrice: 1200 },
    { value: 'p-002', label: 'Wireless Mouse', basePrice: 25 },
    { value: 'p-003', label: 'Mechanical Keyboard', basePrice: 150 },
    { value: 'p-004', label: '4K Monitor', basePrice: 400 },
];

export const productUploadCsvData = `ProductCode,ProductName,Category,ImportPrice,LocalPurchasePrice
P-001,Premium Laptop,Electronics,1100,1150
P-002,Wireless Mouse,Electronics,20,22
P-003,Mechanical Keyboard,Electronics,140,145
P-004,4K Monitor,Electronics,380,390
`;

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2024-09-01,Global Imports,Electronics,P-001,Premium Laptop,50,1100
2024-09-01,Tech Supplies,Electronics,P-002,Wireless Mouse,200,20
`;


export const customers = [
    { value: 'c-101', label: 'Innovate Inc.', grade: 'A' },
    { value: 'c-102', label: 'Solutions Co.', grade: 'B' },
    { value: 'c-103', label: 'Tech Hub', grade: 'A' },
    { value: 'c-104', label: 'Gadget Corp', grade: 'C' },
    { value: 'c-105', label: 'Quantum Systems', grade: 'B' },
];

export const customerUploadCsvData = `CustomerCode,CustomerName,Grade,Employee
C-106,New Vision Co.,A,E-002
C-107,Dynamic Solutions,B,E-003
`;

export const employees = [
    { value: 'e-001', label: 'Jane Smith', name: 'Jane Smith', role: 'employee' },
    { value: 'e-002', label: 'Alex Ray', name: 'Alex Ray', role: 'manager' },
    { value: 'e-003', label: 'John Doe', name: 'John Doe', role: 'employee' },
    { value: 'e-004', label: 'Admin User', name: 'Admin User', role: 'admin' },
];

export const salesReportData = [
  {
    employeeName: 'Jane Smith',
    customerName: 'Innovate Inc.',
    customerCode: 'C-101',
    target: 15000,
    actual: 18500,
  },
  {
    employeeName: 'Jane Smith',
    customerName: 'Gadget Corp',
    customerCode: 'C-104',
    target: 5000,
    actual: 4500,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Solutions Co.',
    customerCode: 'C-102',
    target: 20000,
    actual: 21000,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Quantum Systems',
    customerCode: 'C-105',
    target: 18000,
    actual: 17500,
  },
  {
    employeeName: 'John Doe',
    customerName: 'Tech Hub',
    customerCode: 'C-103',
    target: 22000,
    actual: 23000,
  },
];

export const cumulativeReportData = [
    { month: "Jan", target: 50000, actual: 48000, lastYear: 45000 },
    { month: "Feb", target: 50000, actual: 52000, lastYear: 47000 },
    { month: "Mar", target: 50000, actual: 55000, lastYear: 51000 },
    { month: "Apr", target: 55000, actual: 54000, lastYear: 53000 },
    { month: "May", target: 55000, actual: 58000, lastYear: 56000 },
    { month: "Jun", target: 60000, actual: 61000, lastYear: 58000 },
    { month: "Jul", target: 60000, actual: 63000, lastYear: 60000 },
    { month: "Aug", target: 60000, actual: 62000, lastYear: 61000 },
    { month: "Sep", target: 65000, actual: 68000, lastYear: 63000 },
];

type CustomerProductSaleDetail = {
    productName: string;
    target: number;
    actual: number;
};
type MonthlyCustomerDetail = {
    customerName: string;
    products: CustomerProductSaleDetail[];
};
export type MonthlyDetail = {
    month: string;
    details: MonthlyCustomerDetail[];
};
export const monthlyDetailReportData: MonthlyDetail[] = [
    {
        month: 'Sep',
        details: [
            {
                customerName: 'Innovate Inc.',
                products: [
                    { productName: 'Premium Laptop', target: 12000, actual: 15600 },
                    { productName: '4K Monitor', target: 4000, actual: 3200 },
                ],
            },
            {
                customerName: 'Tech Hub',
                products: [
                    { productName: 'Premium Laptop', target: 24000, actual: 22800 },
                    { productName: 'Wireless Mouse', target: 1000, actual: 1250 },
                ],
            },
        ],
    },
];

export type CashSale = {
  id: string;
  date: string; // YYYY-MM-DD
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
};

export const cashSalesData: CashSale[] = [
  { id: 'cs001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Innovate Inc.', source: '신용 수금', amount: 1500 },
  { id: 'cs002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Solutions Co.', source: '현금 판매', amount: 800 },
  { id: 'cs003', date: '2024-09-03', employeeName: 'John Doe', customerName: 'Tech Hub', source: '현금 판매', amount: 2000 },
  { id: 'cs004', date: '2024-09-05', employeeName: 'Jane Smith', customerName: 'Gadget Corp', source: '신용 수금', amount: 500 },
  { id: 'cs005', date: '2024-09-09', employeeName: 'Alex Ray', customerName: 'Quantum Systems', source: '신용 수금', amount: 1200 },
  { id: 'cs006', date: '2024-09-10', employeeName: 'John Doe', customerName: 'Tech Hub', source: '신용 수금', amount: 3000 },
  { id: 'cs007', date: '2024-09-11', employeeName: 'Jane Smith', customerName: 'Innovate Inc.', source: '현금 판매', amount: 750 },
];

export type CheckStatus = 'Pending' | 'Confirmed' | 'Rejected';
export type CheckPayment = {
  id: string;
  receiptDate: string;
  dueDate: string;
  salesperson: string;
  customerName: string;
  issuingBank: string;
  checkNumber: string;
  amount: number;
  depositBank: string;
  depositDate: string;
  status: CheckStatus;
  notes: string;
};

export const checkPaymentsData: CheckPayment[] = [
  { id: 'chk001', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Innovate Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Pending', notes: '' },
  { id: 'chk002', receiptDate: '2024-09-03', dueDate: '2024-09-20', salesperson: 'Alex Ray', customerName: 'Solutions Co.', issuingBank: 'Wells Fargo', checkNumber: '67890', amount: 2500, depositBank: 'Chase', depositDate: '2024-09-04', status: 'Confirmed', notes: 'Urgent' },
  { id: 'chk003', receiptDate: '2024-09-05', dueDate: '2024-11-05', salesperson: 'John Doe', customerName: 'Tech Hub', issuingBank: 'Citibank', checkNumber: '54321', amount: 8000, depositBank: '', depositDate: '', status: 'Pending', notes: '' },
  { id: 'chk004', receiptDate: '2024-08-15', dueDate: '2024-09-15', salesperson: 'Jane Smith', customerName: 'Gadget Corp', issuingBank: 'Bank of America', checkNumber: '98765', amount: 1200, depositBank: 'Chase', depositDate: '2024-08-16', status: 'Rejected', notes: 'Insufficient funds' },
];

export const commissionData = [
  {
    employeeId: 'E-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입', salePrice: 250000, costPrice: 200000, customerType: 'own' as 'own' }, // 5% rate for first 200k, 3% for remainder
      { type: '수입', salePrice: 100000, costPrice: 80000, customerType: 'transfer' as 'transfer' }, // 1% rate
      { type: '현지' as '현지', salePrice: 20000, costPrice: 12000, customerType: 'own' as 'own' }, // margin 40%, rate 18%
    ],
  },
  {
    employeeId: 'E-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입', salePrice: 150000, costPrice: 120000, customerType: 'own' as 'own' }, // 5% rate
      { type: '현지' as '현지', salePrice: 50000, costPrice: 46000, customerType: 'transfer' as 'transfer' }, // margin 8%, rate 3% * 0.5
      { type: '현지' as '현지', salePrice: 30000, costPrice: 25000, customerType: 'own' as 'own' }, // margin 16.67%, rate 10%
    ],
  },
  {
    employeeId: 'E-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입' as '수입', salePrice: 80000, costPrice: 60000, customerType: 'transfer' as 'transfer' }, // 1% rate
      { type: '현지' as '현지', salePrice: 100000, costPrice: 75000, customerType: 'own' as 'own' }, // margin 25%, rate 12%
    ],
  },
];

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};
export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: 'ecs-01', customerName: 'Innovate Inc.', salesTarget: 15000, salesAmount: 18800 },
  { id: 'ecs-02', customerName: 'Gadget Corp', salesTarget: 5000, salesAmount: 4500 },
  { id: 'ecs-03', customerName: 'Digital Wave', salesTarget: 10000, salesAmount: 12500 },
  { id: 'ecs-04', customerName: 'Byte Builders', salesTarget: 8000, salesAmount: 2200 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};
export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  'ecs-01': [
    { productName: 'Premium Laptop', salesTarget: 12000, salesAmount: 15600 },
    { productName: '4K Monitor', salesTarget: 3000, salesAmount: 3200 },
  ],
  'ecs-02': [
    { productName: 'Wireless Mouse', salesTarget: 2000, salesAmount: 2500 },
    { productName: 'Mechanical Keyboard', salesTarget: 3000, salesAmount: 2000 },
  ],
  'ecs-03': [
     { productName: 'Premium Laptop', salesTarget: 10000, salesAmount: 12500 },
  ],
   'ecs-04': [
     { productName: '4K Monitor', salesTarget: 8000, salesAmount: 2200 },
  ],
};


export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Innovate Inc.',
    customerCode: 'A0001',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 18500, average: 16000 },
    ],
    yearlySales: [
      { year: 2023, amount: 195000 },
    ],
    creditBalance: 2800.75,
    contact: {
      name: 'John Smith',
      position: 'CEO',
      phone: '123-456-7890',
      address: '123 Innovation Dr, Techville',
      email: 'john.s@innovate.com'
    },
    companyOverview: 'A leading company in technological innovation and research. They specialize in developing cutting-edge software solutions.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Solutions Co.',
    customerCode: 'B0001',
    customerGrade: 'B',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 21000, average: 20000 },
    ],
    yearlySales: [
      { year: 2023, amount: 240000 },
    ],
    creditBalance: 550.00,
    contact: {
      name: 'Jane Doe',
      position: 'Purchasing Manager',
      phone: '987-654-3210',
      address: '456 Business Rd, Metro City',
      email: 'jane.d@solutions.co'
    },
    companyOverview: 'A consulting firm that provides business solutions to a wide range of industries.'
  },
];


export const monthlyPerformanceData = [
  { month: 'July', target: 60000, actual: 63000 },
  { month: 'August', target: 60000, actual: 62000 },
  { month: 'September', target: 65000, actual: 68000 },
];

    