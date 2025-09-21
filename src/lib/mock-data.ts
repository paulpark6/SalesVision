import type { NavItem, NavItemWithLink } from '@/types/nav';

export const mainNav: NavItem[] = [
  {
    title: 'Lobby',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: 'dashboard',
        description: 'Get an overview of your sales performance.',
      },
      {
        title: 'Sales',
        href: '/dashboard/sales',
        icon: 'sales',
        description: 'View and manage your sales records.',
      },
      {
        title: 'Customers',
        href: '/dashboard/customers',
        icon: 'customers',
        description: 'Manage your customer base.',
      },
    ],
  },
];

export const overviewData = {
    totalRevenue: 52389.50,
    subscriptions: 582,
    sales: 1250,
    activeNow: 168
}

export const salesTargetData = {
    current: 42100.50,
    target: 45000,
}

export const salesTargetChartData = [
  { name: 'Jan', sales: 18, target: 20 },
  { name: 'Feb', sales: 22, target: 25 },
  { name: 'Mar', sales: 28, target: 30 },
  { name: 'Apr', sales: 25, target: 28 },
  { name: 'May', sales: 32, target: 35 },
  { name: 'Jun', sales: 38, target: 40 },
  { name: 'Jul', sales: 42, target: 45 },
  { name: 'Aug', sales: 45, target: 48 },
  { name: 'Sep', sales: 42.1, target: 45 },
  { name: 'Oct', sales: 0, target: 52 },
  { name: 'Nov', sales: 0, target: 55 },
  { name: 'Dec', sales: 0, target: 60 },
];


export const recentSalesData = [
    {
        customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com' },
        amount: 1999.00
    },
    {
        customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com' },
        amount: 39.00
    },
    {
        customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
        amount: 299.00
    },
    {
        customer: { name: 'William Kim', email: 'will@email.com' },
        amount: 99.00
    },
    {
        customer: { name: 'Sofia Davis', email: 'sofia.davis@email.com' },
        amount: 39.00
    }
]

export const duePaymentsData: DuePayment[] = [
    {
        id: 'INV-001',
        employee: 'Jane Smith',
        customer: { name: 'Global Tech Inc.', email: 'contact@globaltech.com' },
        dueDate: '2023-08-15', // Overdue
        amount: 2500.00,
        collectionPlan: 'Followed up via email on 2023-09-01. Waiting for response.'
    },
    {
        id: 'INV-002',
        employee: 'John Doe',
        customer: { name: 'Innovate Solutions', email: 'accounts@innovatesolutions.com' },
        dueDate: '2024-09-20', // Due
        amount: 1500.75,
        collectionPlan: ''
    },
    {
        id: 'INV-003',
        employee: 'Alex Ray',
        customer: { name: 'Quantum Leap LLC', email: 'finance@quantumleap.com' },
        dueDate: '2024-10-05', // Nearing
        amount: 800.00,
        collectionPlan: ''
    },
    {
        id: 'INV-004',
        employee: 'Jane Smith',
        customer: { name: 'Synergy Corp', email: 'billing@synergycorp.net' },
        dueDate: '2024-09-18', // Due
        amount: 3200.50,
        collectionPlan: ''
    },
    {
        id: 'INV-005',
        employee: 'Alex Ray',
        customer: { name: 'Apex Industries', email: 'payables@apex.com' },
        dueDate: '2023-01-10', // Overdue > 1 year
        amount: 5000.00,
        collectionPlan: 'Legal notice sent on 2023-03-15.'
    },
    {
        id: 'INV-006',
        employee: 'John Doe',
        customer: { name: 'Pinnacle Systems', email: 'ap@pinnaclesys.com' },
        dueDate: '2024-08-25', // Overdue
        amount: 1250.25,
        collectionPlan: 'Payment promised by end of September.'
    }
];
export type DuePayment = {
    id: string;
    employee: string;
    customer: {
        name: string;
        email: string;
    };
    dueDate: string;
    amount: number;
    collectionPlan?: string;
};


export const salesTrendCsvData = `Date,Category,Product,Quantity,UnitPrice,Total
2023-01-15,Electronics,Laptop,5,1200,6000
2023-01-17,Clothing,T-Shirt,50,25,1250
2023-02-20,Electronics,Smartphone,10,800,8000
2023-02-22,Home Goods,Coffee Maker,20,50,1000
2023-03-10,Clothing,Jeans,40,70,2800
2023-04-05,Electronics,Laptop,8,1250,10000
2023-07-15,Electronics,Headphones,100,100,10000
2023-07-20,Clothing,Summer Dress,60,45,2700
2023-11-25,Electronics,Gaming Console,15,500,7500
2023-12-20,Clothing,Winter Jacket,30,150,4500
`;

