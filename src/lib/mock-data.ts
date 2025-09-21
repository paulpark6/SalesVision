
// @/lib/mock-data.ts

import type { NavItem, NavItemWithChildren } from '@/components/app-sidebar';
import type { UserRole } from '@/hooks/use-auth';

export const overviewData = {
    totalRevenue: 45231.89,
    subscriptions: 2350,
    sales: 12234,
    activeNow: 573,
};

export const salesTargetData = {
    current: 42100.50,
    target: 50000.00,
}

export const salesTargetChartData = [
  { name: '실적', sales: 42100.50, target: 50000 },
];

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 55000, john: 38000 },
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


export type DuePayment = {
  id: string;
  customer: { name: string; email: string };
  dueDate: string;
  amount: number;
  employee: string;
  collectionPlan?: string;
};

export const duePaymentsData: DuePayment[] = [
  {
    id: 'INV-001',
    customer: { name: 'Acme Inc.', email: 'contact@acme.com' },
    dueDate: '2024-08-15',
    amount: 250.0,
    employee: 'Jane Smith',
    collectionPlan: '8월 15일 입금 요청 예정'
  },
  {
    id: 'INV-002',
    customer: { name: 'Stark Industries', email: 'tony@stark.com' },
    dueDate: '2024-09-01',
    amount: 890.5,
    employee: 'Alex Ray',
  },
  {
    id: 'INV-003',
    customer: { name: 'Wayne Enterprises', email: 'bruce@wayne.com' },
    dueDate: '2024-09-10',
    amount: 1200.0,
    employee: 'Jane Smith',
  },
  {
    id: 'INV-004',
    customer: { name: 'Globex Corporation', email: 'hank@globex.com' },
    dueDate: '2023-07-20',
    amount: 450.0,
    employee: 'John Doe',
    collectionPlan: '지속적인 연락 시도 중'
  },
  {
    id: 'INV-005',
    customer: { name: 'Cyberdyne Systems', email: 'miles@cyberdyne.com' },
    dueDate: '2024-09-25',
    amount: 600.75,
    employee: 'Alex Ray',
  },
  {
    id: 'INV-006',
    customer: { name: 'Ollivanders', email: 'contact@ollivanders.co.uk' },
    dueDate: '2022-01-10',
    amount: 1500.00,
    employee: 'John Doe',
    collectionPlan: '내용 증명 발송 완료'
  },
];

export const salesReportData = [
  {
    employeeName: 'Jane Smith',
    customerName: 'Acme Inc.',
    customerCode: 'C-101',
    target: 5000,
    actual: 4500,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Stark Industries',
    customerCode: 'C-102',
    target: 10000,
    actual: 12500,
  },
  {
    employeeName: 'John Doe',
    customerName: 'Wayne Enterprises',
    customerCode: 'C-103',
    target: 8000,
    actual: 8000,
  },
  {
    employeeName: 'Jane Smith',
    customerName: 'Globex Corporation',
    customerCode: 'C-104',
    target: 3000,
    actual: 3500,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Cyberdyne Systems',
    customerCode: 'C-105',
    target: 7500,
    actual: 6000,
  },
];

export const products = [
  { value: 'e-001', label: 'Laptop Pro', basePrice: 1200 },
  { value: 'e-002', label: 'Smartphone X', basePrice: 900 },
  { value: 'e-003', label: 'Wireless Earbuds', basePrice: 150 },
  { value: 'c-001', label: 'Designer T-Shirt', basePrice: 50 },
  { value: 'b-001', label: 'The Last Server', basePrice: 25 },
];

export const customers = [
    { value: 'c-101', label: 'Acme Inc.', grade: 'A' },
    { value: 'c-102', label: 'Stark Industries', grade: 'A' },
    { value: 'c-103', label: 'Wayne Enterprises', grade: 'B' },
    { value: 'c-104', label: 'Globex Corporation', grade: 'C' },
    { value: 'c-105', label: 'Cyberdyne Systems', grade: 'B' },
];

export const employees = [
  { value: 'emp-001', label: 'Jane Smith (EMP-001)', role: 'employee', name: 'Jane Smith' },
  { value: 'emp-002', label: 'Alex Ray (EMP-002)', role: 'manager', name: 'Alex Ray' },
  { value: 'emp-003', label: 'John Doe (EMP-003)', role: 'employee', name: 'John Doe' },
  { value: 'admin-001', label: 'Admin User (ADMIN-001)', role: 'admin', name: 'Admin User' },
];

