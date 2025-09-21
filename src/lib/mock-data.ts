
import { PlaceHolderImages } from "./placeholder-images";

export type DuePayment = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  amount: number;
  dueDate: string; // ISO 8601 format date string
  collectionPlan?: string;
};

export const duePaymentsData: DuePayment[] = [
  {
    id: 'INV-001',
    customer: { name: 'Acme Inc.', email: 'contact@acme.com' },
    employee: 'John Doe',
    amount: 250.0,
    dueDate: '2023-09-25',
    collectionPlan: '9월 20일 이메일 발송 완료'
  },
  {
    id: 'INV-002',
    customer: { name: 'Stark Industries', email: 'tony@stark.com' },
    employee: 'Jane Smith',
    amount: 150.75,
    dueDate: '2023-10-15',
  },
  {
    id: 'INV-003',
    customer: { name: 'Wayne Enterprises', email: 'bruce@wayne.com' },
    employee: 'Alex Ray',
    amount: 350.0,
    dueDate: '2023-08-30',
  },
  {
    id: 'INV-004',
    customer: { name: 'Ollivanders', email: 'contact@ollivanders.co.uk' },
    employee: 'John Doe',
    amount: 450.0,
    dueDate: '2023-10-20',
  },
  {
    id: 'INV-005',
    customer: { name: 'Gekko & Co.', email: 'gordon@gekko.com' },
    employee: 'Jane Smith',
    amount: 550.0,
    dueDate: '2023-09-10',
  },
   {
    id: 'INV-006',
    customer: { name: 'Cyberdyne Systems', email: 'info@cyberdyne.com' },
    employee: 'Alex Ray',
    amount: 200.0,
    dueDate: '2023-07-15',
  },
   {
    id: 'INV-007',
    customer: { name: 'Buy n Large', email: 'support@bnl.com' },
    employee: 'Jane Smith',
    amount: 300.50,
    dueDate: '2023-06-01',
  },
];

export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  current: 38000,
  target: 42000,
};

export const salesTargetChartData = [
  { name: '영업 1팀', sales: 18000, target: 20000 },
  { name: '영업 2팀', sales: 22000, target: 25000 },
  { name: '신규사업팀', sales: 7000, target: 10000 },
];

export const recentSalesData = [
  {
    customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com' },
    amount: 1999.0,
  },
  {
    customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com' },
    amount: 39.0,
  },
  {
    customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
    amount: 299.0,
  },
  {
    customer: { name: 'William Kim', email: 'will@email.com' },
    amount: 99.0,
  },
  {
    customer: { name: 'Sofia Davis', email: 'sofia.davis@email.com' },
    amount: 39.0,
  },
];

export const salesTrendCsvData = `Date,Category,Product,Price,Quantity
2023-01-15,Electronics,Laptop,1200,10
2023-01-16,Books,Science Fiction Novel,15,50
2023-02-20,Clothing,T-Shirt,25,200
2023-03-10,Electronics,Smartphone,800,15
2023-04-05,Home Goods,Coffee Maker,100,20
2023-05-21,Clothing,Jeans,75,100
2023-06-18,Books,Cookbook,30,30
2023-07-30,Electronics,Headphones,150,40
2023-08-11,Clothing,Jacket,120,60
2023-09-01,Home Goods,Blender,90,25
2023-09-02,Electronics,Laptop,1250,5
2023-09-03,Clothing,T-Shirt,25,150
`;


export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const customers = [
    { value: 'c-101', label: 'Acme Inc.', grade: 'A' },
    { value: 'c-102', label: 'Stark Industries', grade: 'A' },
    { value: 'c-103', label: 'Wayne Enterprises', grade: 'B' },
    { value: 'c-104', label: 'Ollivanders', grade: 'C' },
    { value: 'c-105', label: 'Gekko & Co.', grade: 'B' },
    { value: 'c-106', label: 'Cyberdyne Systems', grade: 'A' },
    { value: 'c-107', label: 'Buy n Large', grade: 'C' },
];

export const products = [
    { value: 'e-001', label: 'High-Performance Laptop', basePrice: 1200.00 },
    { value: 'e-002', label: 'Wireless Noise-Cancelling Headphones', basePrice: 250.00 },
    { value: 'c-001', label: 'Premium Cotton T-Shirt', basePrice: 35.00 },
    { value: 'c-002', label: 'Classic Denim Jeans', basePrice: 80.00 },
    { value: 'h-001', label: 'Smart Coffee Maker', basePrice: 150.00 },
];

export const productUploadCsvData = `Category,Product Code,Description,Import Price,Local Purchase Price
Electronics,E-003,Ultra-Thin 4K Monitor,650,680
Electronics,E-004,Mechanical Gaming Keyboard,120,130
Apparel,C-003,Waterproof Winter Jacket,150,165
Home Goods,H-002,Robotic Vacuum Cleaner,400,425
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price (Import)
2023-09-15,Global Imports Ltd.,Electronics,E-003,Ultra-Thin 4K Monitor,50,650
2023-09-16,Tech Suppliers Inc.,Electronics,E-004,Mechanical Gaming Keyboard,100,120
2023-09-17,Fashion Forward,Apparel,C-003,Waterproof Winter Jacket,75,150
`;


