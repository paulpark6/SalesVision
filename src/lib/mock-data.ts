

// src/lib/mock-data.ts

import { PlaceHolderImages } from "./placeholder-images";

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
      name: "Acme Inc.",
      email: "billing@acme.com",
    },
    employee: "John Doe",
    dueDate: "2024-08-25",
    amount: 250.0,
    collectionPlan: "Follow-up email sent on 8/20.",
  },
  {
    id: "INV-002",
    customer: {
      name: "Stark Industries",
      email: "accounts@stark.com",
    },
    employee: "Jane Smith",
    dueDate: "2024-09-10",
    amount: 150.75,
  },
  {
    id: "INV-003",
    customer: {
      name: "Wayne Enterprises",
      email: "finance@wayne.com",
    },
    employee: "Alex Ray",
    dueDate: "2024-08-30",
    amount: 350.0,
  },
  {
    id: "INV-004",
    customer: {
      name: "Cyberdyne Systems",
      email: "payables@cyberdyne.com",
    },
    employee: "John Doe",
    dueDate: "2024-07-15",
    amount: 450.0,
    collectionPlan: "Phone call on 8/1. Promised payment by 8/10.",
  },
  {
    id: "INV-005",
    customer: {
      name: "Ollivanders",
      email: "wands@ollivanders.co.uk",
    },
    employee: "Jane Smith",
    dueDate: "2023-08-01",
    amount: 650.0,
    collectionPlan: "Sent to collections agency.",
  },
];

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
        amount: 1999.00,
    },
    {
        customer: {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
        },
        amount: 39.00,
    },
    {
        customer: {
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
        },
        amount: 299.00,
    },
    {
        customer: {
            name: "William Kim",
            email: "will@email.com",
        },
        amount: 99.00,
    },
    {
        customer: {
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
        },
        amount: 39.00,
    },
];

export const salesTargetData = {
    current: 38000,
    target: 45000
};

export const salesTargetChartData = [
  { name: 'Last Month', sales: 32000, target: 40000 },
  { name: 'This Month', sales: 38000, target: 45000 },
];

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const salesReportData = [
    {
        employeeName: 'Jane Smith',
        customerName: 'Stark Industries',
        customerCode: 'C-102',
        target: 5000,
        actual: 4850,
    },
    {
        employeeName: 'Jane Smith',
        customerName: 'Ollivanders',
        customerCode: 'C-105',
        target: 8000,
        actual: 9200,
    },
    {
        employeeName: 'Alex Ray',
        customerName: 'Wayne Enterprises',
        customerCode: 'C-103',
        target: 12000,
        actual: 12500,
    },
    {
        employeeName: 'John Doe',
        customerName: 'Acme Inc.',
        customerCode: 'C-101',
        target: 6000,
        actual: 5500,
    },
     {
        employeeName: 'John Doe',
        customerName: 'Cyberdyne Systems',
        customerCode: 'C-104',
        target: 7500,
        actual: 8100,
    },
];

export const cumulativeReportData = [
    { month: 'Jan', target: 30000, actual: 28000, lastYear: 25000 },
    { month: 'Feb', target: 32000, actual: 31000, lastYear: 27000 },
    { month: 'Mar', target: 35000, actual: 36000, lastYear: 33000 },
    { month: 'Apr', target: 38000, actual: 37000, lastYear: 35000 },
    { month: 'May', target: 40000, actual: 42000, lastYear: 38000 },
    { month: 'Jun', target: 42000, actual: 41000, lastYear: 40000 },
    { month: 'Jul', target: 45000, actual: 46000, lastYear: 43000 },
    { month: 'Aug', target: 48000, actual: 47000, lastYear: 46000 },
    { month: 'Sep', target: 50000, actual: 52000, lastYear: 48000 },
    { month: 'Oct', target: 55000, actual: 0, lastYear: 52000 },
    { month: 'Nov', target: 58000, actual: 0, lastYear: 55000 },
    { month: 'Dec', target: 60000, actual: 0, lastYear: 58000 },
];

export type MonthlyDetail = {
    month: string;
    details: Array<{
        customerName: string;
        products: Array<{
            productName: string;
            target: number;
            actual: number;
        }>
    }>
};

