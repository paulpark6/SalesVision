
// @/lib/mock-data.ts

import type { DuePayment, CashSale, CheckPayment, CheckStatus } from './types';

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
    { name: 'Jan', sales: 4000, target: 5000 },
    { name: 'Feb', sales: 3000, target: 4000 },
    { name: 'Mar', sales: 4500, target: 4500 },
    { name: 'Apr', sales: 5000, target: 5500 },
    { name: 'May', sales: 4800, target: 5000 },
    { name: 'Jun', sales: 5200, target: 5200 },
    { name: 'Jul', sales: 5500, target: 6000 },
    { name: 'Aug', sales: 5800, target: 6000 },
    { name: 'Sep', sales: 45231.89, target: 50000 },
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
    id: 'inv-001',
    customer: {
      name: 'Acme Inc.',
      email: 'contact@acme.inc',
    },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2024-08-15',
    amount: 2500.0,
    collectionPlan: '8월 10일 이메일 발송 완료',
  },
  {
    id: 'inv-002',
    customer: {
      name: 'Stark Industries',
      email: 'tony@stark.com',
    },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2024-09-20',
    amount: 1500.5,
  },
  {
    id: 'inv-003',
    customer: {
      name: 'Wayne Enterprises',
      email: 'bruce@wayne.com',
    },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: '2024-09-30',
    amount: 5500.0,
  },
  {
    id: 'inv-004',
    customer: {
      name: 'Ollivanders',
      email: 'contact@ollivanders.co.uk',
    },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2023-07-01',
    amount: 300.0,
    collectionPlan: '담당자 부재, 9월 15일 재연락 예정',
  },
   {
    id: 'inv-005',
    customer: {
      name: 'Cyberdyne Systems',
      email: 'info@cyberdyne.com',
    },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2022-01-10',
    amount: 12500.0,
    collectionPlan: '장기 연체. 법적 조치 검토 중.',
  },
];

export const salesTrendCsvData = `Date,Category,Product,Customer,Quantity,Price
2023-01-15,Electronics,Laptop,Customer A,2,2400
2023-01-20,Books,Fiction Novel,Customer B,5,75
2023-02-10,Electronics,Smartphone,Customer A,3,2100
2023-02-18,Clothing,T-Shirt,Customer C,10,250
2023-03-05,Electronics,Laptop,Customer D,1,1200
2023-07-21,Electronics,Headphones,Customer B,4,400
2023-07-25,Books,Cookbook,Customer E,2,50
2023-08-01,Clothing,Jeans,Customer F,3,210
2023-08-15,Electronics,Smartphone,Customer G,2,1500
2023-12-10,Electronics,Laptop,Customer H,3,3600
2023-12-20,Toys,Action Figure,Customer I,10,200`;

export const employees = [
  { value: 'all', label: '전체', role: 'all', name: 'All' },
  { value: 'john-doe', label: 'John Doe (Admin)', role: 'admin', name: 'John Doe', manager: null },
  { value: 'alex-ray', label: 'Alex Ray (Manager)', role: 'manager', name: 'Alex Ray', manager: 'john-doe' },
  { value: 'jane-smith', label: 'Jane Smith (Employee)', role: 'employee', name: 'Jane Smith', manager: 'alex-ray' },
  { value: 'admin-user', label: 'Admin User (Admin)', role: 'admin', name: 'Admin User', manager: null },
];

export const products = [
    { value: 'e-001', label: 'Laptop Pro 15"', basePrice: 1200, categoryCode: 'electronics' },
    { value: 'e-002', label: 'Smartphone X', basePrice: 850, categoryCode: 'electronics' },
    { value: 'h-001', label: 'Ergonomic Chair', basePrice: 450, categoryCode: 'home-goods' },
    { value: 'b-001', label: 'The Last Server', basePrice: 15.99, categoryCode: 'books' },
    { value: 'e-003', label: 'Wireless Earbuds', basePrice: 129.99, categoryCode: 'electronics' },
    { value: 'c-001', label: 'Branded Hoodie', basePrice: 45, categoryCode: 'clothing' },
];

export const customers = [
    { value: 'c-101', label: 'Acme Inc.', grade: 'A' },
    { value: 'c-102', label: 'Stark Industries', grade: 'A' },
    { value: 'c-103', label: 'Wayne Enterprises', grade: 'B' },
    { value: 'c-104', label: 'Cyberdyne Systems', grade: 'C' },
    { value: 'c-105', label: 'Gekko & Co', grade: 'B' },
];