export const employees = [
    { value: 'EMP-001', label: 'John Doe', name: 'John Doe', role: 'admin' },
    { value: 'EMP-002', label: 'Jane Smith', name: 'Jane Smith', role: 'employee' },
    { value: 'EMP-003', label: 'Alex Ray', name: 'Alex Ray', role: 'manager' },
];

export const salesReportData = [
  { customerCode: 'C-101', customerName: 'Acme Inc.', employeeName: 'Jane Smith', target: 5000, actual: 5500 },
  { customerCode: 'C-102', customerName: 'Stark Industries', employeeName: 'Jane Smith', target: 8000, actual: 7500 },
  { customerCode: 'C-103', customerName: 'Wayne Enterprises', employeeName: 'John Doe', target: 3000, actual: 3100 },
  { customerCode: 'C-104', customerName: 'Ollivanders', employeeName: 'Alex Ray', target: 2000, actual: 2500 },
  { customerCode: 'C-105', customerName: 'Gekko & Co.', employeeName: 'Alex Ray', target: 10000, actual: 12000 },
  { customerCode: 'C-106', customerName: 'Cyberdyne Systems', employeeName: 'Jane Smith', target: 6000, actual: 5800 },
];

export const cumulativeReportData = [
  { month: 'Jan', target: 30000, actual: 32000, lastYear: 28000 },
  { month: 'Feb', target: 30000, actual: 28000, lastYear: 29000 },
  { month: 'Mar', target: 35000, actual: 36000, lastYear: 33000 },
  { month: 'Apr', target: 35000, actual: 37000, lastYear: 34000 },
  { month: 'May', target: 40000, actual: 41000, lastYear: 38000 },
  { month: 'Jun', target: 40000, actual: 42000, lastYear: 39000 },
  { month: 'Jul', target: 45000, actual: 43000, lastYear: 41000 },
  { month: 'Aug', target: 45000, actual: 46000, lastYear: 44000 },
  { month: 'Sep', target: 50000, actual: 51000, lastYear: 48000 },
  { month: 'Oct', target: 50000, actual: 0, lastYear: 52000 },
  { month: 'Nov', target: 55000, actual: 0, lastYear: 58000 },
  { month: 'Dec', target: 60000, actual: 0, lastYear: 65000 },
];

export const commissionData = [
  {
    employeeId: 'EMP-002',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 150000, costPrice: 100000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' },
      { type: '수입', salePrice: 120000, costPrice: 90000, customerType: 'transfer' },
      { type: '현지', salePrice: 5000, costPrice: 3000, customerType: 'own' }, // margin 40% -> 18% rate
      { type: '현지', salePrice: 2000, costPrice: 1500, customerType: 'own' }, // margin 25% -> 12% rate
      { type: '현지', salePrice: 3000, costPrice: 2800, customerType: 'transfer' }, // margin < 10% -> 3% rate, halved
    ],
  },
  {
    employeeId: 'EMP-001',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 250000, costPrice: 180000, customerType: 'own' },
      { type: '현지', salePrice: 10000, costPrice: 8500, customerType: 'own' }, // margin 15% -> 10% rate
      { type: '현지', salePrice: 12000, costPrice: 6000, customerType: 'transfer' }, // margin 50% -> 18% rate, halved
    ],
  },
];


export const customerData = [
    {
        employee: 'Jane Smith',
        customerName: 'Acme Inc.',
        customerCode: 'A0001',
        customerGrade: 'A',
        customerType: 'own' as 'own' | 'transfer' | 'pending',
        monthlySales: [ { month: 9, actual: 5500, average: 5200 } ],
        yearlySales: [ { year: 2023, amount: 48000 } ],
        creditBalance: 1250.50,
        contact: {
            name: 'John Smith',
            position: 'Purchasing Manager',
            phone: '123-456-7890',
            address: '123 Acme St, Business City',
            email: 'john.smith@acme.com',
        },
        companyOverview: 'Acme Inc. is a leading manufacturer of widgets and gadgets for the industrial sector. They have been a loyal customer for over 5 years.'
    },
    {
        employee: 'Alex Ray',
        customerName: 'Stark Industries',
        customerCode: 'A0002',
        customerGrade: 'A',
        customerType: 'transfer' as 'own' | 'transfer' | 'pending',
        monthlySales: [ { month: 9, actual: 7500, average: 7800 } ],
        yearlySales: [ { year: 2023, amount: 65000 } ],
        creditBalance: 3200.00,
        contact: {
            name: 'Pepper Potts',
            position: 'CEO',
            phone: '987-654-3210',
            address: '10880 Malibu Point, CA',
            email: 'p.potts@starkind.com',
        },
        companyOverview: 'Stark Industries is a global leader in technology and defense. High volume but requires significant relationship management.'
    },
    {
        employee: 'Jane Smith',
        customerName: 'New Horizons',
        customerCode: 'B0015',
        customerGrade: 'B',
        customerType: 'pending' as 'own' | 'transfer' | 'pending',
        monthlySales: [ { month: 9, actual: 1200, average: 1000 } ],
        yearlySales: [ { year: 2023, amount: 8000 } ],
        creditBalance: 500.00,
        contact: {
            name: 'Sarah Connor',
            position: 'Supply Chain Director',
            phone: '555-123-4567',
            address: '456 Future Way, Tech City',
            email: 's.connor@newhorizons.io',
        },
        companyOverview: 'A new and promising tech startup specializing in AI-driven logistics solutions. Recently onboarded.'
    },
];

