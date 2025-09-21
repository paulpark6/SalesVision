
// src/lib/mock-data.ts

import type { NavItem, NavItemWithLink } from "./types";

export const overviewData = {
    totalRevenue: 45231.89,
    subscriptions: 2350,
    sales: 12234,
    activeNow: 573,
};

export const salesTargetData = {
    current: 38000,
    target: 45000,
};

export const salesTargetChartData = [
  {
    name: '매출',
    sales: 38000,
    target: 45000,
  }
]

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 18000, alex: 15000, john: 12000 },
  { name: '9월 누적 실적', jane: 15000, alex: 18000, john: 10000 },
  { name: '전년 동기 실적', jane: 14000, alex: 16000, john: 11000 },
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

export const duePaymentsData = [
  {
    id: 'INV-001',
    customer: {
      name: 'Global Tech Inc.',
      email: 'contact@globaltech.com',
    },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
    amount: 2500.00,
    collectionPlan: 'Followed up via email on Aug 28.'
  },
  {
    id: 'INV-002',
    customer: {
      name: 'Innovate Solutions',
      email: 'accounts@innovate.com',
    },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    amount: 1500.75,
    collectionPlan: ''
  },
  {
    id: 'INV-003',
    customer: {
      name: 'Quantum Systems',
      email: 'billing@quantumsys.com',
    },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 32)).toISOString().split('T')[0],
    amount: 350.00,
    collectionPlan: ''
  },
  {
    id: 'INV-004',
    customer: {
      name: 'Apex Industries',
      email: 'finance@apexind.com',
    },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    amount: 4500.00,
    collectionPlan: ''
  },
  {
    id: 'INV-005',
    customer: {
      name: 'Starlight Corp',
      email: 'payables@starlight.com',
    },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 95)).toISOString().split('T')[0],
    amount: 550.00,
    collectionPlan: 'Payment plan agreed. First installment due Sep 15.'
  },
  {
    id: 'INV-006',
    customer: {
      name: 'Blocked Corp',
      email: 'blocked@example.com',
    },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 400)).toISOString().split('T')[0],
    amount: 1000.00,
    collectionPlan: 'Legal action pending.'
  },
];


export const salesTrendCsvData = `Date,Category,Product,Amount
2023-01-15,Electronics,Laptop,1200
2023-01-20,Books,Science Fiction Novel,25
2023-02-10,Electronics,Smartphone,800
2023-02-18,Clothing,T-Shirt,30
2023-03-05,Electronics,Laptop,1250
2023-03-12,Home Goods,Coffee Maker,150
2023-04-22,Electronics,Smartphone,820
2023-04-28,Books,History Book,45
2023-05-15,Clothing,Jeans,90
2023-06-10,Electronics,Laptop,1150
2023-07-08,Home Goods,Blender,95
2023-08-19,Electronics,Smartphone,850`;

export const customers = [
    { value: 'c-101', label: 'Global Tech Inc.', grade: 'A' },
    { value: 'c-102', label: 'Innovate Solutions', grade: 'B' },
    { value: 'c-103', label: 'Quantum Systems', grade: 'A' },
    { value: 'c-104', label: 'Apex Industries', grade: 'C' },
    { value: 'c-105', label: 'Starlight Corp', grade: 'B' },
    { value: 'c-106', label: 'Blocked Corp', grade: 'C' },
];

export const products = [
    { value: 'e-001', label: 'High-Performance Laptop', basePrice: 1200, monthlyAverageSales: 15 },
    { value: 'e-002', label: 'Latest Model Smartphone', basePrice: 850, monthlyAverageSales: 30 },
    { value: 'hg-001', label: 'Automatic Coffee Maker', basePrice: 150, monthlyAverageSales: 50 },
    { value: 'c-001', label: 'Graphic T-Shirt', basePrice: 30, monthlyAverageSales: 100 },
    { value: 'b-001', label: 'The History of Time', basePrice: 45, monthlyAverageSales: 200 },
];