export const salesReportData = [
  { employeeName: 'Jane Smith', customerName: 'Acme Inc.', customerCode: 'C-101', target: 15000, actual: 16500 },
  { employeeName: 'Jane Smith', customerName: 'Stark Industries', customerCode: 'C-102', target: 10000, actual: 9500 },
  { employeeName: 'Alex Ray', customerName: 'Wayne Enterprises', customerCode: 'C-103', target: 20000, actual: 21000 },
  { employeeName: 'Alex Ray', customerName: 'Cyberdyne Systems', customerCode: 'C-104', target: 5000, actual: 6000 },
  { employeeName: 'John Doe', customerName: 'Gekko & Co', customerCode: 'C-105', target: 8000, actual: 8000 },
  { employeeName: 'Jane Smith', customerName: 'Globex Corporation', customerCode: 'C-106', target: 7000, actual: 5500 },
];

export const cumulativeReportData = [
    { month: 'Jan', target: 50000, actual: 48000, lastYear: 45000 },
    { month: 'Feb', target: 50000, actual: 51000, lastYear: 47000 },
    { month: 'Mar', target: 50000, actual: 55000, lastYear: 52000 },
    { month: 'Apr', target: 55000, actual: 56000, lastYear: 54000 },
    { month: 'May', target: 55000, actual: 58000, lastYear: 56000 },
    { month: 'Jun', target: 60000, actual: 61000, lastYear: 58000 },
    { month: 'Jul', target: 60000, actual: 63000, lastYear: 61000 },
    { month: 'Aug', target: 60000, actual: 65000, lastYear: 62000 },
    { month: 'Sep', target: 65000, actual: 45231.89, lastYear: 63000 },
    { month: 'Oct', target: 65000, actual: 0, lastYear: 67000 },
    { month: 'Nov', target: 70000, actual: 0, lastYear: 72000 },
    { month: 'Dec', target: 80000, actual: 0, lastYear: 78000 },
];

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 100000, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' },
      { type: '수입', salePrice: 50000, costPrice: 40000, customerType: 'transfer' },
      { type: '현지', salePrice: 10000, costPrice: 8000, customerType: 'own' }, // margin 20% -> 12%
      { type: '현지', salePrice: 12000, costPrice: 9000, customerType: 'transfer' }, // margin 25% -> 12% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입', salePrice: 250000, costPrice: 180000, customerType: 'own' },
      { type: '현지', salePrice: 20000, costPrice: 12000, customerType: 'own' }, // margin 40% -> 18%
      { type: '현지', salePrice: 5000, costPrice: 4800, customerType: 'own' }, // margin 4% -> 3%
    ],
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 300000, costPrice: 200000, customerType: 'transfer' },
      { type: '현지', salePrice: 15000, costPrice: 10000, customerType: 'transfer' }, // margin 33.3% -> 15% * 0.5
    ],
  },
];


export const cashSalesData: CashSale[] = [
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Walk-in Customer', amount: 150.00, source: '현금 판매' },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Acme Inc.', amount: 500.00, source: '신용 수금' },
  { id: 'CS-003', date: '2024-09-03', employeeName: 'Jane Smith', customerName: 'Stark Industries', amount: 300.50, source: '신용 수금' },
  { id: 'CS-004', date: '2024-09-05', employeeName: 'John Doe', customerName: 'QuickMart', amount: 85.75, source: '현금 판매' },
  { id: 'CS-005', date: '2024-09-09', employeeName: 'Alex Ray', customerName: 'Wayne Enterprises', amount: 1200.00, source: '신용 수금' },
  { id: 'CS-006', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Walk-in Customer', amount: 200.00, source: '현금 판매' },
];

