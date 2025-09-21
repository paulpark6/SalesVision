
'use client';

import type { DuePayment } from '@/lib/mock-data';

export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  current: 45231.89,
  target: 50000,
};

export const salesTargetChartData = [
  { name: '매출', sales: 45231.89, target: 50000 },
];

export const salesComparisonData = [
    { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
    { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
    { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];


export const recentSalesData = [
  {
    customer: {
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
    },
    amount: 1999.0,
  },
  {
    customer: {
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
    },
    amount: 39.0,
  },
  {
    customer: {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
    },
    amount: 299.0,
  },
  {
    customer: {
      name: 'William Kim',
      email: 'will@email.com',
    },
    amount: 99.0,
  },
  {
    customer: {
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
    },
    amount: 39.0,
  },
];

export const duePaymentsData: DuePayment[] = [
  {
    id: 'INV-001',
    customer: { name: 'Tech Solutions Inc.', email: 'contact@techsolutions.com' },
    employee: 'Jane Smith',
    dueDate: '2024-08-15',
    amount: 2500.75,
    collectionPlan: 'Followed up on 8/1. Payment promised by 8/10.',
  },
  {
    id: 'INV-002',
    customer: { name: 'Innovate LLC', email: 'accounts@innovate.com' },
    employee: 'Alex Ray',
    dueDate: '2024-09-20',
    amount: 1500.0,
    collectionPlan: '',
  },
  {
    id: 'INV-003',
    customer: { name: 'Digital Emporium', email: 'billing@digitalemporium.net' },
    employee: 'John Doe',
    dueDate: '2024-07-30',
    amount: 3200.0,
    collectionPlan: 'Sent final notice on 8/5.',
  },
  {
    id: 'INV-004',
    customer: { name: 'Quantum Innovations', email: 'pay@quantuminnovations.dev' },
    employee: 'Jane Smith',
    dueDate: '2024-09-25',
    amount: 800.5,
    collectionPlan: '',
  },
  {
    id: 'INV-005',
    customer: { name: 'Synergy Corp', email: 'ap@synergycorp.com' },
    employee: 'Jane Smith',
    dueDate: '2023-05-10', // Over 1 year overdue
    amount: 5400.00,
    collectionPlan: 'Legal action pending.',
   },
];

export const products = [
  { value: 'e-001', label: 'QuantumGamer X', basePrice: 1200 },
  { value: 'e-002', label: 'ProStream Mic', basePrice: 250 },
  { value: 'c-001', label: 'ErgoFlex Chair', basePrice: 800 },
  { value: 'b-001', label: 'The Art of Code', basePrice: 50 },
  { value: 'h-001', label: 'SmartDesk 3000', basePrice: 1500 },
];

export const customers = [
  { value: 'c-101', label: 'Tech Solutions Inc.', grade: 'A' },
  { value: 'c-102', label: 'Innovate LLC', grade: 'B' },
  { value: 'c-103', label: 'Digital Emporium', grade: 'A' },
  { value: 'c-104', label: 'Quantum Innovations', grade: 'C' },
  { value: 'c-105', label: 'Synergy Corp', grade: 'B' },
];

export const employees = [
  { value: 'emp-001', label: 'Jane Smith (EMP-001)', name: 'Jane Smith', role: 'employee' },
  { value: 'emp-002', label: 'Alex Ray (EMP-002)', name: 'Alex Ray', role: 'manager' },
  { value: 'emp-003', label: 'John Doe (EMP-003)', name: 'John Doe', role: 'employee' },
  { value: 'admin-001', label: 'Admin User (ADMIN-001)', name: 'Admin User', role: 'admin' },
];

export const salesTrendCsvData = `Date,Product,Category,Units Sold,Revenue
2024-01-15,QuantumGamer X,Electronics,50,60000
2024-01-20,ProStream Mic,Electronics,100,25000
2024-02-10,ErgoFlex Chair,Home Goods,30,24000
2024-02-18,QuantumGamer X,Electronics,45,54000
2024-03-05,The Art of Code,Books,200,10000
2024-03-22,SmartDesk 3000,Home Goods,20,30000
2024-04-10,ProStream Mic,Electronics,120,30000
2024-05-19,QuantumGamer X,Electronics,55,66000
2024-06-01,ErgoFlex Chair,Home Goods,40,32000
2024-06-25,The Art of Code,Books,150,7500
2024-07-15,ProStream Mic,Electronics,110,27500
2024-07-28,SmartDesk 3000,Home Goods,25,37500
2024-08-12,QuantumGamer X,Electronics,60,72000
2024-08-30,ErgoFlex Chair,Home Goods,35,28000`;


export type SalesTarget = {
    id: string;
    month: number;
    customerName: string;
    customerCode: string;
    productName: string;
    productCode: string;
    quantity: number;
    targetAmount: number;
}
export const salesTargetData_september: SalesTarget[] = [
    {
        id: 'st-001',
        month: 9,
        customerName: 'Tech Solutions Inc.',
        customerCode: 'c-101',
        productName: 'QuantumGamer X',
        productCode: 'e-001',
        quantity: 10,
        targetAmount: 10800,
    },
    {
        id: 'st-002',
        month: 9,
        customerName: 'Innovate LLC',
        customerCode: 'c-102',
        productName: 'ProStream Mic',
        productCode: 'e-002',
        quantity: 50,
        targetAmount: 11875,
    },
];

export const salesReportData = [
  { employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', customerCode: 'C-101', target: 10000, actual: 12500 },
  { employeeName: 'Jane Smith', customerName: 'Quantum Innovations', customerCode: 'C-104', target: 5000, actual: 4500 },
  { employeeName: 'Alex Ray', customerName: 'Innovate LLC', customerCode: 'C-102', target: 15000, actual: 18000 },
  { employeeName: 'John Doe', customerName: 'Digital Emporium', customerCode: 'C-103', target: 8000, actual: 7000 },
  { employeeName: 'John Doe', customerName: 'Synergy Corp', customerCode: 'C-105', target: 12000, actual: 13000 },
];

export const cumulativeReportData = [
    { month: '1월', target: 40000, actual: 42000, lastYear: 38000 },
    { month: '2월', target: 40000, actual: 38000, lastYear: 39000 },
    { month: '3월', target: 45000, actual: 48000, lastYear: 42000 },
    { month: '4월', target: 45000, actual: 44000, lastYear: 43000 },
    { month: '5월', target: 50000, actual: 51000, lastYear: 48000 },
    { month: '6월', target: 50000, actual: 53000, lastYear: 47000 },
    { month: '7월', target: 55000, actual: 54000, lastYear: 51000 },
    { month: '8월', target: 55000, actual: 58000, lastYear: 52000 },
    { month: '9월', target: 60000, actual: 61000, lastYear: 55000 },
    { month: '10월', target: 60000, actual: 0, lastYear: 58000 },
    { month: '11월', target: 65000, actual: 0, lastYear: 62000 },
    { month: '12월', target: 70000, actual: 0, lastYear: 68000 },
];

export type MonthlyProductSale = {
  productName: string;
  target: number;
  actual: number;
};
export type MonthlyCustomerSale = {
  customerName: string;
  products: MonthlyProductSale[];
};
export type MonthlyDetail = {
    month: string;
    details: MonthlyCustomerSale[];
}
export const monthlyDetailReportData: MonthlyDetail[] = [
    {
        month: '9월',
        details: [
            {
                customerName: 'Tech Solutions Inc.',
                products: [
                    { productName: 'QuantumGamer X', target: 8000, actual: 9500 },
                    { productName: 'ProStream Mic', target: 2000, actual: 3000 },
                ],
            },
            {
                customerName: 'Innovate LLC',
                products: [
                    { productName: 'ErgoFlex Chair', target: 10000, actual: 12000 },
                    { productName: 'SmartDesk 3000', target: 5000, actual: 6000 },
                ],
            },
        ],
    },
    {
        month: '8월',
        details: [
             {
                customerName: 'Tech Solutions Inc.',
                products: [
                    { productName: 'QuantumGamer X', target: 7000, actual: 8000 },
                    { productName: 'The Art of Code', target: 1000, actual: 1500 },
                ],
            },
        ]
    }
];

export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Tech Solutions Inc.',
    customerCode: 'A0001',
    customerGrade: 'A',
    customerType: 'own' as const,
    monthlySales: [
      { month: 9, actual: 12500.75, average: 11000 },
    ],
    yearlySales: [
      { year: 2023, amount: 130000 },
    ],
    creditBalance: 2500.75,
    contact: {
      name: 'John Smith',
      position: 'IT Manager',
      phone: '123-456-7890',
      address: '123 Tech Park, Silicon Valley, CA',
      email: 'john.smith@techsolutions.com'
    },
    companyOverview: 'A leading provider of IT solutions and services.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Innovate LLC',
    customerCode: 'A0002',
    customerGrade: 'B',
    customerType: 'transfer' as const,
    monthlySales: [
      { month: 9, actual: 18000.00, average: 16000 },
    ],
    yearlySales: [
      { year: 2023, amount: 190000 },
    ],
    creditBalance: 1500.00,
     contact: {
      name: 'Jane Doe',
      position: 'Lead Developer',
      phone: '987-654-3210',
      address: '456 Innovation Dr, Startup City, TX',
      email: 'jane.doe@innovate.com'
    },
    companyOverview: 'A startup focused on cutting-edge software development.'
  },
   {
    employee: 'John Doe',
    customerName: 'Digital Emporium',
    customerCode: 'B0001',
    customerGrade: 'A',
    customerType: 'pending' as const,
    monthlySales: [
      { month: 9, actual: 7000.00, average: 7500 },
    ],
    yearlySales: [
      { year: 2023, amount: 90000 },
    ],
    creditBalance: 3200.00,
     contact: {
      name: 'Peter Jones',
      position: 'Marketing Head',
      phone: '555-123-4567',
      address: '789 Market St, Commerce City, NY',
      email: 'peter.jones@digitalemporium.net'
    },
    companyOverview: 'An online retailer for digital goods and electronics.'
  },
];

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPurchasePrice
Electronics,E-001,QuantumGamer X,1000,950
Electronics,E-002,ProStream Mic,200,190
Home Goods,H-001,ErgoFlex Chair,750,700`;

export const customerUploadCsvData = `Employee,CustomerName,CustomerCode,Grade
emp-001,New Tech Corp,A0003,A
emp-002,Global Innovations,A0004,B
`;

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2024-09-15,Global Imports,Electronics,E-003,Wireless Keyboard,150,25.50
2024-09-16,Asia-Pacific Traders,Home Goods,H-002,Standing Desk,50,150.00
`;

export type EmployeeCustomerSale = {
    id: string;
    customerName: string;
    salesTarget: number;
    salesAmount: number;
}
export const employeeCustomerSales: EmployeeCustomerSale[] = [
    { id: 'ecs-001', customerName: 'Tech Solutions Inc.', salesTarget: 10000, salesAmount: 12500 },
    { id: 'ecs-002', customerName: 'Quantum Innovations', salesTarget: 5000, salesAmount: 4500 },
    { id: 'ecs-003', customerName: 'Synergy Corp', salesTarget: 8000, salesAmount: 9200 },
];

export type CustomerProductSale = {
    productName: string;
    salesTarget: number;
    salesAmount: number;
}
export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    'ecs-001': [
        { productName: 'QuantumGamer X', salesTarget: 8000, salesAmount: 9500 },
        { productName: 'ProStream Mic', salesTarget: 2000, salesAmount: 3000 },
    ],
    'ecs-002': [
        { productName: 'The Art of Code', salesTarget: 5000, salesAmount: 4500 },
    ],
    'ecs-003': [
        { productName: 'ErgoFlex Chair', salesTarget: 5000, salesAmount: 6000 },
        { productName: 'SmartDesk 3000', salesTarget: 3000, salesAmount: 3200 },
    ],
};


export type CashSale = {
    id: string;
    date: string;
    employeeName: string;
    customerName: string;
    source: '현금 판매' | '신용 수금';
    amount: number;
}

export const cashSalesData: CashSale[] = [
    { id: 'cs-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', source: '신용 수금', amount: 1500 },
    { id: 'cs-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Innovate LLC', source: '현금 판매', amount: 800 },
    { id: 'cs-003', date: '2024-09-03', employeeName: 'Jane Smith', customerName: 'Quantum Innovations', source: '현금 판매', amount: 500 },
    { id: 'cs-004', date: '2024-09-05', employeeName: 'John Doe', customerName: 'Digital Emporium', source: '신용 수금', amount: 2000 },
    { id: 'cs-005', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', source: '현금 판매', amount: 1200 },
    { id: 'cs-006', date: '2024-09-11', employeeName: 'Alex Ray', customerName: 'Synergy Corp', source: '신용 수금', amount: 3000 },
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
}

export const checkPaymentsData: CheckPayment[] = [
    { id: 'check-001', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Tech Solutions Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Pending', notes: 'Awaiting clearance' },
    { id: 'check-002', receiptDate: '2024-09-03', dueDate: '2024-09-20', salesperson: 'Alex Ray', customerName: 'Innovate LLC', issuingBank: 'Wells Fargo', checkNumber: '67890', amount: 2500, depositBank: '', depositDate: '', status: 'Pending', notes: '' },
    { id: 'check-003', receiptDate: '2024-08-25', dueDate: '2024-09-15', salesperson: 'Jane Smith', customerName: 'Quantum Innovations', issuingBank: 'Citi', checkNumber: '54321', amount: 1200, depositBank: 'Chase', depositDate: '2024-08-26', status: 'Confirmed', notes: 'Cleared' },
    { id: 'check-004', receiptDate: '2024-08-28', dueDate: '2024-09-28', salesperson: 'John Doe', customerName: 'Digital Emporium', issuingBank: 'Bank of America', checkNumber: '98765', amount: 3000, depositBank: '', depositDate: '', status: 'Rejected', notes: 'Insufficient funds' },
];

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as const, salePrice: 150000, costPrice: 100000, customerType: 'own' as const },
      { type: '수입' as const, salePrice: 80000, costPrice: 60000, customerType: 'own' as const },
      { type: '수입' as const, salePrice: 120000, costPrice: 90000, customerType: 'transfer' as const },
      { type: '현지' as const, salePrice: 5000, costPrice: 4000, customerType: 'own' as const }, // 20% margin -> 12%
      { type: '현지' as const, salePrice: 8000, costPrice: 5000, customerType: 'own' as const }, // 37.5% margin -> 15%
      { type: '현지' as const, salePrice: 6000, costPrice: 5500, customerType: 'transfer' as const }, // 8.3% margin -> 3% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as const, salePrice: 300000, costPrice: 200000, customerType: 'own' as const },
      { type: '현지' as const, salePrice: 20000, costPrice: 10000, customerType: 'own' as const }, // 50% margin -> 18%
      { type: '현지' as const, salePrice: 15000, costPrice: 14000, customerType: 'transfer' as const }, // 6.7% margin -> 3% * 0.5
    ],
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입' as const, salePrice: 50000, costPrice: 40000, customerType: 'transfer' as const },
      { type: '현지' as const, salePrice: 12000, costPrice: 9000, customerType: 'own' as const }, // 25% margin -> 12%
    ],
  },
];


