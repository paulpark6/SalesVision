
// src/lib/mock-data.ts

import { subMonths, format } from 'date-fns';

export const overviewData = {
  totalRevenue: 45231.89,
  newCustomers: 573,
  sales: 12234,
  pendingOrders: 239,
};

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
        customer: { name: 'Tech Solutions Inc.', email: 'billing@techsolutions.com' },
        employee: 'Jane Smith',
        dueDate: '2023-09-15',
        amount: 2500.00,
        collectionPlan: 'Follow-up email sent on 9/10.',
    },
    {
        id: 'INV-002',
        customer: { name: 'Creative Designs LLC', email: 'accounts@creativedesigns.com' },
        employee: 'Alex Ray',
        dueDate: '2023-09-01',
        amount: 1250.50,
        collectionPlan: '',
    },
    {
        id: 'INV-003',
        customer: { name: 'Global Exports', email: 'payments@globalexports.net' },
        employee: 'John Doe',
        dueDate: '2023-08-25',
        amount: 8500.00,
        collectionPlan: 'Confirmed payment will be sent by 9/5.',
    },
    {
        id: 'INV-004',
        customer: { name: 'Retail Innovations', email: 'ap@retailinnovations.co' },
        employee: 'Jane Smith',
        dueDate: '2023-09-20',
        amount: 500.75,
        collectionPlan: '',
    },
    {
        id: 'INV-005',
        customer: { name: 'Marketing Pros', email: 'billing@marketingpros.org' },
        employee: 'Alex Ray',
        dueDate: '2023-09-10',
        amount: 3200.00,
        collectionPlan: '',
    },
    {
        id: 'INV-006',
        customer: { name: 'Westside Medical', email: 'accounts@westsidemed.com' },
        employee: 'John Doe',
        dueDate: '2022-08-01', // Over 1 year overdue
        amount: 15000.00,
        collectionPlan: 'Legal action pending.',
    }
];

export type DuePayment = typeof duePaymentsData[0];


export const salesTargetData = {
    current: 45231.89,
    target: 50000,
}

export const salesTargetChartData = [
    { name: '매출', sales: 45231.89 },
    { name: '목표', target: 50000 },
];

