// @/lib/mock-data.ts

export type Role = 'admin' | 'manager' | 'employee';

export const roles: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
];

export const employees = [
  { name: 'John Doe', value: 'john-doe', role: 'admin', label: 'John Doe (Admin)' },
  { name: 'Alex Ray', value: 'alex-ray', manager: 'john-doe', role: 'manager', label: 'Alex Ray (Manager)' },
  { name: 'Jane Smith', value: 'jane-smith', manager: 'alex-ray', role: 'employee', label: 'Jane Smith' },
  { name: 'Tom Wilson', value: 'tom-wilson', manager: 'alex-ray', role: 'employee', label: 'Tom Wilson' },
];


export const products = [
  { value: 'e-001', label: 'Quantum Drive', basePrice: 1250 },
  { value: 'e-002', label: 'Photon Core', basePrice: 980 },
  { value: 'c-001', label: 'Gravity Cloak', basePrice: 2300 },
  { value: 'b-001', label: 'Starlight Almanac', basePrice: 75 },
  { value: 'h-001', label: 'Zero-G Mug', basePrice: 30 },
  { value: 'h-002', label: 'Astro-Planter', basePrice: 150 },
];

export const productUploadCsvData = `Category,Product Code,Description,Import Price,Local Purchase Price
Electronics,E-003,Plasma Inducer,1500.00,1450.00
Apparel,A-001,Zero-G Jumpsuit,800.00,780.00
Home Goods,H-003,Nebula Projector,250.00,240.00
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price (Import)
2023-09-25,Galaxy Imports,Electronics,E-004,Ion Engine,10,50000.00
2023-09-24,Stellar Goods,Apparel,A-002,Cryo-weave Gloves,200,150.00
`;

export const customerUploadCsvData = `"CustomerName","CustomerCode","Grade","Employee"
"Cyberdyne Systems","A0126","A","jane-smith"
"Stark Industries","A0127","B","tom-wilson"
`;


export const customers = [
  { value: 'C-101', label: 'Cybernetics Inc.', grade: 'A' },
  { value: 'C-102', label: 'Hyperion Corp.', grade: 'B' },
  { value: 'C-103', label: 'Omega Solutions', grade: 'C' },
  { value: 'C-104', label: 'Starlight Enterprises', grade: 'A' },
  { value: 'C-105', label: 'Titan Industries', grade: 'B' },
];


export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  current: 41850,
  target: 50000
};

export const salesTargetChartData = [
  { name: '매출', sales: 41850, target: 50000 },
];

export const salesComparisonData = [
    { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
    { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
    { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const salesReportData = [
    { employeeName: 'Jane Smith', customerName: 'Cybernetics Inc.', customerCode: 'C-101', target: 15000, actual: 16500 },
    { employeeName: 'Jane Smith', customerName: 'Starlight Enterprises', customerCode: 'C-104', target: 10000, actual: 9500 },
    { employeeName: 'Jane Smith', customerName: 'Omega Solutions', customerCode: 'C-103', target: 5000, actual: 6000 },
    { employeeName: 'Alex Ray', customerName: 'Hyperion Corp.', customerCode: 'C-102', target: 20000, actual: 21000 },
    { employeeName: 'Alex Ray', customerName: 'Titan Industries', customerCode: 'C-105', target: 18000, actual: 17500 },
    { employeeName: 'John Doe', customerName: 'Global Dynamics', customerCode: 'C-106', target: 25000, actual: 24000 },
];

export const cumulativeReportData = [
    { month: 'Jan', target: 40000, actual: 38000, lastYear: 35000 },
    { month: 'Feb', target: 42000, actual: 41000, lastYear: 38000 },
    { month: 'Mar', target: 45000, actual: 48000, lastYear: 42000 },
    { month: 'Apr', target: 48000, actual: 47000, lastYear: 45000 },
    { month: 'May', target: 50000, actual: 52000, lastYear: 48000 },
    { month: 'Jun', target: 55000, actual: 53000, lastYear: 51000 },
    { month: 'Jul', target: 58000, actual: 60000, lastYear: 55000 },
    { month: 'Aug', target: 60000, actual: 61000, lastYear: 58000 },
    { month: 'Sep', target: 65000, actual: 68000, lastYear: 62000 },
    { month: 'Oct', target: 70000, actual: 0, lastYear: 68000 },
    { month: 'Nov', target: 75000, actual: 0, lastYear: 72000 },
    { month: 'Dec', target: 80000, actual: 0, lastYear: 78000 },
];


export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};
export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
    { id: 'cs1', customerName: 'Cybernetics Inc.', salesTarget: 15000, salesAmount: 16500 },
    { id: 'cs2', customerName: 'Starlight Enterprises', salesTarget: 10000, salesAmount: 9500 },
    { id: 'cs3', customerName: 'Omega Solutions', salesTarget: 5000, salesAmount: 6000 },
    { id: 'cs4', customerName: 'Digital Horizons', salesTarget: 8000, salesAmount: 8200 },
];
export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    cs1: [
        { productName: 'Quantum Drive', salesTarget: 10000, salesAmount: 12000 },
        { productName: 'Photon Core', salesTarget: 5000, salesAmount: 4500 },
    ],
    cs2: [
        { productName: 'Gravity Cloak', salesTarget: 7000, salesAmount: 7500 },
        { productName: 'Starlight Almanac', salesTarget: 3000, salesAmount: 2000 },
    ],
    cs3: [
        { productName: 'Zero-G Mug', salesTarget: 2000, salesAmount: 3000 },
        { productName: 'Astro-Planter', salesTarget: 3000, salesAmount: 3000 },
    ],
    cs4: [
        { productName: 'Quantum Drive', salesTarget: 5000, salesAmount: 6000 },
        { productName: 'Photon Core', salesTarget: 3000, salesAmount: 2200 },
    ],
};

export type DuePayment = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  employeeId: string;
  dueDate: string;
  amount: number;
  collectionPlan?: string;
};