export const monthlyDetailReportData: MonthlyDetail[] = [
    {
        month: 'Sep',
        details: [
            {
                customerName: 'Stark Industries',
                products: [
                    { productName: 'MK-II Power Core', target: 20000, actual: 22000 },
                    { productName: 'Vibranium Shield', target: 15000, actual: 14000 },
                ]
            },
            {
                customerName: 'Wayne Enterprises',
                products: [
                    { productName: 'Grappling Hook', target: 8000, actual: 9500 },
                    { productName: 'Utility Belt', target: 7000, actual: 5000 },
                ]
            }
        ]
    },
    // ... other months
];


export const cashSalesData = [
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Stark Industries', source: '신용 수금', amount: 500.00 },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Wayne Enterprises', source: '현금 판매', amount: 350.50 },
  { id: 'CS-003', date: '2024-09-03', employeeName: 'John Doe', customerName: 'Acme Inc.', source: '신용 수금', amount: 250.00 },
  { id: 'CS-004', date: '2024-09-04', employeeName: 'Jane Smith', customerName: 'Ollivanders', source: '현금 판매', amount: 120.00 },
  { id: 'CS-005', date: '2024-09-05', employeeName: 'John Doe', customerName: 'Cyberdyne Systems', source: '현금 판매', amount: 850.75 },
  { id: 'CS-006', date: '2024-09-09', employeeName: 'Alex Ray', customerName: 'Wayne Enterprises', source: '신용 수금', amount: 700.00 },
  { id: 'CS-007', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Stark Industries', source: '현금 판매', amount: 300.00 },
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
  { id: 'CHK-001', receiptDate: '2024-08-20', dueDate: '2024-09-20', salesperson: 'Jane Smith', customerName: 'Stark Industries', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: 'Chase', depositDate: '2024-09-21', status: 'Pending', notes: 'Urgent' },
  { id: 'CHK-002', receiptDate: '2024-08-22', dueDate: '2024-09-15', salesperson: 'Alex Ray', customerName: 'Wayne Enterprises', issuingBank: 'Citi', checkNumber: '67890', amount: 8200, depositBank: 'Wells Fargo', depositDate: '2024-09-16', status: 'Confirmed', notes: '' },
  { id: 'CHK-003', receiptDate: '2024-08-25', dueDate: '2024-10-01', salesperson: 'John Doe', customerName: 'Acme Inc.', issuingBank: 'HSBC', checkNumber: '11223', amount: 3500, depositBank: 'Chase', depositDate: '2024-10-02', status: 'Pending', notes: 'Post-dated' },
  { id: 'CHK-004', receiptDate: '2024-08-28', dueDate: '2024-09-25', salesperson: 'Jane Smith', customerName: 'Ollivanders', issuingBank: 'Gringotts', checkNumber: '44556', amount: 1250, depositBank: '', depositDate: '', status: 'Rejected', notes: 'Bounced. Penalty fee applied.' },
];