export const employees = [
  { value: 'john-doe', label: 'Admin (John Doe)', name: 'John Doe', role: 'admin', manager: null },
  { value: 'admin-user', label: 'Admin (Admin User)', name: 'Admin User', role: 'admin', manager: null },
  { value: 'alex-ray', label: 'Manager (Alex Ray)', name: 'Alex Ray', role: 'manager', manager: 'john-doe'},
  { value: 'jane-smith', label: 'Employee (Jane Smith)', name: 'Jane Smith', role: 'employee', manager: 'alex-ray' },
  { value: 'mike-ross', label: 'Employee (Mike Ross)', name: 'Mike Ross', role: 'employee', manager: 'alex-ray' },
];

export const salesReportData = [
  {
    employeeName: 'Jane Smith',
    customerName: 'Global Tech Inc.',
    customerCode: 'C-101',
    target: 5000,
    actual: 4850,
  },
  {
    employeeName: 'Jane Smith',
    customerName: 'Innovate Solutions',
    customerCode: 'C-102',
    target: 3000,
    actual: 3200,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Quantum Systems',
    customerCode: 'C-103',
    target: 8000,
    actual: 7500,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Apex Industries',
    customerCode: 'C-104',
    target: 4000,
    actual: 4100,
  },
  {
    employeeName: 'John Doe',
    customerName: 'Starlight Corp',
    customerCode: 'C-105',
    target: 6000,
    actual: 6500,
  },
];

export const cumulativeReportData = [
    { month: '1월', target: 50000, actual: 48000, lastYear: 45000 },
    { month: '2월', target: 50000, actual: 52000, lastYear: 47000 },
    { month: '3월', target: 55000, actual: 53000, lastYear: 51000 },
    { month: '4월', target: 55000, actual: 58000, lastYear: 54000 },
    { month: '5월', target: 60000, actual: 61000, lastYear: 58000 },
    { month: '6월', target: 60000, actual: 63000, lastYear: 59000 },
    { month: '7월', target: 65000, actual: 64000, lastYear: 62000 },
    { month: '8월', target: 65000, actual: 68000, lastYear: 66000 },
    { month: '9월', target: 70000, actual: 72000, lastYear: 67000 },
    { month: '10월', target: 70000, actual: 0, lastYear: 68000 },
    { month: '11월', target: 75000, actual: 0, lastYear: 72000 },
    { month: '12월', target: 80000, actual: 0, lastYear: 78000 },
];


export const customerData = [
  { 
    employee: 'John Doe', 
    employeeId: 'john-doe',
    customerName: 'Starlight Corp', 
    customerCode: 'C-105', 
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [{ month: 9, actual: 8500, average: 7500 }],
    yearlySales: [{ year: 2023, amount: 95000 }],
    creditBalance: 12000,
    contact: {
      name: 'Eva Green',
      position: 'CEO',
      phone: '123-456-7890',
      address: '123 Starlight Ave, CA',
      email: 'eva.green@starlight.com'
    },
    companyOverview: 'Starlight Corp specializes in advanced optics and imaging technology.'
  },
  { 
    employee: 'Alex Ray', 
    employeeId: 'alex-ray',
    customerName: 'Apex Industries', 
    customerCode: 'C-104', 
    customerGrade: 'B',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [{ month: 9, actual: 6500, average: 6000 }],
    yearlySales: [{ year: 2023, amount: 78000 }],
    creditBalance: 8500,
    contact: {
      name: 'John Apex',
      position: 'Purchasing Head',
      phone: '123-456-7890',
      address: '456 Apex Blvd, TX',
      email: 'john.apex@apexind.com'
    },
    companyOverview: 'Apex Industries is a leader in manufacturing heavy machinery.'
  },
  { 
    employee: 'Jane Smith', 
    employeeId: 'jane-smith',
    customerName: 'Global Tech Inc.', 
    customerCode: 'C-101', 
    customerGrade: 'A',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [{ month: 9, actual: 12000, average: 10000 }],
    yearlySales: [{ year: 2023, amount: 150000 }],
    creditBalance: 25000,
    contact: {
      name: 'Sarah Connor',
      position: 'CTO',
      phone: '123-456-7890',
      address: '789 Tech Rd, WA',
      email: 'sarah.connor@globaltech.com'
    },
    companyOverview: 'Global Tech provides innovative software solutions worldwide.'
  },
  { 
    employee: 'Mike Ross', 
    employeeId: 'mike-ross',
    customerName: 'Innovate Solutions', 
    customerCode: 'C-102', 
    customerGrade: 'B',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [{ month: 9, actual: 500, average: 500 }],
    yearlySales: [{ year: 2023, amount: 500 }],
    creditBalance: 500,
    contact: {
      name: 'Mike Innovate',
      position: 'Lead Developer',
      phone: '123-456-7890',
      address: '101 Innovate Ln, MA',
      email: 'mike@innovate.com'
    },
    companyOverview: 'A startup focused on mobile application development.'
  },
];