export const duePaymentsData: DuePayment[] = [
  { id: 'INV-001', customer: { name: 'Cybernetics Inc.', email: 'contact@cybernetics.com' }, employee: 'Jane Smith', employeeId: 'jane-smith', dueDate: '2024-07-25', amount: 2500.00, collectionPlan: 'Payment expected by end of month.' },
  { id: 'INV-002', customer: { name: 'Hyperion Corp.', email: 'billing@hyperion.com' }, employee: 'Alex Ray', employeeId: 'alex-ray', dueDate: '2024-08-15', amount: 1500.50 },
  { id: 'INV-003', customer: { name: 'Omega Solutions', email: 'accounts@omega.com' }, employee: 'Jane Smith', employeeId: 'jane-smith', dueDate: '2024-09-05', amount: 350.00 },
  { id: 'INV-004', customer: { name: 'Starlight Enterprises', email: 'pay@starlight.com' }, employee: 'Jane Smith', employeeId: 'jane-smith', dueDate: '2024-09-10', amount: 800.75 },
  { id: 'INV-005', customer: { name: 'Titan Industries', email: 'finance@titan.com' }, employee: 'Alex Ray', employeeId: 'alex-ray', dueDate: '2023-08-20', amount: 4500.00, collectionPlan: 'Sent to collections agency.' },
  { id: 'INV-006', customer: { name: 'Global Dynamics', email: 'billing@globaldynamics.com' }, employee: 'John Doe', employeeId: 'john-doe', dueDate: '2024-09-12', amount: 1200.00 },
  { id: 'INV-007', customer: { name: 'Cybernetics Inc.', email: 'contact@cybernetics.com' }, employee: 'Jane Smith', employeeId: 'jane-smith', dueDate: '2024-09-18', amount: 550.00 },
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

export const salesTrendCsvData = `Date,Category,Product,Sales
2023-01-15,Electronics,Laptop,1200
2023-01-18,Clothing,Jacket,150
2023-02-05,Electronics,Smartphone,800
2023-02-10,Books,Science Fiction,25
2023-03-21,Electronics,Laptop,1300
2023-03-25,Home Goods,Coffee Maker,80
2023-04-11,Clothing,T-Shirt,20
2023-04-22,Electronics,Smartphone,850
`;


export type CashSale = {
  id: string;
  date: string; // YYYY-MM-DD
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
};

export const cashSalesData: CashSale[] = [
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Cybernetics Inc.', source: '신용 수금', amount: 1200 },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Retail Spot', source: '현금 판매', amount: 350 },
  { id: 'CS-003', date: '2024-09-04', employeeName: 'Jane Smith', customerName: 'Local Biz', source: '현금 판매', amount: 500 },
  { id: 'CS-004', date: '2024-09-05', employeeName: 'John Doe', customerName: 'Global Dynamics', source: '신용 수금', amount: 2000 },
  { id: 'CS-005', date: '2024-09-09', employeeName: 'Alex Ray', customerName: 'Hyperion Corp.', source: '신용 수금', amount: 1500 },
  { id: 'CS-006', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Cash & Carry', source: '현금 판매', amount: 800 },
  { id: 'CS-007', date: '2024-09-11', employeeName: 'Alex Ray', customerName: 'Quick Mart', source: '현금 판매', amount: 420 },
];

export type CheckStatus = 'Pending' | 'Confirmed' | 'Rejected';

export type CheckPayment = {
    id: string;
    receiptDate: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    salesperson: string;
    customerName: string;
    issuingBank: string;
    checkNumber: string;
    amount: number;
    depositBank?: string;
    depositDate?: string;
    status: CheckStatus;
    notes?: string;
};

export const checkPaymentsData: CheckPayment[] = [
  { id: 'CHK-001', receiptDate: '2024-08-20', dueDate: '2024-09-20', salesperson: 'Jane Smith', customerName: 'Cybernetics Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, status: 'Pending', depositBank: '', depositDate: '', notes: '' },
  { id: 'CHK-002', receiptDate: '2024-08-22', dueDate: '2024-09-25', salesperson: 'Alex Ray', customerName: 'Hyperion Corp.', issuingBank: 'Chase', checkNumber: '67890', amount: 3200, status: 'Pending', depositBank: '', depositDate: '', notes: '' },
  { id: 'CHK-003', receiptDate: '2024-08-25', dueDate: '2024-09-15', salesperson: 'John Doe', customerName: 'Global Dynamics', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 8000, status: 'Confirmed', depositBank: 'Citibank', depositDate: '2024-08-28', notes: 'Early deposit' },
  { id: 'CHK-004', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Starlight Enterprises', issuingBank: 'Bank of America', checkNumber: '11223', amount: 2500, status: 'Pending', depositBank: '', depositDate: '', notes: '' },
  { id: 'CHK-005', receiptDate: '2024-09-05', dueDate: '2024-09-10', salesperson: 'Tom Wilson', customerName: 'Titan Industries', issuingBank: 'Chase', checkNumber: 'A-987', amount: 1500, status: 'Rejected', depositBank: '', depositDate: '', notes: 'Insufficient funds' },
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
    month: 'Sep',
    details: [
      {
        customerName: 'Cybernetics Inc.',
        products: [
          { productName: 'Quantum Drive', target: 8000, actual: 9500 },
          { productName: 'Photon Core', target: 5000, actual: 4800 },
        ],
      },
      {
        customerName: 'Hyperion Corp.',
        products: [
          { productName: 'Gravity Cloak', target: 15000, actual: 16000 },
        ],
      },
      {
        customerName: 'Starlight Enterprises',
        products: [
          { productName: 'Quantum Drive', target: 10000, actual: 9000 },
          { productName: 'Starlight Almanac', target: 2000, actual: 2500 },
        ],
      },
    ],
  },
  // Data for other months can be added here
];

export type CommissionSale = {
  type: '수입' | '현지';
  salePrice: number;
  costPrice: number;
  customerType: 'own' | 'transfer';
};

export type CommissionEntry = {
  employeeId: string;
  employeeName: string;
  sales: CommissionSale[];
};

export const commissionData: CommissionEntry[] = [
  {
    employeeId: 'jane-smith',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 100000, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' },
      { type: '수입', salePrice: 50000, costPrice: 40000, customerType: 'transfer' },
      { type: '현지', salePrice: 20000, costPrice: 15000, customerType: 'own' }, // margin 25% -> 0.12
      { type: '현지', salePrice: 30000, costPrice: 28000, customerType: 'transfer' }, // margin < 10% -> 0.03 -> 50% = 0.015
    ],
  },
  {
    employeeId: 'alex-ray',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입', salePrice: 180000, costPrice: 120000, customerType: 'own' },
      { type: '현지', salePrice: 100000, costPrice: 65000, customerType: 'own' }, // margin 35% -> 0.15
      { type: '현지', salePrice: 50000, costPrice: 20000, customerType: 'transfer' }, // margin 60% -> 0.18 -> 50% = 0.09
    ],
  },
  {
    employeeId: 'tom-wilson',
    employeeName: 'Tom Wilson',
    sales: [
      { type: '수입', salePrice: 90000, costPrice: 70000, customerType: 'transfer' },
      { type: '현지', salePrice: 60000, costPrice: 55000, customerType: 'own' }, // margin < 10% -> 0.03
    ],
  },
];


