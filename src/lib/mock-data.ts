
import type { Icon } from 'lucide-react';
import {
  Activity,
  CreditCard,
  DollarSign,
  Users,
  CircleUser,
  Star,
  Users2,
  ShoppingCart,
  WalletCards,
  Landmark,
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: Icon;
  label?: string;
  disabled?: boolean;
};

export type NavItemChild = {
  title: string;
  items: NavItem[];
};

export const navItems: (NavItem | NavItemChild)[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Activity,
    label: 'Dashboard',
  },
  {
    title: 'Sales',
    icon: ShoppingCart,
    items: [
      {
        title: 'New Sale',
        href: '/sales/new',
        icon: CircleUser,
        label: 'new-sale',
      },
      {
        title: 'Sales Report',
        href: '/sales/report',
        icon: Users,
        label: 'sales-report',
      },
    ],
  },
  {
    title: 'Credit Report',
    href: '/credit',
    icon: WalletCards,
    label: 'credit-report',
  },
  {
    title: 'Check Report',
    href: '/reports/checks',
    icon: Landmark,
    label: 'check-report',
  },
];


export type Employee = {
    id: string;
    name: string;
    email: string;
    role: 'Manager' | 'Sales Rep';
    avatar: string;
};

export const employees = [
  { value: 'jane-smith', label: 'Jane Smith', role: 'employee', name: 'Jane Smith' },
  { value: 'alex-ray', label: 'Alex Ray', role: 'manager', name: 'Alex Ray' },
  { value: 'john-doe', label: 'John Doe', role: 'employee', name: 'John Doe' },
  { value: 'admin-user', label: 'Admin User', role: 'admin', name: 'Admin User' },
];

export const customers = [
    { value: 'c-101', label: 'Tech Solutions Inc.', grade: 'A' },
    { value: 'c-102', label: 'Global Imports Co.', grade: 'B' },
    { value: 'c-103', label: 'Innovate Creations', grade: 'A' },
    { value: 'c-104', label: 'Retail Goods LLC', grade: 'C' },
    { value: 'c-105', label: 'Boston Consulting', grade: 'A' },
    { value: 'c-106', label: 'New York Logistics', grade: 'B' },
];