export const employeeCustomerSales = [
  { id: 'ec-01', customerName: 'Stark Industries', salesTarget: 15000, salesAmount: 14500 },
  { id: 'ec-02', customerName: 'Wayne Enterprises', salesTarget: 10000, salesAmount: 11500 },
  { id: 'ec-03', customerName: 'Cyberdyne Systems', salesTarget: 8000, salesAmount: 7000 },
  { id: 'ec-04', customerName: 'Ollivanders', salesTarget: 5000, salesAmount: 6500 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  'ec-01': [
    { productName: 'MK-II Power Core', salesTarget: 8000, salesAmount: 7500 },
    { productName: 'Vibranium Shield', salesTarget: 5000, salesAmount: 5000 },
    { productName: 'Pym Particles', salesTarget: 2000, salesAmount: 2000 },
  ],
  'ec-02': [
    { productName: 'Grappling Hook', salesTarget: 4000, salesAmount: 5000 },
    { productName: 'Utility Belt', salesTarget: 6000, salesAmount: 6500 },
  ],
  'ec-03': [
    { productName: 'T-800 Endoskeleton', salesTarget: 8000, salesAmount: 7000 },
  ],
  'ec-04': [
    { productName: 'Phoenix Feather Wand', salesTarget: 3000, salesAmount: 4000 },
    { productName: 'Elder Wand', salesTarget: 2000, salesAmount: 2500 },
  ],
};

export const products = [
    { value: 'e-001', label: 'MK-II Power Core', basePrice: 1000 },
    { value: 'e-002', label: 'Vibranium Shield', basePrice: 850 },
    { value: 'e-003', label: 'Grappling Hook', basePrice: 120 },
    { value: 'e-004', label: 'Utility Belt', basePrice: 90 },
    { value: 'p-001', label: 'Phoenix Feather Wand', basePrice: 1500 },
];

export const productUploadCsvData = `Category,Code,Description,Import Price,Local Purchase Price
Electronics,E-001,"MK-II Power Core",1000,950
Electronics,E-002,"Vibranium Shield",850,800
Gadgets,G-001,"Grappling Hook",120,110
Accessories,A-001,"Utility Belt",90,85
Magic,M-001,"Phoenix Feather Wand",1500,1400
`;

export const importUploadCsvData = `Date,Supplier,Category,Product Code,Product Description,Quantity,Unit Price
2024-09-01,Stark Industries,Electronics,E-001,MK-II Power Core,10,1000
2024-09-02,Wayne Enterprises,Gadgets,G-001,Grappling Hook,50,120
`;


export const customers = [
    { value: 'C-101', label: 'Acme Inc.', grade: 'B'},
    { value: 'C-102', label: 'Stark Industries', grade: 'A'},
    { value: 'C-103', label: 'Wayne Enterprises', grade: 'A'},
    { value: 'C-104', label: 'Cyberdyne Systems', grade: 'C'},
    { value: 'C-105', label: 'Ollivanders', grade: 'B'},
];

export const customerUploadCsvData = `CustomerCode,CustomerName,Grade,Employee
A001,"New Customer A","A","jane-smith"
A002,"New Customer B","B","alex-ray"
`;


export const employees = [
  { value: 'jane-smith', label: 'Jane Smith (Employee)', role: 'employee', name: 'Jane Smith' },
  { value: 'alex-ray', label: 'Alex Ray (Manager)', role: 'manager', name: 'Alex Ray' },
  { value: 'john-doe', label: 'John Doe (Employee)', role: 'employee', name: 'John Doe' },
  { value: 'admin-user', label: 'Admin User', role: 'admin', name: 'Admin User' },
];

export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Stark Industries',
    customerCode: 'C-102',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [ { month: 9, actual: 4850, average: 4500 } ],
    yearlySales: [ { year: 2024, amount: 55000 } ],
    creditBalance: 15000.00,
    contact: {
      name: 'Pepper Potts',
      position: 'CEO',
      phone: '212-555-1234',
      address: 'Stark Tower, New York, NY',
      email: 'pepper.potts@stark.com'
    },
    companyOverview: 'Leader in defense and clean energy technology. High-volume, high-value client.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Wayne Enterprises',
    customerCode: 'C-103',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [ { month: 9, actual: 12500, average: 11000 } ],
    yearlySales: [ { year: 2024, amount: 130000 } ],
    creditBalance: 25000.00,
    contact: {
      name: 'Lucius Fox',
      position: 'CEO',
      phone: '212-555-5678',
      address: 'Wayne Tower, Gotham City',
      email: 'lucius.fox@wayne.com'
    },
    companyOverview: 'Conglomerate with diverse interests in technology, shipping, and philanthropy.'
  },
  {
    employee: 'John Doe',
    customerName: 'Acme Inc.',
    customerCode: 'C-101',
    customerGrade: 'B',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [ { month: 9, actual: 5500, average: 6000 } ],
    yearlySales: [ { year: 2024, amount: 70000 } ],
    creditBalance: 8500.00,
    contact: {
      name: 'Wile E. Coyote',
      position: 'Chief Procurement Officer',
      phone: '555-555-1212',
      address: '123 Desert Road, Nowhere, AZ',
      email: null
    },
    companyOverview: 'A long-standing client specializing in various contraptions. Consistent but smaller orders.'
  },
   {
    employee: 'John Doe',
    customerName: 'Cyberdyne Systems',
    customerCode: 'C-104',
    customerGrade: 'C',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [ { month: 9, actual: 8100, average: 7500 } ],
    yearlySales: [ { year: 2024, amount: 90000 } ],
    creditBalance: 12000.00,
     contact: {
      name: 'Miles Dyson',
      position: 'Special Projects Director',
      phone: '310-555-8990',
      address: '18144 El Camino Real, Sunnyvale, CA',
      email: 'm.dyson@cyberdyne.com'
    },
    companyOverview: 'Emerging tech firm with a focus on neural networks and AI. Potential for high growth.'
  },
];