export const customerUploadCsvData = `Employee,CustomerName,CustomerCode,Grade
jane-smith,Nexus Systems,C-201,A
alex-ray,Vertex Solutions,C-202,B
`;

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPurchasePrice
Electronics,E-006,4K Monitor,450.00,480.00
Home Goods,HG-005,Air Fryer,89.99,95.00
`;

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2023-09-28,Global Imports,Electronics,E-007,Noise-Cancelling Headphones,150,199.99
2023-09-29,Euro Gadgets,Home Goods,HG-006,Robotic Vacuum,100,299.50
`;

export const commissionData = [
  {
    employeeId: 'jane-smith',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 100000, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' },
      { type: '수입', salePrice: 120000, costPrice: 90000, customerType: 'transfer' },
      { type: '현지', salePrice: 5000, costPrice: 4000, customerType: 'own' }, // margin 20% -> 12%
      { type: '현지', salePrice: 8000, costPrice: 5000, customerType: 'transfer' }, // margin 37.5% -> 15% -> 7.5%
    ]
  },
  {
    employeeId: 'alex-ray',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입', salePrice: 300000, costPrice: 200000, customerType: 'own' },
      { type: '현지', salePrice: 12000, costPrice: 11000, customerType: 'own' }, // margin 8.3% -> 3%
      { type: '현지', salePrice: 20000, costPrice: 12000, customerType: 'own' }, // margin 40% -> 18%
    ]
  },
  {
    employeeId: 'john-doe',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 50000, costPrice: 40000, customerType: 'transfer' },
      { type: '현지', salePrice: 25000, costPrice: 15000, customerType: 'transfer' }, // margin 40% -> 18% -> 9%
    ]
  }
];

export type CheckStatus = 'Pending' | 'Confirmed' | 'Rejected';

export interface CheckPayment {
  id: string;
  receiptDate: string;
  dueDate: string;
  salesperson: string;
  customerName: string;
  issuingBank: string;
  checkNumber: string;
  amount: number;
  depositBank?: string;
  depositDate?: string;
  status: CheckStatus;
  notes: string;
}

export const checkPaymentsData: CheckPayment[] = [
  {
    id: 'CHK-001',
    receiptDate: '2023-09-01',
    dueDate: '2023-10-01',
    salesperson: 'Jane Smith',
    customerName: 'Global Tech Inc.',
    issuingBank: 'Bank of America',
    checkNumber: '12345',
    amount: 5000,
    depositBank: 'Chase',
    depositDate: '2023-09-02',
    status: 'Confirmed',
    notes: 'Approved by manager',
  },
  {
    id: 'CHK-002',
    receiptDate: '2023-09-05',
    dueDate: '2023-11-05',
    salesperson: 'Alex Ray',
    customerName: 'Apex Industries',
    issuingBank: 'Wells Fargo',
    checkNumber: '67890',
    amount: 12000,
    depositBank: '',
    depositDate: '',
    status: 'Pending',
    notes: 'Awaiting confirmation',
  },
  {
    id: 'CHK-003',
    receiptDate: '2023-08-20',
    dueDate: '2023-09-20',
    salesperson: 'Jane Smith',
    customerName: 'Innovate Solutions',
    issuingBank: 'Citibank',
    checkNumber: '54321',
    amount: 3500,
    depositBank: 'Chase',
    depositDate: '2023-08-21',
    status: 'Rejected',
    notes: 'Bounced check. Penalty applied.',
  },
];

export type CashSale = {
  id: string;
  date: string;
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
}