export type CustomerRecord = {
  employee: string;
  employeeId: string;
  customerName: string;
  customerCode: string;
  customerGrade: string;
  customerType: 'own' | 'transfer' | 'pending';
  monthlySales: { month: number; actual: number; average: number }[];
  yearlySales: { year: number; amount: number }[];
  creditBalance: number;
  contact: {
    name: string;
    position: string;
    phone: string;
    address: string;
    email: string | null;
  };
  companyOverview: string;
};

export const customerData: CustomerRecord[] = [
    {
        employee: 'Jane Smith',
        employeeId: 'jane-smith',
        customerName: 'Cybernetics Inc.',
        customerCode: 'A0001',
        customerGrade: 'A',
        customerType: 'own',
        monthlySales: [
            { month: 9, actual: 16500, average: 15000 },
        ],
        yearlySales: [
            { year: 2023, amount: 180000 },
        ],
        creditBalance: 12500.00,
        contact: {
            name: 'John Cyber',
            position: 'CEO',
            phone: '123-456-7890',
            address: '123 Tech Road, Silicon Valley',
            email: 'john.cyber@cybernetics.com'
        },
        companyOverview: 'Pioneers in neural interfaces and AI development.'
    },
    {
        employee: 'Alex Ray',
        employeeId: 'alex-ray',
        customerName: 'Hyperion Corp.',
        customerCode: 'B0001',
        customerGrade: 'B',
        customerType: 'transfer',
        monthlySales: [
            { month: 9, actual: 21000, average: 20000 },
        ],
        yearlySales: [
            { year: 2023, amount: 240000 },
        ],
        creditBalance: 35000.50,
        contact: {
            name: 'Sarah Hyper',
            position: 'Supply Chain Manager',
            phone: '987-654-3210',
            address: '456 Industry Ave, Metropolis',
            email: 'sarah.h@hyperion.com'
        },
        companyOverview: 'Global leader in advanced materials and energy solutions.'
    },
    {
        employee: 'Jane Smith',
        employeeId: 'jane-smith',
        customerName: 'Omega Solutions',
        customerCode: 'C0001',
        customerGrade: 'C',
        customerType: 'own',
        monthlySales: [
            { month: 9, actual: 6000, average: 5000 },
        ],
        yearlySales: [
            { year: 2023, amount: 60000 },
        ],
        creditBalance: 5500.00,
        contact: {
            name: 'Peter Omega',
            position: 'Owner',
            phone: '555-123-4567',
            address: '789 Business Blvd, Smalltown',
            email: null
        },
        companyOverview: 'Local provider of IT support and services.'
    },
     {
        employee: 'Tom Wilson',
        employeeId: 'tom-wilson',
        customerName: 'Stark Industries',
        customerCode: 'A0002',
        customerGrade: 'A',
        customerType: 'pending',
        monthlySales: [],
        yearlySales: [],
        creditBalance: 0,
        contact: {
            name: 'Tony Stark',
            position: 'CEO',
            phone: '212-970-4133',
            address: '10880 Malibu Point, 90265',
            email: 'tony.stark@stark.com'
        },
        companyOverview: 'Leader in defense and clean energy technology.'
    }
];