export const salesTrendCsvData = `Date,Category,Product,Quantity,UnitPrice,Total
2024-01-15,Electronics,Laptop,5,1200,6000
2024-01-20,Clothing,T-Shirt,50,15,750
2024-02-10,Electronics,Smartphone,10,800,8000
2024-02-22,Books,Science Fiction Novel,100,12,1200
2024-03-05,Clothing,Jeans,30,50,1500
2024-03-18,Electronics,Laptop,8,1250,10000
2024-04-12,Home Goods,Coffee Maker,20,80,1600
2024-04-25,Clothing,T-Shirt,100,16,1600
2024-05-08,Electronics,Smartphone,15,820,12300
2024-05-20,Books,Cookbook,80,25,2000
2024-06-11,Clothing,Jeans,40,55,2200
2024-06-23,Electronics,Laptop,12,1180,14160
2024-07-07,Home Goods,Blender,25,120,3000
2024-07-19,Clothing,T-Shirt,120,15,1800
2024-08-02,Electronics,Smartphone,20,790,15800
2024-08-21,Books,Fantasy Novel,150,14,2100`;

export type CommissionSale = {
  type: '수입' | '현지';
  salePrice: number;
  costPrice: number;
  customerType: 'own' | 'transfer';
};

export const commissionData = [
  {
    employeeId: "EMP-001",
    employeeName: "Jane Smith",
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 100000, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' }, // total self-dev import: 230,000
      { type: '수입', salePrice: 50000, costPrice: 40000, customerType: 'transfer' }, // total transfer import: 50,000
      { type: '현지', salePrice: 10000, costPrice: 9500, customerType: 'own' }, // margin 5% -> rate 3%
      { type: '현지', salePrice: 20000, costPrice: 17000, customerType: 'own' }, // margin 15% -> rate 10%
      { type: '현지', salePrice: 15000, costPrice: 10000, customerType: 'transfer' }, // margin 33.3% -> rate 15% -> 7.5% for transfer
    ]
  },
  {
    employeeId: "EMP-002",
    employeeName: "Alex Ray",
     sales: [
      { type: '수입', salePrice: 180000, costPrice: 120000, customerType: 'own' },
      { type: '수입', salePrice: 100000, costPrice: 80000, customerType: 'transfer' },
      { type: '현지', salePrice: 30000, costPrice: 15000, customerType: 'own' }, // margin 50% -> rate 18%
      { type: '현지', salePrice: 25000, costPrice: 20000, customerType: 'transfer' }, // margin 20% -> rate 12% -> 6% for transfer
    ]
  },
  {
    employeeId: "EMP-003",
    employeeName: "John Doe",
    sales: [
      { type: '수입', salePrice: 120000, costPrice: 90000, customerType: 'own' },
      { type: '현지', salePrice: 50000, costPrice: 30000, customerType: 'own' }, // margin 40% -> rate 18%
    ]
  }
];

export type SalesTarget = {
    customer: { name: string; code: string; };
    employee: { name: string; id: string; };
    previousMonths: {
        month: string;
        sales: {
            product: { name: string; code: string; };
            quantity: number;
            total: number;
        }[];
    }[];
    currentTarget: {
        month: string;
        products: {
            product: { name: string; code: string; price: number };
            quantity: number;
            total: number;
        }[];
        totalAmount: number;
    };
};

export const salesTargetData_del = []; // To be removed

export type PastSalesDetail = {
    customerName: string;
    employeeName: string;
    sales: {
        month: 'June' | 'July' | 'August';
        products: {
            productName: string;
            productCode: string;
            quantity: number;
            totalAmount: number;
        }[];
    }[];
};