export const employees = [
  { value: 'jane-smith', label: 'Jane Smith', role: 'employee', name: 'Jane Smith' },
  { value: 'alex-ray', label: 'Alex Ray', role: 'manager', name: 'Alex Ray' },
  { value: 'john-doe', label: 'John Doe', role: 'employee', name: 'John Doe'},
  { value: 'admin-user', label: 'Admin User', role: 'admin', name: 'Admin User'}
];

export const products = [
  { value: 'p-001', label: 'Premium Wireless Mouse', basePrice: 25.50 },
  { value: 'p-002', label: 'Mechanical Keyboard', basePrice: 75.00 },
  { value: 'p-003', label: '4K IPS Monitor', basePrice: 350.00 },
  { value: 'p-004', label: 'Noise-Cancelling Headphones', basePrice: 120.00 },
];

export const customers = [
  { value: 'c-101', label: 'Global Tech Inc.', grade: 'A' },
  { value: 'c-102', label: 'Innovate Solutions', grade: 'B' },
  { value: 'c-103', label: 'Quantum Leap LLC', grade: 'A' },
  { value: 'c-104', label: 'Synergy Corp', grade: 'C' },
  { value: 'c-105', label: 'Apex Industries', grade: 'B' },
  { value: 'c-106', label: 'Pinnacle Systems', grade: 'A' },
];

export const salesReportData = [
  {
    employeeName: 'Jane Smith',
    customerName: 'Global Tech Inc.',
    customerCode: 'C-101',
    target: 15000,
    actual: 16500,
  },
  {
    employeeName: 'Jane Smith',
    customerName: 'Synergy Corp',
    customerCode: 'C-104',
    target: 5000,
    actual: 4500,
  },
   {
    employeeName: 'Jane Smith',
    customerName: 'Pinnacle Systems',
    customerCode: 'C-106',
    target: 18000,
    actual: 17000,
  },
  {
    employeeName: 'Alex Ray',
    customerName: 'Innovate Solutions',
    customerCode: 'C-102',
    target: 20000,
    actual: 22000,
  },
   {
    employeeName: 'Alex Ray',
    customerName: 'Quantum Leap LLC',
    customerCode: 'C-103',
    target: 25000,
    actual: 26000,
  },
  {
    employeeName: 'John Doe',
    customerName: 'Apex Industries',
    customerCode: 'C-105',
    target: 12000,
    actual: 13000,
  },
];

export const cumulativeReportData = [
    { month: '1월', target: 20000, actual: 18500, lastYear: 17000 },
    { month: '2월', target: 22000, actual: 21000, lastYear: 19500 },
    { month: '3월', target: 25000, actual: 26000, lastYear: 24000 },
    { month: '4월', target: 24000, actual: 23500, lastYear: 22000 },
    { month: '5월', target: 28000, actual: 29000, lastYear: 27000 },
    { month: '6월', target: 30000, actual: 31000, lastYear: 28500 },
    { month: '7월', target: 32000, actual: 33000, lastYear: 30000 },
    { month: '8월', target: 35000, actual: 36000, lastYear: 34000 },
    { month: '9월', target: 45000, actual: 42100, lastYear: 39000 },
    // Data for Oct, Nov, Dec is aspirational
    { month: '10월', target: 40000, actual: 0, lastYear: 38000 },
    { month: '11월', target: 38000, actual: 0, lastYear: 36000 },
    { month: '12월', target: 50000, actual: 0, lastYear: 48000 },
];