export type ProductTarget = {
    id: string;
    productCode: string;
    productName: string;
    categoryCode?: string;
    pastSales: { [month: number]: number };
    monthlyTarget: { [month: number]: number };
    monthlyActual: { [month: number]: number };
};

export type CustomerTarget = {
    id: string;
    employeeId: string;
    employeeName: string;
    customerCode: string;
    customerName: string;
    products: ProductTarget[];
};

export const salesTargetManagementData: CustomerTarget[] = [
    {
        id: 'ct-1',
        employeeId: 'jane-smith',
        employeeName: 'Jane Smith',
        customerCode: 'C-101',
        customerName: 'Cybernetics Inc.',
        products: [
            { id: 'p-1-1', productCode: 'e-001', productName: 'Quantum Drive', pastSales: { 6: 10000, 7: 11000, 8: 10500 }, monthlyTarget: { 9: 12000 }, monthlyActual: { 9: 12500 } },
            { id: 'p-1-2', productCode: 'e-002', productName: 'Photon Core', pastSales: { 6: 5000, 7: 4500, 8: 5500 }, monthlyTarget: { 9: 6000 }, monthlyActual: { 9: 5800 } },
        ]
    },
    {
        id: 'ct-2',
        employeeId: 'alex-ray',
        employeeName: 'Alex Ray',
        customerCode: 'C-102',
        customerName: 'Hyperion Corp.',
        products: [
            { id: 'p-2-1', productCode: 'c-001', productName: 'Gravity Cloak', pastSales: { 6: 20000, 7: 22000, 8: 21000 }, monthlyTarget: { 9: 25000 }, monthlyActual: { 9: 26000 } },
        ]
    },
    {
        id: 'ct-3',
        employeeId: 'tom-wilson',
        employeeName: 'Tom Wilson',
        customerCode: 'C-105',
        customerName: 'Titan Industries',
        products: [
            { id: 'p-3-1', productCode: 'h-001', productName: 'Zero-G Mug', pastSales: { 6: 1000, 7: 1200, 8: 1100 }, monthlyTarget: { 9: 1500 }, monthlyActual: { 9: 1400 } },
            { id: 'p-3-2', productCode: 'h-002', productName: 'Astro-Planter', pastSales: { 6: 3000, 7: 2800, 8: 3200 }, monthlyTarget: { 9: 3500 }, monthlyActual: { 9: 3600 } },
        ]
    },
];