export const customerUploadCsvData = `Employee,CustomerName,CustomerCode,Grade
EMP-002,Global Tech,A0003,A
EMP-003,Innovate Solutions,A0004,B
EMP-002,Future Gadgets,B0021,C
`;

export type CashSale = {
  id: string;
  date: string;
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
}

export const cashSalesData: CashSale[] = [
  { id: 'CS001', date: '2023-09-18', employeeName: 'Jane Smith', customerName: 'Acme Inc.', source: '신용 수금', amount: 500 },
  { id: 'CS002', date: '2023-09-18', employeeName: 'Alex Ray', customerName: 'Local Retail', source: '현금 판매', amount: 150 },
  { id: 'CS003', date: '2023-09-19', employeeName: 'Jane Smith', customerName: 'Stark Industries', source: '신용 수금', amount: 1000 },
  { id: 'CS004', date: '2023-09-20', employeeName: 'John Doe', customerName: 'Walk-in Customer', source: '현금 판매', amount: 80 },
  { id: 'CS005', date: '2023-09-11', employeeName: 'Alex Ray', customerName: 'Gekko & Co.', source: '신용 수금', amount: 2000 },
  { id: 'CS006', date: '2023-09-12', employeeName: 'Jane Smith', customerName: 'Acme Inc.', source: '현금 판매', amount: 300 },
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
  { id: 'CHK001', receiptDate: '2023-09-01', dueDate: '2023-10-01', salesperson: 'Jane Smith', customerName: 'Acme Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 1500, depositBank: 'Chase', depositDate: '2023-10-02', status: 'Confirmed', notes: '정상 입금' },
  { id: 'CHK002', receiptDate: '2023-09-05', dueDate: '2023-09-25', salesperson: 'Alex Ray', customerName: 'Wayne Enterprises', issuingBank: 'Citi', checkNumber: '67890', amount: 2500, depositBank: '', depositDate: '', status: 'Pending', notes: '만기일 확인 필요' },
  { id: 'CHK003', receiptDate: '2023-09-10', dueDate: '2023-09-15', salesperson: 'Jane Smith', customerName: 'Stark Industries', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 800, depositBank: 'Chase', depositDate: '2023-09-18', status: 'Rejected', notes: '잔액 부족' },
  { id: 'CHK004', receiptDate: '2023-09-12', dueDate: '2023-11-12', salesperson: 'John Doe', customerName: 'Gekko & Co.', issuingBank: 'Goldman Sachs', checkNumber: '11223', amount: 5000, depositBank: '', depositDate: '', status: 'Pending', notes: '고액 수표' },
];

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
    { id: 'ecs-01', customerName: 'Acme Inc.', salesTarget: 10000, salesAmount: 11500 },
    { id: 'ecs-02', customerName: 'Stark Industries', salesTarget: 15000, salesAmount: 12500 },
    { id: 'ecs-03', customerName: 'Cyberdyne Systems', salesTarget: 8000, salesAmount: 9000 },
    { id: 'ecs-04', customerName: 'Buy n Large', salesTarget: 5000, salesAmount: 2500 },
];

export type CustomerProductSale = {
    productName: string;
    salesTarget: number;
    salesAmount: number;
};

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    'ecs-01': [
        { productName: 'High-Performance Laptop', salesTarget: 8000, salesAmount: 9600 },
        { productName: 'Wireless Noise-Cancelling Headphones', salesTarget: 2000, salesAmount: 1900 },
    ],
    'ecs-02': [
        { productName: 'High-Performance Laptop', salesTarget: 10000, salesAmount: 8400 },
        { productName: 'Smart Coffee Maker', salesTarget: 5000, salesAmount: 4100 },
    ],
    'ecs-03': [
        { productName: 'Classic Denim Jeans', salesTarget: 4000, salesAmount: 5000 },
        { productName: 'Premium Cotton T-Shirt', salesTarget: 4000, salesAmount: 4000 },
    ],
    'ecs-04': [
        { productName: 'Robotic Vacuum Cleaner', salesTarget: 5000, salesAmount: 2500 },
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
    month: 'Sep',
    details: [
      {
        customerName: 'Acme Inc.',
        products: [
          { productName: 'Laptop', target: 20000, actual: 22000 },
          { productName: 'Headphones', target: 5000, actual: 4500 },
        ],
      },
      {
        customerName: 'Stark Industries',
        products: [
          { productName: 'Laptop', target: 15000, actual: 18000 },
          { productName: 'Coffee Maker', target: 10000, actual: 6500 },
        ],
      },
    ],
  },
  // Add other months as needed
];
