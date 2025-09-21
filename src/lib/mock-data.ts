
import type { Series, Bar, Gantt, Palette } from '@visx/shape';

export const salesTrendCsvData = `Date,Category,Product,Price,Quantity
2023-01-15,Electronics,Laptop,1200,5
2023-01-16,Clothing,T-Shirt,25,50
2023-02-10,Electronics,Smartphone,800,10
2023-02-12,Books,Science Fiction Novel,15,100
2023-03-20,Clothing,Jeans,75,30
2023-03-22,Home Goods,Coffee Maker,50,20
2023-04-05,Electronics,Headphones,150,40
2023-04-07,Books,Cookbook,30,60
2023-05-18,Clothing,Jacket,120,15
2023-05-21,Home Goods,Blender,90,25`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price (Import)
2024-09-01,Global Tech,Electronics,E-001,Laptop,50,800
2024-09-01,Fashion Forward,Clothing,C-002,Designer Jeans,100,45
2024-09-02,Book Binders,Books,B-003,Data Science 101,200,25
2024-09-03,Home Essentials,Home Goods,H-004,Smart Blender,75,60`;

export const productUploadCsvData = `Category,Product Code,Name,Import Price,Local Purchase Price
Electronics,e-010,Wireless Keyboard,25,28
Electronics,e-011,4K Monitor,350,370
Clothing,c-005,Leather Belt,18,20`;

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee,ContactName,ContactPosition,ContactPhone,ContactAddress
New Tech Inc.,A0105,A,jane.smith,Laura Chen,Lead Buyer,555-0101,101 Tech Park
Innovate LLC,A0106,B,alex.ray,Mark Johnson,Operations,555-0102,202 Innovation Dr
Synergy Corp,A0107,A,john.doe,Sarah Lee,CEO,555-0103,303 Synergy Ave`;


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
  { name: 'Jan', sales: 35000, target: 40000 },
  { name: 'Feb', sales: 42000, target: 42000 },
  { name: 'Mar', sales: 48000, target: 45000 },
  { name: 'Apr', sales: 39000, target: 48000 },
  { name: 'May', sales: 51000, target: 47000 },
  { name: 'Jun', sales: 55000, target: 52000 },
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

export const duePaymentsData = [
  {
    id: 'inv-001',
    customer: { name: 'Acme Inc.', email: 'contact@acme.inc' },
    employee: 'Jane Smith',
    dueDate: '2024-08-15',
    amount: 250.00,
    collectionPlan: 'Emailed reminder on 8/16'
  },
  {
    id: 'inv-002',
    customer: { name: 'Stark Industries', email: 'tony@stark.io' },
    employee: 'Alex Ray',
    dueDate: '2024-09-20',
    amount: 1500.75,
    collectionPlan: ''
  },
  {
    id: 'inv-003',
    customer: { name: 'Wayne Enterprises', email: 'bruce@wayne.com' },
    employee: 'John Doe',
    dueDate: '2023-07-30',
    amount: 800.00,
    collectionPlan: 'Phone call planned for this week'
  },
  {
    id: 'inv-004',
    customer: { name: 'Cyberdyne Systems', email: 'info@cyberdyne.com' },
    employee: 'Jane Smith',
    dueDate: '2024-09-25',
    amount: 300.00,
    collectionPlan: ''
  },
  {
    id: 'inv-005',
    customer: { name: 'Ollivanders', email: 'sales@ollivanders.co.uk' },
    employee: 'Alex Ray',
    dueDate: '2024-08-01',
    amount: 55.50,
    collectionPlan: 'Sent final notice.'
  },
];

export type DuePayment = typeof duePaymentsData[0];


export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 55000, john: 38000 },
];

export const salesReportData = [
  { employeeName: 'Jane Smith', customerName: 'Globex Corporation', customerCode: 'C-101', target: 5000, actual: 5250 },
  { employeeName: 'Alex Ray', customerName: 'Stark Industries', customerCode: 'C-102', target: 8000, actual: 7800 },
  { employeeName: 'John Doe', customerName: 'Wayne Enterprises', customerCode: 'C-103', target: 6000, actual: 6500 },
  { employeeName: 'Jane Smith', customerName: 'Acme Inc.', customerCode: 'C-104', target: 4000, actual: 3800 },
  { employeeName: 'Alex Ray', customerName: 'Soylent Corp', customerCode: 'C-105', target: 7500, actual: 8100 },
  { employeeName: 'John Doe', customerName: 'Initech', customerCode: 'C-106', target: 5500, actual: 5500 },
  { employeeName: 'Jane Smith', customerName: 'Vandelay Industries', customerCode: 'C-107', target: 3000, actual: 3300 },
  { employeeName: 'Alex Ray', customerName: 'Hooli', customerCode: 'C-108', target: 9000, actual: 9500 },
];