export const monthlyDetailReportData: MonthlyDetail[] = [
  {
    month: '9월',
    details: [
      {
        customerName: 'Global Tech Inc.',
        products: [
          { productName: 'Premium Wireless Mouse', target: 5000, actual: 5500 },
          { productName: 'Mechanical Keyboard', target: 10000, actual: 11000 },
        ],
      },
      {
        customerName: 'Innovate Solutions',
        products: [
          { productName: '4K IPS Monitor', target: 15000, actual: 16000 },
          { productName: 'Noise-Cancelling Headphones', target: 5000, actual: 6000 },
        ],
      },
    ],
  },
  {
    month: '8월',
    details: [
       {
        customerName: 'Global Tech Inc.',
        products: [
          { productName: 'Premium Wireless Mouse', target: 4000, actual: 4500 },
          { productName: 'Mechanical Keyboard', target: 8000, actual: 9000 },
        ],
      },
      {
        customerName: 'Synergy Corp',
        products: [
          { productName: '4K IPS Monitor', target: 10000, actual: 9000 },
        ],
      },
    ]
  }
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


export const productUploadCsvData = `Category,Product Code,Description,Import Price,Local Purchase Price
Electronics,E-001,Premium Wireless Mouse,18.50,19.00
Electronics,E-002,Mechanical Keyboard,55.00,58.00
Electronics,E-003,"4K, 27-inch IPS Monitor",280.00,295.00
Accessories,A-001,USB-C Hub,35.00,38.00
`;

export const customerUploadCsvData = `CustomerName,CustomerCode,Grade,Employee,ContactName,ContactPosition,ContactPhone,ContactAddress
"Stellar Solutions","A0124","A","jane-smith","Sarah Connor","Lead Buyer","555-0101","123 Future Way"
"Nexus Innovations","A0125","B","john-doe","John Anderton","CTO","555-0102","456 Precrime Ave"
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price
2024-09-20,Global Imports,Electronics,e-001,Premium Wireless Mouse,500,18.50
2024-09-21,Tech Suppliers,Electronics,e-002,Mechanical Keyboard,200,55.00
`;

export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 150000, costPrice: 0, customerType: 'own' },
      { type: '수입', salePrice: 80000, costPrice: 0, customerType: 'own' },
      { type: '수입', salePrice: 50000, costPrice: 0, customerType: 'transfer' },
      { type: '현지', salePrice: 10000, costPrice: 8500, customerType: 'own' }, // margin 15% -> 10%
      { type: '현지', salePrice: 5000, costPrice: 4800, customerType: 'transfer' }, // margin 4% -> 3% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 180000, costPrice: 0, customerType: 'own' },
      { type: '현지', salePrice: 25000, costPrice: 15000, customerType: 'own' }, // margin 40% -> 18%
      { type: '현지', salePrice: 12000, costPrice: 10000, customerType: 'transfer' }, // margin 16.6% -> 10% * 0.5
    ],
  },
  {
    employeeId: 'EMP-003',
    employeeName: 'Alex Ray',
    sales: [
       { type: '수입', salePrice: 300000, costPrice: 0, customerType: 'own' },
       { type: '현지', salePrice: 40000, costPrice: 32000, customerType: 'own' }, // margin 20% -> 12%
    ]
  }
];

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 39000 },
];

export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: '1', customerName: 'Global Tech', salesTarget: 15000, salesAmount: 16500 },
  { id: '2', customerName: 'Synergy Corp', salesTarget: 5000, salesAmount: 4500 },
  { id: '3', customerName: 'Pinnacle Systems', salesTarget: 18000, salesAmount: 17000 },
  { id: '4', customerName: 'New Horizons', salesTarget: 7000, salesAmount: 8000 },
];

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
}

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
}

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  '1': [
    { productName: 'Wireless Mouse', salesTarget: 8000, salesAmount: 9000 },
    { productName: 'Mechanical Keyboard', salesTarget: 7000, salesAmount: 7500 },
  ],
  '2': [
    { productName: '4K Monitor', salesTarget: 5000, salesAmount: 4500 },
  ],
  '3': [
    { productName: 'Noise-Cancelling Headphones', salesTarget: 10000, salesAmount: 11000 },
    { productName: 'USB-C Hub', salesTarget: 8000, salesAmount: 6000 },
  ],
  '4': [
    { productName: 'Wireless Mouse', salesTarget: 4000, salesAmount: 4500 },
    { productName: 'Webcam', salesTarget: 3000, salesAmount: 3500 },
  ]
};

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
  {
    id: 'CHK-001',
    receiptDate: '2024-09-01',
    dueDate: '2024-10-01',
    salesperson: 'Jane Smith',
    customerName: 'Global Tech Inc.',
    issuingBank: 'Bank of America',
    checkNumber: '12345',
    amount: 5000.00,
    depositBank: 'Chase',
    depositDate: '2024-10-02',
    status: 'Confirmed',
    notes: 'Partial payment for INV-001',
  },
  {
    id: 'CHK-002',
    receiptDate: '2024-09-05',
    dueDate: '2024-09-20',
    salesperson: 'Alex Ray',
    customerName: 'Innovate Solutions',
    issuingBank: 'Wells Fargo',
    checkNumber: '67890',
    amount: 1500.75,
    depositBank: 'Citibank',
    depositDate: '',
    status: 'Pending',
    notes: 'Full payment for INV-002',
  },
  {
    id: 'CHK-003',
    receiptDate: '2024-09-10',
    dueDate: '2024-09-15',
    salesperson: 'John Doe',
    customerName: 'Pinnacle Systems',
    issuingBank: 'Bank of America',
    checkNumber: '54321',
    amount: 1250.25,
    depositBank: '',
    depositDate: '',
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
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Walk-in Customer', source: '현금 판매', amount: 350.00 },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'John Doe', customerName: 'Global Tech Inc.', source: '신용 수금', amount: 1200.00 },
  { id: 'CS-003', date: '2024-09-03', employeeName: 'Alex Ray', customerName: 'Retail Partner', source: '현금 판매', amount: 850.50 },
  { id: 'CS-004', date: '2024-09-09', employeeName: 'Jane Smith', customerName: 'Innovate Solutions', source: '신용 수금', amount: 750.00 },
  { id: 'CS-005', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Local Biz', source: '현금 판매', amount: 250.00 },
  { id: 'CS-006', date: '2024-08-28', employeeName: 'Alex Ray', customerName: 'Quantum Leap LLC', source: '신용 수금', amount: 2500.00 },
];

    