

// src/lib/mock-data.ts

import { subDays, format } from 'date-fns';

export const overviewData = {
  totalRevenue: 45231.89,
  averageSale: 2389.5,
  totalSales: 12234,
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


export const salesTargetData = {
  current: 41000,
  target: 45000,
};

export const salesTargetChartData = [
  { name: '1주차', sales: 18600, target: 20000 },
  { name: '2주차', sales: 30500, target: 28000 },
  { name: '3주차', sales: 23700, target: 25000 },
  { name: '4주차', sales: 41000, target: 45000 },
];

export const salesComparisonData = [
    { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
    { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
    { name: '전년 동기 실적', jane: 35000, alex: 55000, john: 38000 },
];

export const duePaymentsData = [
  {
    id: 'inv-001',
    customer: {
      name: 'Ethan Williams',
      email: 'ethan.williams@example.com',
    },
    employee: 'Jane Smith',
    dueDate: '2024-08-25',
    amount: 150.75,
    collectionPlan: '8월 20일 전화 통화, 25일까지 입금 약속',
  },
  {
    id: 'inv-002',
    customer: {
      name: 'Ava Brown',
      email: 'ava.brown@example.com',
    },
     employee: 'Alex Ray',
    dueDate: '2024-09-10',
    amount: 250.0,
    collectionPlan: '',
  },
  {
    id: 'inv-003',
    customer: {
      name: 'Liam Jones',
      email: 'liam.jones@example.com',
    },
     employee: 'John Doe',
    dueDate: '2023-07-15',
    amount: 475.5,
    collectionPlan: '장기 연체, 법적 조치 검토 중',
  },
  {
    id: 'inv-004',
    customer: {
      name: 'Mia Garcia',
      email: 'mia.garcia@example.com',
    },
     employee: 'Jane Smith',
    dueDate: '2024-09-20',
    amount: 80.0,
    collectionPlan: '',
  },
  {
    id: 'inv-005',
    customer: {
      name: 'Noah Miller',
      email: 'noah.miller@example.com',
    },
    employee: 'Alex Ray',
    dueDate: '2024-08-30',
    amount: 320.0,
    collectionPlan: '분할 상환 논의 중',
  },
];
export type DuePayment = typeof duePaymentsData[0];

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
    customerName: 'Quantum Industries',
    customerCode: 'C-103',
    target: 7000,
    actual: 6500,
  },
  {
    employeeName: 'John Doe',
    customerName: 'Apex Corp',
    customerCode: 'C-104',
    target: 4000,
    actual: 4100,
  },
   {
    employeeName: 'Alex Ray',
    customerName: 'Zenith Enterpises',
    customerCode: 'C-105',
    target: 6000,
    actual: 6250,
  },
];

export const cumulativeReportData = [
    { month: 'Jan', target: 30000, actual: 28000, lastYear: 27000 },
    { month: 'Feb', target: 32000, actual: 31000, lastYear: 29000 },
    { month: 'Mar', target: 35000, actual: 36000, lastYear: 34000 },
    { month: 'Apr', target: 38000, actual: 37000, lastYear: 36000 },
    { month: 'May', target: 40000, actual: 42000, lastYear: 39000 },
    { month: 'Jun', target: 42000, actual: 41000, lastYear: 40000 },
    { month: 'Jul', target: 45000, actual: 46000, lastYear: 44000 },
    { month: 'Aug', target: 48000, actual: 47000, lastYear: 46000 },
    { month: 'Sep', target: 50000, actual: 49000, lastYear: 48000 },
    { month: 'Oct', target: 52000, actual: 0, lastYear: 50000 },
    { month: 'Nov', target: 55000, actual: 0, lastYear: 53000 },
    { month: 'Dec', target: 60000, actual: 0, lastYear: 58000 },
];

export const monthlyDetailReportData = [
  {
    month: 'Jul',
    details: [
      {
        customerName: 'Global Tech Inc.',
        products: [
          { productName: 'Laptop Model X', target: 10000, actual: 11000 },
          { productName: 'Wireless Mouse', target: 500, actual: 450 },
        ]
      },
      {
        customerName: 'Innovate Solutions',
        products: [
          { productName: 'Cloud Service Plan', target: 8000, actual: 8500 },
        ]
      }
    ]
  },
   {
    month: 'Aug',
    details: [
      {
        customerName: 'Global Tech Inc.',
        products: [
          { productName: 'Laptop Model X', target: 12000, actual: 11500 },
          { productName: 'Docking Station', target: 1000, actual: 1200 },
        ]
      },
      {
        customerName: 'Apex Corp',
        products: [
          { productName: 'AI Software License', target: 15000, actual: 16000 },
          { productName: 'Support Package', target: 2000, actual: 2000 },
        ]
      }
    ]
  },
  // Data for other months...
];

export type MonthlyDetail = typeof monthlyDetailReportData[0];


export const cashSalesData = [
  { id: 'cs001', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), employeeName: 'Jane Smith', customerName: 'Global Tech Inc.', source: '현금 판매', amount: 1200.00 },
  { id: 'cs002', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), employeeName: 'Alex Ray', customerName: 'Quantum Industries', source: '신용 수금', amount: 850.50 },
  { id: 'cs003', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), employeeName: 'John Doe', customerName: 'Apex Corp', source: '현금 판매', amount: 500.00 },
  { id: 'cs004', date: format(subDays(new Date(), 9), 'yyyy-MM-dd'), employeeName: 'Jane Smith', customerName: 'Innovate Solutions', source: '신용 수금', amount: 2000.00 },
  { id: 'cs005', date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), employeeName: 'Alex Ray', customerName: 'Zenith Enterpises', source: '현금 판매', amount: 750.00 },
  { id: 'cs006', date: format(subDays(new Date(), 11), 'yyyy-MM-dd'), employeeName: 'Jane Smith', customerName: 'Global Tech Inc.', source: '신용 수금', amount: 600.00 },
];
export type CashSale = typeof cashSalesData[0];