export const cashSalesData: CashSale[] = [
    { id: 'CS-001', date: '2023-09-25', employeeName: 'Jane Smith', customerName: 'Retail Spot', source: '현금 판매', amount: 350 },
    { id: 'CS-002', date: '2023-09-25', employeeName: 'Alex Ray', customerName: 'Innovate Solutions', source: '신용 수금', amount: 1500 },
    { id: 'CS-003', date: '2023-09-26', employeeName: 'John Doe', customerName: 'Starlight Corp', source: '신용 수금', amount: 2200 },
    { id: 'CS-004', date: '2023-09-26', employeeName: 'Jane Smith', customerName: 'Local Biz', source: '현금 판매', amount: 450 },
    { id: 'CS-005', date: '2023-09-18', employeeName: 'Alex Ray', customerName: 'Quick Mart', source: '현금 판매', amount: 200 },
    { id: 'CS-006', date: '2023-09-19', employeeName: 'Jane Smith', customerName: 'Global Tech Inc.', source: '신용 수금', amount: 3000 },
];


export type EmployeeCustomerSale = {
  id: string,
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: 'cust-1', customerName: 'Global Tech', salesTarget: 15000, salesAmount: 13500 },
  { id: 'cust-2', customerName: 'Innovate Solutions', salesTarget: 8000, salesAmount: 9200 },
  { id: 'cust-3', customerName: 'Apex Industries', salesTarget: 12000, salesAmount: 10500 },
];

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  'cust-1': [
    { productName: 'Laptop Model X', salesTarget: 10000, salesAmount: 9000 },
    { productName: 'Software Suite', salesTarget: 5000, salesAmount: 4500 },
  ],
  'cust-2': [
    { productName: 'Mobile App License', salesTarget: 5000, salesAmount: 6000 },
    { productName: 'Support Contract', salesTarget: 3000, salesAmount: 3200 },
  ],
  'cust-3': [
    { productName: 'Heavy Machinery Part A', salesTarget: 7000, salesAmount: 6500 },
    { productName: 'Service Agreement', salesTarget: 5000, salesAmount: 4000 },
  ],
};

export type MonthlyDetail = {
    month: string;
    details: {
        customerName: string;
        products: {
            productName: string;
            target: number;
            actual: number;
        }[];
    }[];
};

export const monthlyDetailReportData: MonthlyDetail[] = [
    {
        month: '1월',
        details: [
            {
                customerName: 'Global Tech Inc.',
                products: [
                    { productName: 'Laptop Model X', target: 20000, actual: 18000 },
                    { productName: 'Software Suite', target: 10000, actual: 12000 },
                ]
            },
        ]
    },
    {
        month: '9월',
        details: [
            {
                customerName: 'Global Tech Inc.',
                products: [
                    { productName: 'Laptop Model X', target: 25000, actual: 26000 },
                    { productName: 'Software Suite', target: 15000, actual: 14000 },
                ]
            },
            {
                customerName: 'Apex Industries',
                products: [
                    { productName: 'Heavy Machinery Part A', target: 15000, actual: 18000 },
                    { productName: 'Service Agreement', target: 10000, actual: 9000 },
                ]
            }
        ]
    }
];

export const salesTargetManagementData = [
  {
    customerName: 'Global Tech Inc.',
    customerCode: 'C-101',
    employeeName: 'Jane Smith',
    employeeId: 'jane-smith',
    year: 2023,
    month: 9,
    products: [
      { productCode: 'e-001', productName: 'High-Performance Laptop', target: 20000 },
      { productCode: 'e-002', productName: 'Latest Model Smartphone', target: 15000 },
    ]
  },
  {
    customerName: 'Apex Industries',
    customerCode: 'C-104',
    employeeName: 'Alex Ray',
    employeeId: 'alex-ray',
    year: 2023,
    month: 9,
    products: [
      { productCode: 'hg-001', productName: 'Automatic Coffee Maker', target: 5000 },
    ]
  },
  {
    customerName: 'Starlight Corp',
    customerCode: 'C-105',
    employeeName: 'John Doe',
    employeeId: 'john-doe',
    year: 2023,
    month: 9,
    products: [
      { productCode: 'e-001', productName: 'High-Performance Laptop', target: 30000 },
      { productCode: 'b-001', productName: 'The History of Time', target: 2000 },
    ]
  },
    {
    customerName: 'Global Tech Inc.',
    customerCode: 'C-101',
    employeeName: 'Jane Smith',
    employeeId: 'jane-smith',
    year: 2023,
    month: 8,
    products: [
      { productCode: 'e-001', productName: 'High-Performance Laptop', target: 18000 },
      { productCode: 'e-002', productName: 'Latest Model Smartphone', target: 12000 },
    ]
  },
];

    