export const salesComparisonData = [
    { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
    { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
    { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];


export const salesReportData = [
    { employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', customerCode: 'C-101', target: 2500, actual: 2800 },
    { employeeName: 'Jane Smith', customerName: 'Retail Innovations', customerCode: 'C-104', target: 1000, actual: 800 },
    { employeeName: 'Alex Ray', customerName: 'Creative Designs LLC', customerCode: 'C-102', target: 1500, actual: 1300 },
    { employeeName: 'Alex Ray', customerName: 'Marketing Pros', customerCode: 'C-105', target: 3000, actual: 3500 },
    { employeeName: 'John Doe', customerName: 'Global Exports', customerCode: 'C-103', target: 8000, actual: 9200 },
];

export const salesTrendCsvData = `Date,Product,Category,Units Sold,Revenue
2023-01-15,Widget A,Electronics,50,5000
2023-01-20,Widget B,Electronics,30,4500
2023-02-10,Gadget X,Home Goods,100,7500
2023-02-18,Widget A,Electronics,55,5500
2023-03-05,Widget B,Electronics,40,6000
2023-03-22,Gadget Y,Home Goods,120,9600
2023-04-12,Widget A,Electronics,65,6500
2023-05-15,Super-Fabric,Clothing,200,4000
2023-05-25,Widget B,Electronics,45,6750
2023-06-10,Gadget X,Home Goods,110,8250
2023-06-18,Super-Fabric,Clothing,250,5000
2023-07-05,Widget A,Electronics,70,7000`;


export const products = [
    { value: 'p-001', label: 'Wireless Mouse', basePrice: 25.99 },
    { value: 'p-002', label: 'Mechanical Keyboard', basePrice: 120.00 },
    { value: 'p-003', label: '4K Monitor', basePrice: 350.50 },
    { value: 'p-004', label: 'USB-C Hub', basePrice: 45.00 },
    { value: 'p-005', label: 'Laptop Stand', basePrice: 35.00 },
];

export const customers = [
    { value: 'c-101', label: 'Tech Solutions Inc.', grade: 'A' },
    { value: 'c-102', label: 'Creative Designs LLC', grade: 'B' },
    { value: 'c-103', label: 'Global Exports', grade: 'A' },
    { value: 'c-104', label: 'Retail Innovations', grade: 'C' },
    { value: 'c-105', label: 'Marketing Pros', grade: 'B' },
    { value: 'c-106', label: 'Westside Medical', grade: 'A' },
];

export const employees = [
  { value: 'emp-001', label: 'Jane Smith (EMP-001)', role: 'employee', name: 'Jane Smith' },
  { value: 'emp-002', label: 'Alex Ray (EMP-002)', role: 'manager', name: 'Alex Ray' },
  { value: 'emp-003', label: 'John Doe (EMP-003)', role: 'employee', name: 'John Doe' },
  { value: 'admin', label: 'Admin User', role: 'admin', name: 'Admin User' },
];

export const customerData = [
    {
      employee: 'Jane Smith',
      customerName: 'Tech Solutions Inc.',
      customerCode: 'A0001',
      customerGrade: 'A',
      customerType: 'own' as 'own' | 'transfer' | 'pending',
      monthlySales: [
        { month: 9, actual: 2800, average: 2500 },
        { month: 8, actual: 2600, average: 2500 },
        { month: 7, actual: 2400, average: 2500 },
      ],
      yearlySales: [
        { year: 2023, amount: 25000 },
        { year: 2022, amount: 22000 },
      ],
      creditBalance: 5200.00,
      contact: { name: 'John Smith', position: 'CEO', phone: '123-456-7890', address: '123 Tech Rd, Silicon Valley', email: 'john.s@techsolutions.com' },
      companyOverview: 'Provides cutting-edge software solutions for enterprise clients. Strong focus on AI and machine learning applications.'
    },
    {
      employee: 'Alex Ray',
      customerName: 'Creative Designs LLC',
      customerCode: 'B0002',
      customerGrade: 'B',
      customerType: 'transfer' as 'own' | 'transfer' | 'pending',
      monthlySales: [
        { month: 9, actual: 1300, average: 1500 },
        { month: 8, actual: 1600, average: 1500 },
      ],
      yearlySales: [
        { year: 2023, amount: 14000 },
      ],
      creditBalance: 1250.50,
      contact: { name: 'Jane Doe', position: 'Art Director', phone: '234-567-8901', address: '456 Design Ave, Arts District', email: 'jane.d@creativedesigns.com' },
      companyOverview: 'A boutique design agency specializing in branding and web design for startups.'
    },
    {
      employee: 'John Doe',
      customerName: 'Global Exports',
      customerCode: 'C0003',
      customerGrade: 'A',
      customerType: 'own' as 'own' | 'transfer' | 'pending',
      monthlySales: [
         { month: 9, actual: 9200, average: 8000 },
      ],
      yearlySales: [
        { year: 2023, amount: 85000 },
        { year: 2022, amount: 78000 },
        { year: 2021, amount: 75000 },
      ],
      creditBalance: 15300.75,
      contact: { name: 'Peter Jones', position: 'Logistics Manager', phone: '345-678-9012', address: '789 Export Plaza, Port City', email: null },
      companyOverview: 'Manages international shipping and logistics for large-scale manufacturing companies.'
    },
     {
      employee: 'Jane Smith',
      customerName: 'Innovate Inc.',
      customerCode: 'A0004',
      customerGrade: 'C',
      customerType: 'pending' as 'own' | 'transfer' | 'pending',
      monthlySales: [],
      yearlySales: [],
      creditBalance: 0,
      contact: { name: 'Emily White', position: 'Operations', phone: '456-789-0123', address: '101 Innovation Dr', email: 'emily.w@innovate.com' },
      companyOverview: 'A new startup in the renewable energy sector, currently in the R&D phase.'
    }
];

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2023-09-01,Global Imports,Electronics,E-001,Wireless Mouse,500,15.50
2023-09-02,TechSupply Co,Electronics,E-002,Mechanical Keyboard,100,80.00
2023-09-03,Fashion Forward,Clothing,C-001,Summer Dress,200,25.00`;

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPrice
Electronics,E-006,Noise-Cancelling Headphones,150.00,180.00
Home Goods,H-003,Smart LED Bulb,12.50,15.00
`;

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee
New Age Tech,A0005,A,emp-001
Downtown Cafe,B0006,B,emp-002
`;

export type CashSale = {
  id: string;
  date: string;
  employeeName: string;
  customerName: string;
  amount: number;
  source: '현금 판매' | '신용 수금';
};

export const cashSalesData: CashSale[] = [
    { id: 'cs-001', date: '2023-09-01', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', amount: 500, source: '신용 수금' },
    { id: 'cs-002', date: '2023-09-01', employeeName: 'Alex Ray', customerName: 'Quick Mart', amount: 150, source: '현금 판매' },
    { id: 'cs-003', date: '2023-09-02', employeeName: 'John Doe', customerName: 'Global Exports', amount: 1200, source: '신용 수금' },
    { id: 'cs-004', date: '2023-09-02', employeeName: 'Jane Smith', customerName: 'Walk-in Customer', amount: 75.50, source: '현금 판매' },
    { id: 'cs-005', date: '2023-09-05', employeeName: 'Alex Ray', customerName: 'Creative Designs LLC', amount: 300, source: '신용 수금' },
    { id: 'cs-006', date: '2023-08-28', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', amount: 450, source: '신용 수금' },
    { id: 'cs-007', date: '2023-08-29', employeeName: 'John Doe', customerName: 'Global Exports', amount: 2000, source: '신용 수금' },
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
    { id: 'chk-001', receiptDate: '2023-09-01', dueDate: '2023-10-01', salesperson: 'Jane Smith', customerName: 'Tech Solutions Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 1500.00, depositBank: 'Chase', depositDate: '2023-09-02', status: 'Pending', notes: 'Awaiting clearance' },
    { id: 'chk-002', receiptDate: '2023-09-03', dueDate: '2023-09-18', salesperson: 'Alex Ray', customerName: 'Creative Designs LLC', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 800.50, depositBank: 'Chase', depositDate: '2023-09-04', status: 'Confirmed', notes: '' },
    { id: 'chk-003', receiptDate: '2023-09-05', dueDate: '2023-11-05', salesperson: 'John Doe', customerName: 'Global Exports', issuingBank: 'Citibank', checkNumber: '67890', amount: 5000.00, depositBank: 'Bank of America', depositDate: '2023-09-06', status: 'Pending', notes: 'Post-dated' },
    { id: 'chk-004', receiptDate: '2023-08-15', dueDate: '2023-08-20', salesperson: 'Jane Smith', customerName: 'Retail Innovations', issuingBank: 'Local Credit Union', checkNumber: '11223', amount: 250.00, depositBank: '', depositDate: '', status: 'Rejected', notes: 'Insufficient funds' },
];

export const cumulativeReportData = [
  { month: 'Jan', target: 30000, actual: 28000, lastYear: 25000 },
  { month: 'Feb', target: 32000, actual: 31000, lastYear: 29000 },
  { month: 'Mar', target: 35000, actual: 36000, lastYear: 33000 },
  { month: 'Apr', target: 38000, actual: 37000, lastYear: 36000 },
  { month: 'May', target: 40000, actual: 42000, lastYear: 39000 },
  { month: 'Jun', target: 42000, actual: 41000, lastYear: 40000 },
  { month: 'Jul', target: 45000, actual: 46000, lastYear: 43000 },
  { month: 'Aug', target: 48000, actual: 47000, lastYear: 46000 },
  { month: 'Sep', target: 50000, actual: 45231, lastYear: 48000 },
  { month: 'Oct', target: 55000, actual: 0, lastYear: 52000 },
  { month: 'Nov', target: 58000, actual: 0, lastYear: 55000 },
  { month: 'Dec', target: 60000, actual: 0, lastYear: 58000 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};

export type MonthlyDetail = {
  month: string;
  details: {
    customerName: string;
    products: CustomerProductSale[];
  }[];
};

export const monthlyDetailReportData: MonthlyDetail[] = [
    { 
      month: 'Sep',
      details: [
        { customerName: 'Tech Solutions Inc.', products: [ { productName: 'Wireless Mouse', salesTarget: 1000, salesAmount: 1200 }, { productName: '4K Monitor', salesTarget: 1500, salesAmount: 1600 } ] },
        { customerName: 'Retail Innovations', products: [ { productName: 'Laptop Stand', salesTarget: 1000, salesAmount: 800 } ] },
      ]
    },
    {
      month: 'Aug',
      details: [
         { customerName: 'Tech Solutions Inc.', products: [ { productName: 'Wireless Mouse', salesTarget: 1000, salesAmount: 1100 }, { productName: '4K Monitor', salesTarget: 1500, salesAmount: 1500 } ] },
      ]
    }
];

export type SalesTarget = {
  id: string;
  employeeId: string;
  customerId: string;
  customerName: string;
  month: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export const monthlySalesTargetData: SalesTarget[] = [
  { id: 'st-1', employeeId: 'emp-001', customerId: 'c-101', customerName: 'Tech Solutions Inc.', month: '2023-09', productId: 'p-001', productName: 'Wireless Mouse', quantity: 50, price: 25, total: 1250 },
  { id: 'st-2', employeeId: 'emp-001', customerId: 'c-101', customerName: 'Tech Solutions Inc.', month: '2023-09', productId: 'p-003', productName: '4K Monitor', quantity: 10, price: 350, total: 3500 },
  { id: 'st-3', employeeId: 'emp-001', customerId: 'c-104', customerName: 'Retail Innovations', month: '2023-09', productId: 'p-005', productName: 'Laptop Stand', quantity: 20, price: 30, total: 600 },
  { id: 'st-4', employeeId: 'emp-002', customerId: 'c-102', customerName: 'Creative Designs LLC', month: '2023-09', productId: 'p-002', productName: 'Mechanical Keyboard', quantity: 5, price: 120, total: 600 },
];


export type CommissionSale = {
  type: '수입' | '현지';
  salePrice: number;
  costPrice: number;
  customerType: 'own' | 'transfer';
};

export const commissionData = [
  {
    employeeId: 'emp-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 100000, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' },
      { type: '수입', salePrice: 120000, costPrice: 90000, customerType: 'transfer' },
      { type: '현지', salePrice: 5000, costPrice: 4000, customerType: 'own' }, // margin 20% -> 12%
      { type: '현지', salePrice: 10000, costPrice: 8500, customerType: 'own' }, // margin 15% -> 10%
      { type: '현지', salePrice: 20000, costPrice: 12000, customerType: 'own' }, // margin 40% -> 18%
      { type: '현지', salePrice: 8000, costPrice: 6000, customerType: 'transfer' }, // margin 25% -> 12% * 0.5
    ] as CommissionSale[]
  },
  {
    employeeId: 'emp-003',
    employeeName: 'John Doe',
    sales: [
       { type: '수입', salePrice: 180000, costPrice: 120000, customerType: 'own' },
       { type: '현지', salePrice: 15000, costPrice: 9000, customerType: 'own' }, // margin 40% -> 18%
       { type: '현지', salePrice: 12000, costPrice: 11000, customerType: 'transfer' }, // margin < 10% -> 3% * 0.5
    ] as CommissionSale[]
  }
];

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: 'ecs-001', customerName: 'Tech Solutions Inc.', salesTarget: 20000, salesAmount: 18500 },
  { id: 'ecs-002', customerName: 'Retail Innovations', salesTarget: 15000, salesAmount: 16200 },
  { id: 'ecs-003', customerName: 'Westside Medical', salesTarget: 10000, salesAmount: 8000 },
];

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    'ecs-001': [
        { productName: 'Wireless Mouse', salesTarget: 8000, salesAmount: 9500 },
        { productName: '4K Monitor', salesTarget: 12000, salesAmount: 9000 },
    ],
    'ecs-002': [
        { productName: 'Laptop Stand', salesTarget: 10000, salesAmount: 12000 },
        { productName: 'USB-C Hub', salesTarget: 5000, salesAmount: 4200 },
    ],
    'ecs-003': [
        { productName: 'Mechanical Keyboard', salesTarget: 10000, salesAmount: 8000 },
    ]
};

// --- START: Data for Sales Target Page ---

// Helper to get month name
const getMonthName = (date: Date) => format(date, 'MMMM');
const currentMonth = new Date(2023, 8, 1); // September
const prevMonth1 = subMonths(currentMonth, 1); // August
const prevMonth2 = subMonths(currentMonth, 2); // July
const prevMonth3 = subMonths(currentMonth, 3); // June

export const monthNames = {
    current: getMonthName(currentMonth),
    prev1: getMonthName(prevMonth1),
    prev2: getMonthName(prevMonth2),
    prev3: getMonthName(prevMonth3),
};

type SalesDetail = {
  productId: string;
  productName: string;
  quantity: number;
  total: number;
};

type MonthlySales = {
  month: string;
  sales: SalesDetail[];
};

type PastSalesCustomer = {
  customerId: string;
  customerName: string;
  sales: MonthlySales[];
};

export const pastSalesDetails: PastSalesCustomer[] = [
  {
    customerId: 'c-101',
    customerName: 'Tech Solutions Inc.',
    sales: [
      {
        month: monthNames.prev3, // June
        sales: [
          { productId: 'p-001', productName: 'Wireless Mouse', quantity: 20, total: 519.8 },
          { productId: 'p-003', productName: '4K Monitor', quantity: 5, total: 1752.5 },
        ],
      },
      {
        month: monthNames.prev2, // July
        sales: [
          { productId: 'p-001', productName: 'Wireless Mouse', quantity: 25, total: 649.75 },
        ],
      },
      {
        month: monthNames.prev1, // August
        sales: [
          { productId: 'p-001', productName: 'Wireless Mouse', quantity: 30, total: 779.7 },
          { productId: 'p-002', productName: 'Mechanical Keyboard', quantity: 10, total: 1200.0 },
          { productId: 'p-003', productName: '4K Monitor', quantity: 8, total: 2804.0 },
        ],
      },
    ],
  },
  {
    customerId: 'c-102',
    customerName: 'Creative Designs LLC',
    sales: [
      {
        month: monthNames.prev3, // June
        sales: [],
      },
      {
        month: monthNames.prev2, // July
        sales: [
          { productId: 'p-005', productName: 'Laptop Stand', quantity: 50, total: 1750.0 },
        ],
      },
      {
        month: monthNames.prev1, // August
        sales: [
          { productId: 'p-004', productName: 'USB-C Hub', quantity: 20, total: 900.0 },
          { productId: 'p-005', productName: 'Laptop Stand', quantity: 30, total: 1050.0 },
        ],
      },
    ],
  },
  {
    customerId: 'c-103',
    customerName: 'Global Exports',
    sales: [
       {
        month: monthNames.prev3, // June
        sales: [
            { productId: 'p-002', productName: 'Mechanical Keyboard', quantity: 100, total: 12000.0 },
        ],
      },
      {
        month: monthNames.prev2, // July
        sales: [
            { productId: 'p-002', productName: 'Mechanical Keyboard', quantity: 120, total: 14400.0 },
        ],
      },
      {
        month: monthNames.prev1, // August
        sales: [
            { productId: 'p-002', productName: 'Mechanical Keyboard', quantity: 150, total: 18000.0 },
        ],
      },
    ]
  }
];

// --- END: Data for Sales Target Page ---