export const checkPaymentsData = [
  { id: 'chk001', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Global Tech Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000.00, depositBank: '', depositDate: '', status: 'Pending' as CheckStatus, notes: '' },
  { id: 'chk002', receiptDate: '2024-09-02', dueDate: '2024-09-17', salesperson: 'Alex Ray', customerName: 'Quantum Industries', issuingBank: 'Chase', checkNumber: '67890', amount: 3200.00, depositBank: 'Wells Fargo', depositDate: '2024-09-03', status: 'Confirmed' as CheckStatus, notes: '조기 입금' },
  { id: 'chk003', receiptDate: '2024-08-28', dueDate: '2024-09-28', salesperson: 'John Doe', customerName: 'Apex Corp', issuingBank: 'Citibank', checkNumber: '11223', amount: 1500.00, depositBank: '', depositDate: '', status: 'Pending' as CheckStatus, notes: '분할 결제' },
  { id: 'chk004', receiptDate: '2024-08-25', dueDate: '2024-09-10', salesperson: 'Jane Smith', customerName: 'Innovate Solutions', issuingBank: 'Bank of America', checkNumber: '44556', amount: 7800.00, depositBank: 'Self', depositDate: '2024-08-26', status: 'Rejected' as CheckStatus, notes: '부도 처리. 패널티 부과 예정.' },
];
export type CheckPayment = typeof checkPaymentsData[0];
export type CheckStatus = 'Pending' | 'Confirmed' | 'Rejected';