export const customers = [
    { value: 'c-101', label: 'Globex Corporation', grade: 'A' },
    { value: 'c-102', label: 'Stark Industries', grade: 'A' },
    { value: 'c-103', label: 'Wayne Enterprises', grade: 'B' },
    { value: 'c-104', label: 'Acme Inc.', grade: 'C' },
    { value: 'c-105', label: 'Soylent Corp', grade: 'B' },
    { value: 'c-106', label: 'Initech', grade: 'A' },
    { value: 'c-107', label: 'Vandelay Industries', grade: 'C' },
    { value: 'c-108', label: 'Hooli', grade: 'A' },
];

export const products = [
    { value: 'e-001', label: 'Laptop', basePrice: 1200 },
    { value: 'e-002', label: 'Smartphone', basePrice: 800 },
    { value: 'e-003', label: 'Headphones', basePrice: 150 },
    { value: 'c-001', label: 'T-Shirt', basePrice: 25 },
    { value: 'b-001', label: 'Sci-Fi Novel', basePrice: 15 },
    { value: 'h-001', label: 'Coffee Maker', basePrice: 50 },
    { value: 'c-002', label: 'Jeans', basePrice: 75 },
    { value: 'b-002', label: 'Cookbook', basePrice: 30 },
];

export const employees = [
  { value: 'jane.smith', label: 'Jane Smith', name: 'Jane Smith', role: 'employee' },
  { value: 'alex.ray', label: 'Alex Ray', name: 'Alex Ray', role: 'manager' },
  { value: 'john.doe', label: 'John Doe', name: 'John Doe', role: 'employee' },
];

export type SalesTarget = {
    customerCode: string;
    productCode: string;
    quantity: number;
    price: number;
};
export const salesTargetDataDB: SalesTarget[] = [
    { customerCode: 'c-101', productCode: 'e-001', quantity: 5, price: 1100 },
    { customerCode: 'c-101', productCode: 'e-003', quantity: 10, price: 140 },
    { customerCode: 'c-102', productCode: 'e-002', quantity: 8, price: 750 },
];


export const monthlySalesTargetData = {
    'c-101': [
        { productCode: 'e-001', target: 5, actual: 6 },
        { productCode: 'e-003', target: 10, actual: 8 },
    ],
    'c-102': [
        { productCode: 'e-002', target: 8, actual: 7 },
    ],
    'c-103': [
        { productCode: 'b-001', target: 20, actual: 25 },
        { productCode: 'b-002', target: 15, actual: 15 },
    ]
};

export const customerData = [
  {
    employee: 'Jane Smith',
    customerName: 'Globex Corporation',
    customerCode: 'C-101',
    customerGrade: 'A',
    customerType: 'own' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 5250, average: 5000 },
      { month: 8, actual: 4800, average: 5000 },
    ],
    yearlySales: [{ year: 2023, amount: 60000 }],
    creditBalance: 1250.0,
    contact: {
        name: 'John Smith',
        position: 'Purchasing Manager',
        phone: '123-456-7890',
        address: '123 Globex Ave, Springfield',
        email: 'john.smith@globex.com'
    },
    companyOverview: 'Globex Corporation is a multinational technology conglomerate known for its innovative products and slightly eccentric CEO. They specialize in everything from consumer electronics to advanced weaponry.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Stark Industries',
    customerCode: 'C-102',
    customerGrade: 'A',
    customerType: 'transfer' as 'own' | 'transfer' | 'pending',
    monthlySales: [
      { month: 9, actual: 7800, average: 8200 },
      { month: 8, actual: 8500, average: 8200 },
    ],
    yearlySales: [{ year: 2023, amount: 98000 }],
    creditBalance: 3400.50,
    contact: {
        name: 'Pepper Potts',
        position: 'CEO',
        phone: '987-654-3210',
        address: '1 Stark Tower, New York',
        email: 'p.potts@stark.com'
    },
    companyOverview: 'Stark Industries is a global leader in defense technology, renewable energy, and advanced AI. Their commitment to innovation has made them a household name.'
  },
   {
    employee: 'Jane Smith',
    customerName: 'Cyberdyne Systems',
    customerCode: 'A0098',
    customerGrade: 'B',
    customerType: 'pending' as 'own' | 'transfer' | 'pending',
    monthlySales: [],
    yearlySales: [],
    creditBalance: 0,
    contact: {
        name: 'Miles Dyson',
        position: 'Director of Special Projects',
        phone: '555-123-4567',
        address: '18144 El Camino Real, Sunnyvale',
        email: null,
    },
    companyOverview: 'A nascent tech company focusing on next-generation neural networks and robotics. Currently in the R&D phase.'
  },
];

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 150000, costPrice: 100000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 100000, costPrice: 80000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 50000, costPrice: 40000, customerType: 'transfer' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 20000, costPrice: 15000, customerType: 'own' as 'own' | 'transfer' }, // Margin 25% -> 12%
      { type: '현지' as '수입' | '현지', salePrice: 30000, costPrice: 20000, customerType: 'transfer' as 'own' | 'transfer' }, // Margin 33.3% -> 15% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 80000, costPrice: 60000, customerType: 'own' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 50000, costPrice: 20000, customerType: 'own' as 'own' | 'transfer' }, // Margin 60% -> 18%
      { type: '현지' as '수입' | '현지', salePrice: 10000, costPrice: 9500, customerType: 'own' as 'own' | 'transfer' }, // Margin 5% -> 3%
    ],
  },
   {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 300000, costPrice: 200000, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 120000, costPrice: 100000, customerType: 'transfer' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 60000, costPrice: 35000, customerType: 'own' as 'own' | 'transfer' }, // Margin 41.6% -> 18%
      { type: '현지' as '수입' | '현지', salePrice: 40000, costPrice: 32000, customerType: 'transfer' as 'own' | 'transfer' }, // Margin 20% -> 12% * 0.5
    ],
  },
];