export const checkPaymentsData: CheckPayment[] = [
    { id: 'CHK-001', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Acme Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 1500.00, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Confirmed', notes: '' },
    { id: 'CHK-002', receiptDate: '2024-09-03', dueDate: '2024-09-18', salesperson: 'Alex Ray', customerName: 'Wayne Enterprises', issuingBank: 'Citi', checkNumber: '67890', amount: 3200.50, depositBank: '', depositDate: '', status: 'Pending', notes: '' },
    { id: 'CHK-003', receiptDate: '2024-09-05', dueDate: '2024-09-20', salesperson: 'Jane Smith', customerName: 'Stark Industries', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 800.00, depositBank: 'Chase', depositDate: '2024-09-06', status: 'Confirmed', notes: '' },
    { id: 'CHK-004', receiptDate: '2024-08-20', dueDate: '2024-09-05', salesperson: 'John Doe', customerName: 'Ollivanders', issuingBank: 'Gringotts', checkNumber: '11235', amount: 50.25, depositBank: 'Bank of America', depositDate: '2024-08-21', status: 'Rejected', notes: '부도 처리. 패널티 적용.' },
];

export const productUploadCsvData = `Category,Code,Description,Import Price,Local Purchase Price
Electronics,e-006,4K Monitor,450,480
Home Goods,h-002,Standing Desk,350,380
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price (Import)
2024-09-28,Global Imports Ltd,Electronics,e-007,Gaming Mouse,150,45
2024-09-29,Component Solutions,Electronics,e-008,Mechanical Keyboard,100,75
`;

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesAmount: number;
  salesTarget: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
    { id: 'cust-001', customerName: 'Acme Inc.', salesAmount: 16500, salesTarget: 15000 },
    { id: 'cust-002', customerName: 'Stark Industries', salesAmount: 9500, salesTarget: 10000 },
    { id: 'cust-003', customerName: 'Globex Corporation', salesAmount: 5500, salesTarget: 7000 },
];

export type CustomerProductSale = {
    productName: string;
    salesAmount: number;
    salesTarget: number;
};

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    'cust-001': [ // Acme Inc.
        { productName: 'Laptop Pro 15"', salesAmount: 12000, salesTarget: 10000 },
        { productName: 'Wireless Earbuds', salesAmount: 4500, salesTarget: 5000 },
    ],
    'cust-002': [ // Stark Industries
        { productName: 'Smartphone X', salesAmount: 8500, salesTarget: 8000 },
        { productName: 'Branded Hoodie', salesAmount: 1000, salesTarget: 2000 },
    ],
    'cust-003': [ // Globex Corporation
        { productName: 'Ergonomic Chair', salesAmount: 4500, salesTarget: 5000 },
        { productName: 'The Last Server', salesAmount: 1000, salesTarget: 2000 },
    ],
};


export const monthlyDetailReportData = [
  {
    month: 'Sep',
    details: [
      {
        customerName: 'Acme Inc.',
        products: [
          { productName: 'Laptop Pro 15"', target: 10000, actual: 12000 },
          { productName: 'Wireless Earbuds', target: 5000, actual: 4500 },
        ],
      },
      {
        customerName: 'Stark Industries',
        products: [
          { productName: 'Smartphone X', target: 8000, actual: 8500 },
          { productName: 'Branded Hoodie', target: 2000, actual: 1000 },
        ],
      },
    ],
  },
  // Other months would follow here...
];

export type MonthlyDetail = typeof monthlyDetailReportData[0];