export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 150000, costPrice: 100000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 80000, costPrice: 60000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 120000, costPrice: 90000, customerType: 'transfer' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 5000, costPrice: 4000, customerType: 'own' as 'own' | 'transfer' }, // Margin 20% -> Rate 12%
      { type: '현지' as '수입' | '현지', salePrice: 8000, costPrice: 4500, customerType: 'own' as 'own' | 'transfer' }, // Margin 43.75% -> Rate 18%
      { type: '현지' as '수입' | '현지', salePrice: 6000, costPrice: 5500, customerType: 'transfer' as 'own' | 'transfer' }, // Margin 8.3% -> Rate 3% * 0.5
    ]
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 250000, costPrice: 180000, customerType: 'own' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 12000, costPrice: 10000, customerType: 'own' as 'own' | 'transfer' }, // Margin 16.6% -> Rate 10%
      { type: '현지' as '수입' | '현지', salePrice: 15000, costPrice: 10000, customerType: 'transfer' as 'own' | 'transfer' },// Margin 33.3% -> Rate 15% * 0.5
    ]
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 50000, costPrice: 40000, customerType: 'transfer' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 20000, costPrice: 15000, customerType: 'own' as 'own' | 'transfer' }, // Margin 25% -> Rate 12%
    ]
  },
];


// Data for Sales -> Target
export type SalesTarget = {
    customerId: string;
    customerName: string;
    productId: string;
    productName: string;
    targetQuantity: number;
    targetAmount: number;
};
export type SalesTargetData = {
    month: number;
    year: number;
    targets: SalesTarget[];
};

export const employeeCustomerSales = [
  {
    id: 1,
    customerName: 'Global Tech Inc.',
    salesTarget: 15000,
    salesAmount: 18500,
  },
  {
    id: 2,
    customerName: 'Innovate Solutions',
    salesTarget: 10000,
    salesAmount: 8200,
  },
  {
    id: 3,
    customerName: 'Quantum Industries',
    salesTarget: 12000,
    salesAmount: 12000,
  },
];
export type EmployeeCustomerSale = typeof employeeCustomerSales[0];

export const customerProductSalesDetails = {
  1: [ // Global Tech Inc.
    { productName: 'Laptop Model X', salesTarget: 10000, salesAmount: 12000 },
    { productName: 'Wireless Mouse', salesTarget: 1000, salesAmount: 1500 },
    { productName: 'USB-C Hub', salesTarget: 4000, salesAmount: 5000 },
  ],
  2: [ // Innovate Solutions
    { productName: 'Cloud Service Plan', salesTarget: 8000, salesAmount: 7000 },
    { productName: 'API Access Key', salesTarget: 2000, salesAmount: 1200 },
  ],
  3: [ // Quantum Industries
    { productName: 'Quantum Processor v3', salesTarget: 12000, salesAmount: 12000 },
  ],
};
export type CustomerProductSale = typeof customerProductSalesDetails[1][0];

export const products = [
  { value: 'p-001', label: 'Laptop Model X', basePrice: 1200 },
  { value: 'p-002', label: 'Wireless Mouse', basePrice: 25 },
  { value: 'p-003', label: 'USB-C Hub', basePrice: 45 },
  { value: 'p-004', label: 'Cloud Service Plan', basePrice: 500 },
  { value: 'p-005', label: 'Quantum Processor v3', basePrice: 2500 },
  { value: 'p-006', label: 'AI Software License', basePrice: 1500 },
  { value: 'p-007', label: 'Support Package', basePrice: 300 },
];
export type Product = typeof products[0];

export const customers = [
    { value: 'c-101', label: 'Global Tech Inc.', grade: 'A' },
    { value: 'c-102', label: 'Innovate Solutions', grade: 'B' },
    { value: 'c-103', label: 'Quantum Industries', grade: 'A' },
    { value: 'c-104', label: 'Apex Corp', grade: 'C' },
    { value: 'c-105', label: 'Zenith Enterpises', grade: 'B' },
];

export const employees = [
  { value: 'emp-001', label: 'Jane Smith (EMP-001)', role: 'employee', name: 'Jane Smith' },
  { value: 'emp-002', label: 'Alex Ray (EMP-002)', role: 'manager', name: 'Alex Ray' },
  { value: 'emp-003', label: 'John Doe (EMP-003)', role: 'employee', name: 'John Doe' },
  { value: 'admin', label: 'Admin User', role: 'admin', name: 'Admin User'},
];