export const salesTrendCsvData = `Date,Category,Product,Customer,Amount
2023-01-15,Electronics,Laptop Pro,Acme Inc.,2400
2023-01-20,Electronics,Smartphone X,Stark Industries,1800
2023-02-10,Clothing,Designer T-Shirt,Acme Inc.,500
2023-03-05,Books,"The Last Server",Wayne Enterprises,125
2023-04-18,Electronics,Laptop Pro,Cyberdyne Systems,3600
2023-05-25,Electronics,Wireless Earbuds,Stark Industries,750
2023-06-12,Clothing,Designer T-Shirt,Globex Corporation,300
2023-07-30,Electronics,Smartphone X,Acme Inc.,2700
2023-08-11,Books,"The Last Server",Stark Industries,50
2023-09-22,Electronics,Laptop Pro,Wayne Enterprises,1200
2023-10-14,Electronics,Wireless Earbuds,Acme Inc.,450
2023-11-09,Clothing,Designer T-Shirt,Cyberdyne Systems,250
2023-12-01,Electronics,Smartphone X,Globex Corporation,900`;


export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Acme Inc.',
    customerCode: 'A0001',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
        { month: 9, actual: 4500, average: 4800 },
        { month: 8, actual: 5200, average: 4700 },
    ],
    yearlySales: [
        { year: 2024, amount: 45000 },
        { year: 2023, amount: 55000 },
    ],
    creditBalance: 12500.50,
    contact: {
      name: 'John Smith',
      position: 'Purchasing Manager',
      phone: '123-456-7890',
      address: '123 Main St, Anytown',
      email: 'john.s@acme.com',
    },
    companyOverview: 'Acme Inc. is a leading manufacturer of widgets and gadgets for the modern consumer.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Stark Industries',
    customerCode: 'A0002',
    customerGrade: 'A',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
     monthlySales: [
        { month: 9, actual: 12500, average: 11000 },
    ],
    yearlySales: [
        { year: 2024, amount: 115000 },
    ],
    creditBalance: 3500.00,
     contact: {
      name: 'Pepper Potts',
      position: 'CEO',
      phone: '987-654-3210',
      address: '1 Stark Tower, New York',
      email: 'p.potts@starkind.com',
    },
    companyOverview: 'Stark Industries is a global leader in technology and defense.'
  },
   {
    employee: 'Alex Ray',
    customerName: 'NewTech Solutions',
    customerCode: 'B0012',
    customerGrade: 'B',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [],
    yearlySales: [],
    creditBalance: 0,
    contact: {
      name: 'Jane Doe',
      position: 'Tech Lead',
      phone: '555-123-4567',
      address: '456 Innovation Dr, Techville',
      email: 'jane.d@newtech.com',
    },
    companyOverview: 'A newly onboarded client specializing in cloud solutions.'
  },
];


export const employeeCustomerSales = [
    { id: 1, customerName: 'Acme Inc.', salesTarget: 10000, salesAmount: 8500 },
    { id: 2, customerName: 'Globex Corp.', salesTarget: 8000, salesAmount: 9200 },
    { id: 3, customerName: 'Soylent Corp.', salesTarget: 5000, salesAmount: 3500 },
];

export const customerProductSalesDetails: Record<number, { productName: string; salesTarget: number; salesAmount: number }[]> = {
    1: [
        { productName: 'Widget A', salesTarget: 5000, salesAmount: 4000 },
        { productName: 'Widget B', salesTarget: 3000, salesAmount: 3000 },
        { productName: 'Service Pack', salesTarget: 2000, salesAmount: 1500 },
    ],
    2: [
        { productName: 'Gadget Pro', salesTarget: 6000, salesAmount: 7000 },
        { productName: 'Support Plan', salesTarget: 2000, salesAmount: 2200 },
    ],
    3: [
        { productName: 'Nutrient Paste', salesTarget: 5000, salesAmount: 3500 },
    ],
};