export const pastSalesDetails: PastSalesDetail[] = [
    {
        customerName: 'Stark Industries',
        employeeName: 'Jane Smith',
        sales: [
            {
                month: 'June',
                products: [
                    { productName: 'MK-II Power Core', productCode: 'e-001', quantity: 5, totalAmount: 5000 },
                    { productName: 'Vibranium Shield', productCode: 'e-002', quantity: 3, totalAmount: 2550 },
                ],
            },
            {
                month: 'July',
                products: [
                    { productName: 'MK-II Power Core', productCode: 'e-001', quantity: 8, totalAmount: 8000 },
                ],
            },
            {
                month: 'August',
                products: [
                    { productName: 'MK-II Power Core', productCode: 'e-001', quantity: 6, totalAmount: 6000 },
                    { productName: 'Vibranium Shield', productCode: 'e-002', quantity: 5, totalAmount: 4250 },
                    { productName: 'Pym Particles', productCode: 'p-001', quantity: 10, totalAmount: 15000 },
                ],
            },
        ],
    },
    {
        customerName: 'Wayne Enterprises',
        employeeName: 'Alex Ray',
        sales: [
            {
                month: 'June',
                products: [],
            },
            {
                month: 'July',
                products: [
                    { productName: 'Grappling Hook', productCode: 'e-003', quantity: 20, totalAmount: 2400 },
                    { productName: 'Utility Belt', productCode: 'e-004', quantity: 20, totalAmount: 1800 },
                ],
            },
            {
                month: 'August',
                products: [
                    { productName: 'Grappling Hook', productCode: 'e-003', quantity: 30, totalAmount: 3600 },
                ],
            },
        ],
    },
    {
        customerName: 'Acme Inc.',
        employeeName: 'John Doe',
        sales: [
            {
                month: 'June',
                products: [
                    { productName: 'Utility Belt', productCode: 'e-004', quantity: 100, totalAmount: 8550 }, // 5% discount
                ],
            },
            {
                month: 'July',
                products: [
                    { productName: 'Utility Belt', productCode: 'e-004', quantity: 120, totalAmount: 10260 },
                ],
            },
            {
                month: 'August',
                products: [
                     { productName: 'Utility Belt', productCode: 'e-004', quantity: 150, totalAmount: 12825 },
                ],
            },
        ],
    },
];

export const monthlySalesTargetData = [
  {
    customer: { name: 'Stark Industries', code: 'C-102' },
    employee: { name: 'Jane Smith', id: 'jane-smith' },
    previousMonths: [
      { month: 'June', sales: [{ product: { name: 'MK-II Power Core', code: 'e-001' }, quantity: 5, total: 5000 }, { product: { name: 'Vibranium Shield', code: 'e-002' }, quantity: 3, total: 2550 }] },
      { month: 'July', sales: [{ product: { name: 'MK-II Power Core', code: 'e-001' }, quantity: 8, total: 8000 }] },
      { month: 'August', sales: [{ product: { name: 'MK-II Power Core', code: 'e-001' }, quantity: 6, total: 6000 }, { product: { name: 'Vibranium Shield', code: 'e-002' }, quantity: 5, total: 4250 }, { product: { name: 'Pym Particles', code: 'p-001' }, quantity: 10, total: 15000 }] },
    ],
    currentTarget: {
      month: 'September',
      products: [],
      totalAmount: 0,
    },
  },
  {
    customer: { name: 'Wayne Enterprises', code: 'C-103' },
    employee: { name: 'Alex Ray', id: 'alex-ray' },
    previousMonths: [
      { month: 'June', sales: [] },
      { month: 'July', sales: [{ product: { name: 'Grappling Hook', code: 'e-003' }, quantity: 20, total: 2400 }, { product: { name: 'Utility Belt', code: 'e-004' }, quantity: 20, total: 1800 }] },
      { month: 'August', sales: [{ product: { name: 'Grappling Hook', code: 'e-003' }, quantity: 30, total: 3600 }] },
    ],
    currentTarget: {
      month: 'September',
      products: [],
      totalAmount: 0,
    },
  },
];