export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Global Tech Inc.',
    customerCode: 'A0001',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 18500, average: 17000 },
      { month: 8, actual: 17800, average: 16900 },
    ],
    yearlySales: [
      { year: 2024, amount: 150000 },
      { year: 2023, amount: 135000 },
    ],
    creditBalance: 12500.50,
    contact: {
        name: 'John Smith',
        position: 'Purchasing Head',
        phone: '123-456-7890',
        address: '123 Tech Park, Silicon Valley, CA',
        email: 'john.s@globaltech.com'
    },
    companyOverview: 'A leading provider of enterprise software solutions.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Quantum Industries',
    customerCode: 'A0002',
    customerGrade: 'A',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [
       { month: 9, actual: 12000, average: 11500 },
       { month: 8, actual: 11000, average: 11200 },
    ],
    yearlySales: [
      { year: 2024, amount: 110000 },
      { year: 2023, amount: 95000 },
    ],
    creditBalance: 8200.00,
     contact: {
        name: 'Maria Garcia',
        position: 'Supply Chain Director',
        phone: '987-654-3210',
        address: '456 Innovation Dr, Boston, MA',
        email: 'maria.g@quantum.com'
    },
    companyOverview: 'Specializes in next-generation quantum computing hardware.'
  },
  {
    employee: 'John Doe',
    customerName: 'Apex Corp',
    customerCode: 'B0001',
    customerGrade: 'B',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
       { month: 9, actual: 8500, average: 8000 },
       { month: 8, actual: 7800, average: 7900 },
    ],
    yearlySales: [
      { year: 2024, amount: 75000 },
      { year: 2023, amount: 70000 },
    ],
    creditBalance: 5300.75,
     contact: {
        name: 'David Chen',
        position: 'Operations Manager',
        phone: '555-123-4567',
        address: '789 Business Blvd, Chicago, IL',
        email: 'david.c@apexcorp.com'
    },
    companyOverview: 'A multinational conglomerate with diverse business interests.'
  },
  {
    employee: 'Jane Smith',
    customerName: 'Innovate Solutions',
    customerCode: 'B0002',
    customerGrade: 'B',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [],
    yearlySales: [],
    creditBalance: 0,
    contact: {
        name: 'Sarah Jenkins',
        position: 'Lead Buyer',
        phone: '555-987-6543',
        address: '101 Venture Way, Austin, TX',
        email: null
    },
    companyOverview: 'A startup focused on renewable energy technologies.'
  }
];

export const salesTrendCsvData = `Date,Category,Product,Quantity,Unit Price,Total Sales
2023-01-15,Electronics,Laptop Model X,50,1200,60000
2023-01-20,Clothing,Branded T-Shirt,200,25,5000
2023-02-10,Electronics,Wireless Mouse,150,20,3000
2023-02-18,Home Goods,Smart Thermostat,80,150,12000
2023-03-05,Books,Sci-Fi Novel "Galaxy's Edge",300,15,4500
2023-03-22,Electronics,Laptop Model X,60,1180,70800
2023-04-10,Clothing,Branded Hoodie,180,45,8100
2023-04-25,Electronics,USB-C Hub,250,40,10000
2023-05-15,Home Goods,Smart Lightbulbs (4-pack),120,50,6000
2023-05-30,Electronics,Laptop Model X,70,1150,80500
2023-06-12,Books,Mystery Novel "The Silent Witness",400,12,4800
2023-06-20,Electronics,Wireless Mouse,200,22,4400
2023-07-07,Clothing,Branded T-Shirt,250,25,6250
2023-07-19,Electronics,Laptop Model X,80,1120,89600
2023-08-01,Home Goods,Smart Thermostat,100,145,14500
2023-08-21,Electronics,USB-C Hub,300,38,11400
2023-09-05,Books,Sci-Fi Novel "Galaxy's Edge",350,15,5250
2023-09-18,Electronics,Laptop Model X,90,1100,99000
2023-10-10,Clothing,Branded Hoodie,200,45,9000
2023-10-28,Electronics,Wireless Mouse,220,20,4400
2023-11-15,Home Goods,Smart Lightbulbs (4-pack),150,48,7200
2023-11-25,Electronics,Laptop Model X,100,1080,108000
2023-12-10,Books,Mystery Novel "The Silent Witness",500,12,6000
2023-12-20,Clothing,Branded T-Shirt,300,25,7500`;