export type Customer = {
  employee: string;
  customerName: string;
  customerCode: string;
  customerGrade: 'A' | 'B' | 'C';
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


export const customerData: Customer[] = [
  {
    employee: 'Jane Smith',
    customerName: 'Tech Solutions Inc.',
    customerCode: 'C-101',
    customerGrade: 'A',
    customerType: 'own',
    monthlySales: [ { month: 9, actual: 12000, average: 10000 }],
    yearlySales: [{ year: 2023, amount: 125000 }],
    creditBalance: 15200.00,
    contact: { name: 'Alice Johnson', position: 'CTO', phone: '111-222-3333', address: '123 Tech Park', email: 'alice@techsolutions.com'},
    companyOverview: 'Provides IT consulting and software development services.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Global Imports Co.',
    customerCode: 'C-102',
    customerGrade: 'B',
    customerType: 'transfer',
    monthlySales: [ { month: 9, actual: 8500, average: 9000 }],
    yearlySales: [{ year: 2023, amount: 105000 }],
    creditBalance: 8300.50,
    contact: { name: 'Bob Williams', position: 'Import Manager', phone: '222-333-4444', address: '456 Global Way', email: 'bob@globalimports.com'},
    companyOverview: 'Specializes in importing goods from around the world.'
  },
  {
    employee: 'John Doe',
    customerName: 'Innovate Creations',
    customerCode: 'C-103',
    customerGrade: 'A',
    customerType: 'own',
    monthlySales: [ { month: 9, actual: 15000, average: 14000 }],
    yearlySales: [{ year: 2023, amount: 180000 }],
    creditBalance: 22000.75,
    contact: { name: 'Charlie Brown', position: 'CEO', phone: '333-444-5555', address: '789 Innovation Ave', email: 'charlie@innovate.com'},
    companyOverview: 'A design and marketing firm focused on branding.'
  },
  {
    employee: 'Jane Smith',
    customerName: 'Retail Goods LLC',
    customerCode: 'C-104',
    customerGrade: 'C',
    customerType: 'transfer',
    monthlySales: [ { month: 9, actual: 5000, average: 5500 }],
    yearlySales: [{ year: 2023, amount: 65000 }],
    creditBalance: 4500.00,
    contact: { name: 'Diana Prince', position: 'Store Owner', phone: '444-555-6666', address: '101 Retail Row', email: null},
    companyOverview: 'A local chain of retail stores for everyday goods.'
  },
];

export const customerUploadCsvData = `Employee,CustomerName,CustomerCode,Grade,ContactName,ContactPosition,ContactPhone,ContactAddress,ContactEmail,CompanyOverview
jane-smith,Boston Consulting,A0011,A,Eleanor Vance,Senior Partner,555-0101,1 Financial Center,eleanor.v@bc.com,"A global management consulting firm."
alex-ray,New York Logistics,A0012,B,Frank Murphy,Operations Head,555-0102,100 Logistics Lane,frank.m@nyl.com,"Provides freight and logistics services."`;

export const products = [
    { value: 'p-001', label: 'Pro-Gamer Mouse', basePrice: 850 },
    { value: 'p-002', label: 'Ergonomic Keyboard', basePrice: 1200 },
    { value: 'p-003', label: '4K Ultra-HD Monitor', basePrice: 4500 },
    { value: 'p-004', label: 'Noise-Cancelling Headphones', basePrice: 1500 },
];

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPurchasePrice
Electronics,P-005,Smart Watch,150.00,145.00
Electronics,P-006,Webcam HD,55.00,52.50`;

export const importUploadCsvData = `Date,Supplier,ProductCategory,ProductCode,ProductDescription,Quantity,UnitPrice
2024-09-15,Global Electronics,Electronics,P-005,Smart Watch,50,150.00
2024-09-16,Global Electronics,Electronics,P-006,Webcam HD,100,55.00`;


export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  current: 38000,
  target: 45000
}

export const salesTargetChartData = [
  { name: '실적', sales: salesTargetData.current, target: salesTargetData.target },
];

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
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


export type DuePayment = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  amount: number;
  dueDate: string; // ISO 8601 format
  collectionPlan?: string;
};


export const duePaymentsData: DuePayment[] = [
  {
    id: 'inv-001',
    customer: { name: 'Tech Solutions Inc.', email: 'billing@techsolutions.com' },
    employee: 'Jane Smith',
    amount: 250.00,
    dueDate: '2024-09-15',
    collectionPlan: 'Sent reminder email on 9/16.'
  },
  {
    id: 'inv-002',
    customer: { name: 'Global Imports Co.', email: 'accounts@globalimports.com' },
    employee: 'Alex Ray',
    amount: 150.75,
    dueDate: '2024-08-30',
  },
  {
    id: 'inv-003',
    customer: { name: 'Innovate Creations', email: 'pay@innovate.com' },
    employee: 'John Doe',
    amount: 350.00,
    dueDate: '2024-09-25',
  },
  {
    id: 'inv-004',
    customer: { name: 'Retail Goods LLC', email: 'contact@retailgoods.com' },
    employee: 'Jane Smith',
    amount: 450.00,
    dueDate: '2024-08-10',
  },
  {
    id: 'inv-005',
    customer: { name: 'Tech Solutions Inc.', email: 'billing@techsolutions.com' },
    employee: 'Jane Smith',
    amount: 550.00,
    dueDate: '2023-08-05',
  },
];


export const salesTrendCsvData = `Date,Amount,Product,Region
2023-01-15,250.00,Pro-Gamer Mouse,North
2023-01-20,1200.00,Ergonomic Keyboard,North
2023-02-10,4500.00,4K Ultra-HD Monitor,South
2023-02-18,850.00,Pro-Gamer Mouse,South
2023-03-05,1500.00,Noise-Cancelling Headphones,West
2023-03-12,250.00,Pro-Gamer Mouse,West
2023-04-02,1200.00,Ergonomic Keyboard,East
2023-04-25,4500.00,4K Ultra-HD Monitor,East
2023-05-15,850.00,Pro-Gamer Mouse,North
2023-06-20,1500.00,Noise-Cancelling Headphones,North
2023-07-10,250.00,Pro-Gamer Mouse,South
2023-08-01,1200.00,Ergonomic Keyboard,West`;


export type SalesTarget = {
    customerCode: string;
    customerName: string;
    employeeName: string;
    targets: {
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    totalTarget: number;
}

export const monthlySalesTargetData: SalesTarget[] = [
    {
        customerCode: 'C-101',
        customerName: 'Tech Solutions Inc.',
        employeeName: 'Jane Smith',
        targets: [
            { productId: 'p-002', productName: 'Ergonomic Keyboard', quantity: 10, price: 1200, total: 12000 },
            { productId: 'p-003', productName: '4K Ultra-HD Monitor', quantity: 2, price: 4500, total: 9000 },
        ],
        totalTarget: 21000,
    },
    {
        customerCode: 'C-102',
        customerName: 'Global Imports Co.',
        employeeName: 'Alex Ray',
        targets: [
            { productId: 'p-001', productName: 'Pro-Gamer Mouse', quantity: 20, price: 850, total: 17000 },
        ],
        totalTarget: 17000,
    },
];

export type SalesReportData = {
    employeeName: string;
    customerName: string;
    customerCode: string;
    target: number;
    actual: number;
}

export const salesReportData: SalesReportData[] = [
    { employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', customerCode: 'C-101', target: 21000, actual: 22500 },
    { employeeName: 'Jane Smith', customerName: 'Retail Goods LLC', customerCode: 'C-104', target: 8000, actual: 7500 },
    { employeeName: 'Alex Ray', customerName: 'Global Imports Co.', customerCode: 'C-102', target: 17000, actual: 18200 },
    { employeeName: 'John Doe', customerName: 'Innovate Creations', customerCode: 'C-103', target: 15000, actual: 14000 },
];


export type PastSaleProduct = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};

export type MonthlyPastSales = {
  month: 'June' | 'July' | 'August';
  sales: PastSaleProduct[];
  total: number;
};

export type CustomerPastSales = {
  customerCode: string;
  customerName: string;
  history: MonthlyPastSales[];
};


export const pastSalesDetails: CustomerPastSales[] = [
  {
    customerCode: 'C-101',
    customerName: 'Tech Solutions Inc.',
    history: [
      {
        month: 'June',
        sales: [
          { productId: 'p-002', productName: 'Ergonomic Keyboard', quantity: 8, price: 1200, total: 9600 },
          { productId: 'p-004', productName: 'Noise-Cancelling Headphones', quantity: 5, price: 1500, total: 7500 },
        ],
        total: 17100
      },
      {
        month: 'July',
        sales: [
          { productId: 'p-002', productName: 'Ergonomic Keyboard', quantity: 10, price: 1200, total: 12000 },
          { productId: 'p-003', productName: '4K Ultra-HD Monitor', quantity: 1, price: 4500, total: 4500 },
        ],
        total: 16500
      },
      {
        month: 'August',
        sales: [
           { productId: 'p-002', productName: 'Ergonomic Keyboard', quantity: 12, price: 1180, total: 14160 },
        ],
        total: 14160
      },
    ]
  },
  {
    customerCode: 'C-102',
    customerName: 'Global Imports Co.',
    history: [
      {
        month: 'June',
        sales: [],
        total: 0
      },
      {
        month: 'July',
        sales: [
          { productId: 'p-001', productName: 'Pro-Gamer Mouse', quantity: 15, price: 850, total: 12750 },
        ],
        total: 12750
      },
      {
        month: 'August',
        sales: [
          { productId: 'p-001', productName: 'Pro-Gamer Mouse', quantity: 18, price: 850, total: 15300 },
          { productId: 'p-004', productName: 'Noise-Cancelling Headphones', quantity: 2, price: 1500, total: 3000 },
        ],
        total: 18300
      },
    ]
  },
   {
    customerCode: 'C-103',
    customerName: 'Innovate Creations',
    history: [
       {
        month: 'June',
        sales: [
          { productId: 'p-003', productName: '4K Ultra-HD Monitor', quantity: 3, price: 4500, total: 13500 },
        ],
        total: 13500
      },
      {
        month: 'July',
        sales: [
           { productId: 'p-003', productName: '4K Ultra-HD Monitor', quantity: 2, price: 4500, total: 9000 },
        ],
        total: 9000
      },
      {
        month: 'August',
        sales: [
           { productId: 'p-003', productName: '4K Ultra-HD Monitor', quantity: 4, price: 4450, total: 17800 },
        ],
        total: 17800
      },
    ]
  },
];


export type CommissionSale = {
  type: '수입' | '현지';
  salePrice: number;
  costPrice: number;
  customerType: 'own' | 'transfer';
};

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입', salePrice: 150000, costPrice: 120000, customerType: 'own' as 'own' },
      { type: '수입' as '수입', salePrice: 80000, costPrice: 60000, customerType: 'own' as 'own' },
      { type: '수입' as '수입', salePrice: 50000, costPrice: 40000, customerType: 'transfer' as 'transfer' },
      { type: '현지' as '현지', salePrice: 20000, costPrice: 15000, customerType: 'own' as 'own' }, // margin 25% -> rate 12%
      { type: '현지' as '현지', salePrice: 30000, costPrice: 25000, customerType: 'transfer' as 'transfer' }, // margin 16.6% -> rate 10% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입', salePrice: 300000, costPrice: 250000, customerType: 'own' as 'own' },
      { type: '현지' as '현지', salePrice: 100000, costPrice: 55000, customerType: 'own' as 'own' }, // margin 45% -> rate 18%
      { type: '현지' as '현지', salePrice: 50000, costPrice: 48000, customerType: 'own' as 'own' }, // margin 4% -> rate 3%
    ],
  },
];


export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
}

export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: 'ecs-01', customerName: 'Tech Solutions Inc.', salesTarget: 15000, salesAmount: 18200 },
  { id: 'ecs-02', customerName: 'Retail Goods LLC', salesTarget: 10000, salesAmount: 7500 },
  { id: 'ecs-03', customerName: 'Boston Consulting', salesTarget: 12000, salesAmount: 12300 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
}

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  'ecs-01': [
    { productName: 'Ergonomic Keyboard', salesTarget: 10000, salesAmount: 12000 },
    { productName: '4K Ultra-HD Monitor', salesTarget: 5000, salesAmount: 6200 },
  ],
  'ecs-02': [
    { productName: 'Pro-Gamer Mouse', salesTarget: 5000, salesAmount: 4000 },
    { productName: 'Noise-Cancelling Headphones', salesTarget: 5000, salesAmount: 3500 },
  ],
  'ecs-03': [
      { productName: 'Pro-Gamer Mouse', salesTarget: 4000, salesAmount: 4800 },
      { productName: 'Ergonomic Keyboard', salesTarget: 8000, salesAmount: 7500 },
  ]
};

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
  { month: 'Nov', target: 60000, actual: 0, lastYear: 58000 },
  { month: 'Dec', target: 70000, actual: 0, lastYear: 65000 },
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
        customerName: 'Tech Solutions Inc.',
        products: [
          { productName: 'Ergonomic Keyboard', target: 12000, actual: 13500 },
          { productName: '4K Ultra-HD Monitor', target: 8000, actual: 9000 },
        ],
      },
      {
        customerName: 'Global Imports Co.',
        products: [
          { productName: 'Pro-Gamer Mouse', target: 10000, actual: 11000 },
        ]
      }
    ]
  },
  // ... data for other months
];


export type CashSale = {
  id: string;
  date: string; // ISO date
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
};

export const cashSalesData: CashSale[] = [
  { id: 'cs-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', source: '신용 수금', amount: 1200 },
  { id: 'cs-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Global Imports Co.', source: '현금 판매', amount: 800 },
  { id: 'cs-003', date: '2024-09-03', employeeName: 'Jane Smith', customerName: 'Retail Goods LLC', source: '현금 판매', amount: 550 },
  { id: 'cs-004', date: '2024-09-09', employeeName: 'John Doe', customerName: 'Innovate Creations', source: '신용 수금', amount: 2000 },
  { id: 'cs-005', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', source: '현금 판매', amount: 300 },
  { id: 'cs-006', date: '2024-08-26', employeeName: 'Alex Ray', customerName: 'Global Imports Co.', source: '신용 수금', amount: 1500 },
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
  { id: 'chk-01', receiptDate: '2024-09-01', dueDate: '2024-10-01', salesperson: 'Jane Smith', customerName: 'Tech Solutions Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: 'Chase', depositDate: '2024-09-02', status: 'Pending', notes: 'Awaiting confirmation' },
  { id: 'chk-02', receiptDate: '2024-09-03', dueDate: '2024-09-20', salesperson: 'Alex Ray', customerName: 'Global Imports Co.', issuingBank: 'Citibank', checkNumber: '67890', amount: 3200, depositBank: 'Chase', depositDate: '2024-09-04', status: 'Confirmed', notes: '' },
  { id: 'chk-03', receiptDate: '2024-08-28', dueDate: '2024-09-15', salesperson: 'John Doe', customerName: 'Innovate Creations', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 8000, depositBank: 'Bank of America', depositDate: '2024-08-29', status: 'Rejected', notes: 'Bounced. Penalty applied.' },
];