export const employeeCustomerSales = [
    { id: 'cs-001', customerName: 'Globex Corporation', salesTarget: 15000, salesAmount: 16200 },
    { id: 'cs-002', customerName: 'Acme Inc.', salesTarget: 10000, salesAmount: 8500 },
    { id: 'cs-003', customerName: 'Vandelay Industries', salesTarget: 8000, salesAmount: 9100 },
    { id: 'cs-004', customerName: 'Cyberdyne Systems', salesTarget: 12000, salesAmount: 4200 },
];
export type EmployeeCustomerSale = typeof employeeCustomerSales[0];

export type CustomerProductSale = { productName: string; salesTarget: number; salesAmount: number; };
export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    'cs-001': [
        { productName: 'Laptop', salesTarget: 12000, salesAmount: 13200 },
        { productName: 'Headphones', salesTarget: 3000, salesAmount: 3000 },
    ],
    'cs-002': [
        { productName: 'Coffee Maker', salesTarget: 5000, salesAmount: 4000 },
        { productName: 'T-Shirt', salesTarget: 5000, salesAmount: 4500 },
    ],
    'cs-003': [
        { productName: 'Sci-Fi Novel', salesTarget: 4000, salesAmount: 5100 },
        { productName: 'Cookbook', salesTarget: 4000, salesAmount: 4000 },
    ],
    'cs-004': [
        { productName: 'Smartphone', salesTarget: 9600, salesAmount: 3200 },
        { productName: 'Jeans', salesTarget: 2400, salesAmount: 1000 },
    ]
};

export const cumulativeReportData = [
    { month: '1월', target: 50000, actual: 48000, lastYear: 45000 },
    { month: '2월', target: 52000, actual: 53000, lastYear: 50000 },
    { month: '3월', target: 55000, actual: 56000, lastYear: 54000 },
    { month: '4월', target: 58000, actual: 57000, lastYear: 56000 },
    { month: '5월', target: 60000, actual: 62000, lastYear: 58000 },
    { month: '6월', target: 62000, actual: 65000, lastYear: 60000 },
    { month: '7월', target: 65000, actual: 68000, lastYear: 64000 },
    { month: '8월', target: 68000, actual: 70000, lastYear: 66000 },
    { month: '9월', target: 70000, actual: 68500, lastYear: 68000 },
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
                customerName: 'Globex Corporation',
                products: [
                    { productName: 'Laptop', target: 12000, actual: 13500 },
                    { productName: 'Headphones', target: 1500, actual: 1800 },
                ]
            },
            {
                customerName: 'Stark Industries',
                products: [
                    { productName: 'Smartphone', target: 24000, actual: 22000 },
                    { productName: 'Coffee Maker', target: 500, actual: 450 },
                ]
            },
            {
                customerName: 'Wayne Enterprises',
                products: [
                    { productName: 'Jeans', target: 750, actual: 750 },
                    { productName: 'T-Shirt', target: 500, actual: 600 },
                ]
            }
        ]
    },
    // Data for other months would go here...
];