export const productUploadCsvData = `Category,Product Code,Description,Import Price,Local Purchase Price
Electronics,E-006,4K Monitor,450,420
Electronics,E-007,Mechanical Keyboard,120,110
Home Goods,H-001,Air Purifier,250,235`;

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee
"Starlight Supplies","A0005","A","emp-001"
"Phoenix Retail","B0003","B","emp-002"
"Neptune Goods","C0001","C","emp-003"`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price
2024-09-15,"Global Imports Inc.","Electronics","E-006","4K Monitor",50,450
2024-09-16,"Tech Distributors","Electronics","E-007","Mechanical Keyboard",100,110`;

export type PastSaleProduct = {
  productId: string;
  productName: string;
  quantity: number;
  sales: number;
};
export type PastSaleMonth = {
  month: number; // 6 for June, 7 for July, 8 for August
  products: PastSaleProduct[];
};
export type PastSalesDetail = {
  customerId: string;
  customerName: string;
  employeeName: string;
  monthlySales: PastSaleMonth[];
};

export const pastSalesDetails: PastSalesDetail[] = [
  {
    customerId: 'c-101',
    customerName: 'Global Tech Inc.',
    employeeName: 'Jane Smith',
    monthlySales: [
      {
        month: 6,
        products: [
          { productId: 'p-001', productName: 'Laptop Model X', quantity: 5, sales: 6000 },
          { productId: 'p-002', productName: 'Wireless Mouse', quantity: 20, sales: 500 },
        ],
      },
      {
        month: 7,
        products: [
          { productId: 'p-001', productName: 'Laptop Model X', quantity: 8, sales: 9600 },
        ],
      },
      {
        month: 8,
        products: [
          { productId: 'p-001', productName: 'Laptop Model X', quantity: 6, sales: 7200 },
          { productId: 'p-003', productName: 'USB-C Hub', quantity: 15, sales: 675 },
        ],
      },
    ],
  },
  {
    customerId: 'c-103',
    customerName: 'Quantum Industries',
    employeeName: 'Alex Ray',
    monthlySales: [
      {
        month: 6,
        products: [],
      },
      {
        month: 7,
        products: [
          { productId: 'p-005', productName: 'Quantum Processor v3', quantity: 2, sales: 5000 },
        ],
      },
      {
        month: 8,
        products: [
          { productId: 'p-005', productName: 'Quantum Processor v3', quantity: 3, sales: 7500 },
          { productId: 'p-006', productName: 'AI Software License', quantity: 1, sales: 1500 },
        ],
      },
    ],
  },
  {
    customerId: 'c-104',
    customerName: 'Apex Corp',
    employeeName: 'John Doe',
    monthlySales: [
      {
        month: 6,
        products: [
           { productId: 'p-007', productName: 'Support Package', quantity: 10, sales: 3000 },
        ],
      },
      {
        month: 7,
        products: [
           { productId: 'p-007', productName: 'Support Package', quantity: 12, sales: 3600 },
        ],
      },
      {
        month: 8,
        products: [
           { productId: 'p-002', productName: 'Wireless Mouse', quantity: 50, sales: 1250 },
           { productId: 'p-007', productName: 'Support Package', quantity: 5, sales: 1500 },
        ],
      },
    ],
  },
];