export interface DuePayment {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  dueDate: string;
  amount: number;
  collectionPlan?: string;
}

export type PastSaleDetail = {
  month: number;
  customerName: string;
  productName: string;
  quantity: number;
  totalSale: number;
};

export const pastSalesDetails: PastSaleDetail[] = [
  // June Data
  { month: 6, customerName: 'Digital Emporium', productName: 'QuantumGamer X', quantity: 5, totalSale: 6000 },
  { month: 6, customerName: 'Digital Emporium', productName: 'ProStream Mic', quantity: 10, totalSale: 2500 },
  { month: 6, customerName: 'Tech Solutions Inc.', productName: 'ErgoFlex Chair', quantity: 15, totalSale: 12000 },
  { month: 6, customerName: 'Innovate LLC', productName: 'QuantumGamer X', quantity: 8, totalSale: 9600 },

  // July Data
  { month: 7, customerName: 'Digital Emporium', productName: 'QuantumGamer X', quantity: 7, totalSale: 8400 },
  { month: 7, customerName: 'Tech Solutions Inc.', productName: 'ErgoFlex Chair', quantity: 10, totalSale: 8000 },
  { month: 7, customerName: 'Tech Solutions Inc.', productName: 'ProStream Mic', quantity: 20, totalSale: 5000 },
  { month: 7, customerName: 'Quantum Innovations', productName: 'SmartDesk 3000', quantity: 5, totalSale: 7500 },

  // August Data
  { month: 8, customerName: 'Digital Emporium', productName: 'QuantumGamer X', quantity: 6, totalSale: 7200 },
  { month: 8, customerName: 'Digital Emporium', productName: 'SmartDesk 3000', quantity: 3, totalSale: 4500 },
  { month: 8, customerName: 'Tech Solutions Inc.', productName: 'ErgoFlex Chair', quantity: 12, totalSale: 9600 },
  { month: 8, customerName: 'Innovate LLC', productName: 'The Art of Code', quantity: 100, totalSale: 5000 },
];

    