export type CashSale = {
  id: string;
  date: string;
  employeeName: string;
  customerName: string;
  amount: number;
  source: 'Cash Sale' | 'Credit Collection';
};

export const cashSalesData: CashSale[] = [
  { id: 'cs001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Daily Bugle', amount: 150.00, source: 'Cash Sale' },
  { id: 'cs002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Stark Industries', amount: 500.00, source: 'Credit Collection' },
  { id: 'cs003', date: '2024-09-03', employeeName: 'John Doe', customerName: 'Wayne Enterprises', amount: 320.50, source: 'Credit Collection' },
  { id: 'cs004', date: '2024-09-03', employeeName: 'Jane Smith', customerName: 'Globex Corporation', amount: 80.00, source: 'Cash Sale' },
  { id: 'cs005', date: '2024-09-05', employeeName: 'Alex Ray', customerName: 'Initech', amount: 1200.00, source: 'Credit Collection' },
  { id: 'cs006', date: '2024-08-28', employeeName: 'Jane Smith', customerName: 'Daily Bugle', amount: 200.00, source: 'Credit Collection' },
  { id: 'cs007', date: '2024-08-29', employeeName: 'John Doe', customerName: 'Soylent Corp', amount: 75.25, source: 'Cash Sale' },
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
    { id: 'chk001', receiptDate: '2024-09-01', dueDate: '2024-09-15', salesperson: 'Jane Smith', customerName: 'Globex Corporation', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5250, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Pending', notes: 'Urgent deposit' },
    { id: 'chk002', receiptDate: '2024-09-02', dueDate: '2024-10-01', salesperson: 'Alex Ray', customerName: 'Stark Industries', issuingBank: 'Citi', checkNumber: '67890', amount: 7800, depositBank: '', depositDate: '', status: 'Pending', notes: '' },
    { id: 'chk003', receiptDate: '2024-08-28', dueDate: '2024-09-28', salesperson: 'John Doe', customerName: 'Wayne Enterprises', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 6500, depositBank: 'Chase', depositDate: '2024-08-29', status: 'Confirmed', notes: 'Partial payment for INV-003' },
    { id: 'chk004', receiptDate: '2024-08-25', dueDate: '2024-09-10', salesperson: 'Jane Smith', customerName: 'Acme Inc.', issuingBank: 'Small Town Bank', checkNumber: '11223', amount: 3800, depositBank: 'Chase', depositDate: '2024-08-26', status: 'Rejected', notes: 'Insufficient funds' },
];

type PastSaleProduct = {
  productId: string;
  productName: string;
  quantity: number;
  total: number;
};

type PastSaleMonth = {
  total: number;
  products: PastSaleProduct[];
};

export const pastSalesDetails: {
  customerCode: string;
  sales: {
    [month: number]: PastSaleMonth;
  };
}[] = [
  {
    customerCode: 'c-101',
    sales: {
      6: {
        total: 6150,
        products: [
          { productId: 'e-001', productName: 'Laptop', quantity: 5, total: 6000 },
          { productId: 'e-003', productName: 'Headphones', quantity: 1, total: 150 },
        ],
      },
      7: {
        total: 50,
        products: [
          { productId: 'c-001', productName: 'T-Shirt', quantity: 2, total: 50 },
        ],
      },
      8: {
        total: 1350,
        products: [
          { productId: 'e-001', productName: 'Laptop', quantity: 1, total: 1200 },
          { productId: 'e-003', productName: 'Headphones', quantity: 1, total: 150 },
        ],
      },
    },
  },
  {
    customerCode: 'c-102',
    sales: {
      7: {
        total: 1600,
        products: [
          { productId: 'e-002', productName: 'Smartphone', quantity: 2, total: 1600 },
        ],
      },
      8: {
        total: 175,
        products: [
          { productId: 'e-003', productName: 'Headphones', quantity: 1, total: 150 },
          { productId: 'c-001', productName: 'T-Shirt', quantity: 1, total: 25 },
        ],
      },
    },
  },
  {
      customerCode: 'c-104',
      sales: {
          8: {
              total: 125,
              products: [
                  { productId: 'h-001', productName: 'Coffee Maker', quantity: 2, total: 100 },
                  { productId: 'c-001', productName: 'T-Shirt', quantity: 1, total: 25 },
              ]
          }
      }
  }
];

    