export const cumulativeReportData = [
  { month: '1월', target: 30000, actual: 28000, lastYear: 27000 },
  { month: '2월', target: 30000, actual: 32000, lastYear: 29000 },
  { month: '3월', target: 30000, actual: 35000, lastYear: 33000 },
  { month: '4월', target: 35000, actual: 36000, lastYear: 34000 },
  { month: '5월', target: 35000, actual: 38000, lastYear: 36000 },
  { month: '6월', target: 35000, actual: 40000, lastYear: 38000 },
  { month: '7월', target: 40000, actual: 42000, lastYear: 41000 },
  { month: '8월', target: 40000, actual: 43000, lastYear: 42000 },
  { month: '9월', target: 45000, actual: 42100, lastYear: 44000 },
  { month: '10월', target: 45000, actual: 0, lastYear: 46000 },
  { month: '11월', target: 50000, actual: 0, lastYear: 52000 },
  { month: '12월', target: 55000, actual: 0, lastYear: 58000 },
];


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
    month: '9월',
    details: [
      {
        customerName: 'Acme Inc.',
        products: [
          { productName: 'Widget A', target: 2000, actual: 1800 },
          { productName: 'Widget B', target: 1500, actual: 1500 },
        ],
      },
      {
        customerName: 'Stark Industries',
        products: [
          { productName: 'Gadget Pro', target: 5000, actual: 6000 },
          { productName: 'Service Plan', target: 1000, actual: 800 },
        ],
      },
       {
        customerName: 'Wayne Enterprises',
        products: [
          { productName: 'Security System', target: 3000, actual: 3200 },
        ],
      },
    ],
  },
  // Data for other months can be added here
];

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee
"Innovate LLC","A0003","B","emp-001"
"Future Systems","A0004","C","emp-003"
"Quantum Leap","B0015","A","emp-002"
`;

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2024-09-15,"Global Imports","Electronics","E-004","4K Monitor",50,350
2024-09-16,"TechSuppliers","Electronics","E-005","Mechanical Keyboard",100,75
`;

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPrice
Electronics,E-006,"USB-C Hub",15,25
Home Goods,H-002,"Smart Mug",30,45
`;

export type CashSale = {
  id: string;
  date: string; // YYYY-MM-DD
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금'; // Cash Sale or Credit Collection
  amount: number;
};

export const cashSalesData: CashSale[] = [
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Acme Inc.', source: '신용 수금', amount: 500 },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Cyberdyne Systems', source: '현금 판매', amount: 250 },
  { id: 'CS-003', date: '2024-09-03', employeeName: 'John Doe', customerName: 'Globex Corp', source: '현금 판매', amount: 120 },
  { id: 'CS-004', date: '2024-09-05', employeeName: 'Jane Smith', customerName: 'Stark Industries', source: '신용 수금', amount: 1000 },
  { id: 'CS-005', date: '2024-09-09', employeeName: 'Alex Ray', customerName: 'Acme Inc.', source: '현금 판매', amount: 300 },
  { id: 'CS-006', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Wayne Enterprises', source: '신용 수금', amount: 750 },
];


export type CheckStatus = 'Pending' | 'Confirmed' | 'Rejected';

export type CheckPayment = {
  id: string;
  receiptDate: string; // 수취일
  dueDate: string; // 만기일
  salesperson: string;
  customerName: string;
  issuingBank: string; // 발급은행
  checkNumber: string; // 수표번호
  amount: number;
  depositBank?: string; // 입금은행
  depositDate?: string; // 입금일자
  status: CheckStatus;
  notes?: string; // 비고
};

export const checkPaymentsData: CheckPayment[] = [
    { id: 'CHK-001', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Acme Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 1500, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Confirmed', notes: '' },
    { id: 'CHK-002', receiptDate: '2024-09-05', dueDate: '2024-11-05', salesperson: 'Alex Ray', customerName: 'Stark Industries', issuingBank: 'Citi', checkNumber: '67890', amount: 3200, status: 'Pending', notes: '' },
    { id: 'CHK-003', receiptDate: '2024-09-10', dueDate: '2024-10-10', salesperson: 'John Doe', customerName: 'Wayne Enterprises', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 800, status: 'Pending', notes: '고객 요청으로 만기일 짧음' },
    { id: 'CHK-004', receiptDate: '2024-08-20', dueDate: '2024-09-20', salesperson: 'Jane Smith', customerName: 'Globex Corporation', issuingBank: 'Bank of America', checkNumber: '98765', amount: 2100, depositBank: 'Chase', depositDate: '2024-08-21', status: 'Rejected', notes: '잔액 부족' },
];

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입', salePrice: 250000, costPrice: 200000, customerType: 'own' as 'own' },
      { type: '수입' as '수입', salePrice: 100000, costPrice: 80000, customerType: 'transfer' as 'transfer' }, // 1% rate
      { type: '현지' as '현지', salePrice: 20000, costPrice: 12000, customerType: 'own' as 'own' }, // margin 40%, rate 18%
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입', salePrice: 150000, costPrice: 120000, customerType: 'own' as 'own' },
      { type: '현지' as '현지', salePrice: 50000, costPrice: 46000, customerType: 'own' as 'own' }, // margin 8%, rate 3%
      { type: '현지' as '현지', salePrice: 30000, costPrice: 25000, customerType: 'transfer' as 'transfer' }, // margin 16.7%, rate 10% -> 5%
    ],
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입' as '수입', salePrice: 80000, costPrice: 70000, customerType: 'transfer' as 'transfer' },
      { type: '현지' as '현지', salePrice: 100000, costPrice: 65000, customerType: 'own' as 'own' }, // margin 35%, rate 15%
    ],
  },
];