export const customerData = [
  {
    employee: 'John Doe',
    employeeId: 'john-doe',
    customerName: 'Acme Inc.',
    customerCode: 'C-101',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 16500, average: 15500 },
    ],
    yearlySales: [
      { year: 2023, amount: 180000 },
    ],
    creditBalance: 2500.00,
    contact: {
      name: 'John Smith',
      position: 'Lead Buyer',
      phone: '123-456-7890',
      address: '123 Acme St, NY',
      email: 'john.smith@acme.inc'
    },
    companyOverview: 'Leader in cartoon-style physics-defying gadgets.'
  },
  {
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    customerName: 'Stark Industries',
    customerCode: 'C-102',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 9500, average: 10000 },
    ],
    yearlySales: [
      { year: 2023, amount: 120000 },
    ],
    creditBalance: 1500.50,
     contact: {
      name: 'Pepper Potts',
      position: 'CEO',
      phone: '987-654-3210',
      address: '1 Stark Tower, NY',
      email: 'pepper.potts@stark.com'
    },
    companyOverview: 'Advanced technology and defense contractor.'
  },
  {
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    customerName: 'Wayne Enterprises',
    customerCode: 'C-103',
    customerGrade: 'B',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 21000, average: 18000 },
    ],
    yearlySales: [
      { year: 2023, amount: 200000 },
    ],
    creditBalance: 5500.00,
     contact: {
      name: 'Lucius Fox',
      position: 'CEO',
      phone: '555-123-4567',
      address: '1007 Mountain Drive, Gotham',
      email: 'lucius.fox@wayne.com'
    },
    companyOverview: 'Multinational conglomerate with a focus on applied sciences.'
  },
   {
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    customerName: 'New Customer LLC',
    customerCode: 'C-107',
    customerGrade: 'C',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [],
    yearlySales: [],
    creditBalance: 0,
     contact: {
      name: 'Pending Contact',
      position: 'N/A',
      phone: 'N/A',
      address: 'N/A',
      email: null
    },
    companyOverview: 'A newly registered customer awaiting approval.'
  },
];

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee
Dynamic Corp,C-201,A,jane-smith
Innovate LLC,C-202,B,alex-ray
Synergy Inc,C-203,C,john-doe`;


export const salesTargetManagementData = [
  {
    employeeId: 'jane-smith',
    customerName: 'Acme Inc.',
    customerCode: 'C-101',
    products: [
      {
        categoryCode: 'electronics',
        productName: 'Laptop Pro 15"',
        productCode: 'e-001',
        pastSales: { 6: 10000, 7: 11000, 8: 10500 },
        monthlyTarget: { 9: 12000, 10: 12000, 11: 13000 },
        monthlyActual: { 9: 12500, 10: 0, 11: 0 },
        quantity: { 9: 10, 10: 10, 11: 11 },
      },
      {
        categoryCode: 'electronics',
        productName: 'Wireless Earbuds',
        productCode: 'e-003',
        pastSales: { 6: 4000, 7: 4200, 8: 4100 },
        monthlyTarget: { 9: 5000, 10: 5500, 11: 6000 },
        monthlyActual: { 9: 4500, 10: 0, 11: 0 },
        quantity: { 9: 35, 10: 40, 11: 45 },
      },
    ]
  },
  {
    employeeId: 'jane-smith',
    customerName: 'Stark Industries',
    customerCode: 'C-102',
    products: [
      {
        categoryCode: 'electronics',
        productName: 'Smartphone X',
        productCode: 'e-002',
        pastSales: { 6: 8000, 7: 8500, 8: 8200 },
        monthlyTarget: { 9: 8000, 10: 9000, 11: 9500 },
        monthlyActual: { 9: 8500, 10: 0, 11: 0 },
        quantity: { 9: 10, 10: 11, 11: 12 },
      }
    ]
  },
  {
    employeeId: 'alex-ray',
    customerName: 'Wayne Enterprises',
    customerCode: 'C-103',
    products: [
      {
        categoryCode: 'home-goods',
        productName: 'Ergonomic Chair',
        productCode: 'h-001',
        pastSales: { 6: 15000, 7: 16000, 8: 15500 },
        monthlyTarget: { 9: 18000, 10: 18000, 11: 20000 },
        monthlyActual: { 9: 17500, 10: 0, 11: 0 },
        quantity: { 9: 40, 10: 40, 11: 45 },
      }
    ]
  },
  {
    employeeId: 'john-doe',
    customerName: 'Gekko & Co',
    customerCode: 'C-105',
    products: [
      {
        categoryCode: 'books',
        productName: 'The Last Server',
        productCode: 'b-001',
        pastSales: { 6: 7000, 7: 7500, 8: 7200 },
        monthlyTarget: { 9: 8000, 10: 8000, 11: 8500 },
        monthlyActual: { 9: 8000, 10: 0, 11: 0 },
        quantity: { 9: 500, 10: 500, 11: 530 },
      }
    ]
  },
  {
    employeeId: 'john-doe',
    customerName: 'Acme Inc.',
    customerCode: 'C-101',
    products: [
      {
        categoryCode: 'home-goods',
        productName: 'Ergonomic Chair',
        productCode: 'h-001',
        pastSales: { 6: 0, 7: 0, 8: 0 },
        monthlyTarget: { 9: 2000, 10: 2500, 11: 3000 },
        monthlyActual: { 9: 0, 10: 0, 11: 0 },
        quantity: { 9: 4, 10: 5, 11: 6 },
      }
    ]
  },
];
