
import type { NavItem, SidebarNavItem } from '@/types/nav';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: 'dollarSign',
    label: 'sales',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: 'user',
    label: 'customers',
  },
  {
    title: 'Products',
    href: '/products',
    icon: 'laptop',
    label: 'products',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: 'barChart',
    label: 'analytics',
  },
];

export const sidebarNavItems: SidebarNavItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: "home",
    },
    {
        title: "Add Sale",
        href: "/sales/new",
        icon: "cart",
    },
    {
        title: "Customers",
        icon: "users",
        items: [
            {
                title: "Customer List",
                href: "/customers",
                icon: "user",
            },
            {
                title: "Add Customer",
                href: "/customers/new",
                icon: "userPlus",
            }
        ]
    },
     {
        title: "Reports",
        icon: "fileText",
        items: [
            {
                title: "Sales Report",
                href: "/sales/report",
                icon: "barChart",
            },
            {
                title: "Credit Report",
                href: "/credit",
                icon: "creditCard"
            }
        ]
    },
    {
        title: "Products",
        href: "/products",
        icon: "package",
    },
    {
        title: "Inventory",
        href: "/inventory",
        icon: "box",
    },
    {
        title: "Commissions",
        href: "/commissions",
        icon: "percent",
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: "lineChart",
    }
]

export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  newCustomers: 573,
  activeNow: 189,
};

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

export const duePaymentsData: DuePayment[] = [
  {
    id: 'INV-001',
    customer: { name: 'Tech Solutions Inc.', email: 'contact@techsolutions.com' },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2023-08-15',
    amount: 2500.00,
    collectionPlan: 'Follow-up call scheduled for Aug 10.',
  },
  {
    id: 'INV-002',
    customer: { name: 'Creative Minds LLC', email: 'billing@creativeminds.com' },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2024-09-20',
    amount: 1500.75,
    collectionPlan: '',
  },
  {
    id: 'INV-003',
    customer: { name: 'Global Exports', email: 'accounts@globalexports.com' },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: '2024-09-05',
    amount: 350.00,
    collectionPlan: 'Payment expected by end of week.',
  },
  {
    id: 'INV-004',
    customer: { name: 'Retail Goods Co.', email: 'payments@retailgoods.com' },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2022-07-30',
    amount: 45.50,
    collectionPlan: 'Customer unresponsive. Final notice sent.',
  },
  {
    id: 'INV-005',
    customer: { name: 'Innovatech', email: 'finance@innovatech.com' },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2024-09-10',
    amount: 1200.00,
    collectionPlan: 'Check to be mailed on Sep 8.',
  },
   {
    id: 'INV-006',
    customer: { name: 'Innovatech', email: 'finance@innovatech.com' },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2021-01-10',
    amount: 800.00,
    collectionPlan: 'Unresolved dispute. Legal consultation needed.',
  },
];
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


export const salesTargetData = {
    current: 38000,
    target: 45000,
}

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const salesTargetChartData = [
    { name: '매출', sales: 38000 },
    { name: '목표', target: 45000 },
];

export const salesTrendCsvData = `Date,Category,Product,Sales
2024-01-15,Electronics,Laptop,1200
2024-01-20,Clothing,T-Shirt,50
2024-02-10,Electronics,Smartphone,800
2024-02-15,Books,Science Fiction Novel,25
2024-03-05,Clothing,Jeans,100
2024-03-22,Electronics,Headphones,150
2024-04-18,Home Goods,Coffee Maker,75
2024-04-25,Books,Cookbook,40
2024-05-12,Electronics,Laptop,1300
2024-05-20,Clothing,Jacket,200
2024-06-15,Electronics,Tablet,600
2024-07-21,Summer Special,Fan,80
2024-08-30,Back to School,Backpack,60
`;

export const employees = [
  { value: 'john-doe', label: 'Admin (John Doe)', role: 'admin', name: 'John Doe' },
  { value: 'admin-user', label: 'Admin (Admin User)', role: 'admin', name: 'Admin User' },
  { value: 'alex-ray', label: 'Manager (Alex Ray)', role: 'manager', name: 'Alex Ray', manager: 'john-doe' },
  { value: 'jane-smith', label: 'Employee (Jane Smith)', role: 'employee', name: 'Jane Smith', manager: 'alex-ray' },
  { value: 'other-employee', label: 'Employee (Other)', role: 'employee', name: 'Other Employee', manager: 'alex-ray' },
];

export const customers = [
    { value: "c-101", label: "Tech Solutions Inc.", grade: "A" },
    { value: "c-102", label: "Creative Minds LLC", grade: "B" },
    { value: "c-103", label: "Global Exports", grade: "A" },
    { value: "c-104", label: "Retail Goods Co.", grade: "C" },
    { value: "c-105", label: "Innovatech", grade: "B" },
];

export const products = [
    { value: "p-001", label: "Laptop Pro 15-inch", basePrice: 1200 },
    { value: "p-002", label: "Wireless Mouse", basePrice: 25 },
    { value: "p-003", label: "Mechanical Keyboard", basePrice: 150 },
    { value: "p-004", label: "4K Monitor 27-inch", basePrice: 450 },
    { value: "p-005", label: "USB-C Hub", basePrice: 60 },
];

export const productUploadCsvData = `"Category","Code","Description","Import Price","Local Purchase Price"
"Electronics","E-006","Noise-Cancelling Headphones",199.99,189.99
"Electronics","E-007","Webcam HD 1080p",59.99,55.00
"Accessories","A-010","Leather Laptop Sleeve",49.50,45.00
`;

export const importUploadCsvData = `"Date","Supplier","Product Category","Product Code","Product Description","Quantity","Unit Price (Import)"
"2024-09-15","Global Tech","Electronics","E-006","Noise-Cancelling Headphones",50,150.00
"2024-09-16","Office Supplies Co.","Accessories","A-010","Leather Laptop Sleeve",100,25.50
`;

export const customerData = [
  {
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    customerName: 'Tech Solutions Inc.',
    customerCode: 'C-101',
    customerGrade: 'A',
    customerType: 'own',
    monthlySales: [
      { month: 9, actual: 15000, average: 12000 },
    ],
    yearlySales: [
      { year: 2023, amount: 150000 },
    ],
    creditBalance: 2500,
    contact: {
      name: 'John Doe',
      position: 'IT Manager',
      phone: '123-456-7890',
      address: '123 Tech Park, Silicon Valley, CA',
      email: 'john.d@techsolutions.com',
    },
    companyOverview: 'Provides comprehensive IT solutions and services.',
  },
  {
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    customerName: 'Creative Minds LLC',
    customerCode: 'C-102',
    customerGrade: 'B',
    customerType: 'transfer',
    monthlySales: [
      { month: 9, actual: 8000, average: 8500 },
    ],
    yearlySales: [
      { year: 2023, amount: 95000 },
    ],
    creditBalance: 1500.75,
    contact: {
      name: 'Jane Smith',
      position: 'Marketing Head',
      phone: '987-654-3210',
      address: '456 Creative Ave, Arts District, NY',
      email: 'jane.s@creativeminds.com',
    },
    companyOverview: 'A full-service digital marketing agency.',
  },
  {
    employee: 'John Doe',
    employeeId: 'john-doe',
    customerName: 'Global Exports',
    customerCode: 'C-103',
    customerGrade: 'A',
    customerType: 'own',
    monthlySales: [
      { month: 9, actual: 22000, average: 20000 },
    ],
    yearlySales: [
      { year: 2023, amount: 240000 },
    ],
    creditBalance: 350.00,
    contact: {
        name: 'Michael Scott',
        position: 'Logistics Manager',
        phone: '555-123-4567',
        address: '789 Port Rd, Long Beach, CA',
        email: 'm.scott@globalexports.com',
    },
    companyOverview: 'International shipping and logistics services.'
  },
  {
    employee: 'Other Employee',
    employeeId: 'other-employee',
    customerName: 'Retail Goods Co.',
    customerCode: 'C-104',
    customerGrade: 'C',
    customerType: 'pending',
    monthlySales: [
      { month: 9, actual: 1200, average: 1500 },
    ],
    yearlySales: [
      { year: 2023, amount: 18000 },
    ],
    creditBalance: 45.50,
     contact: {
      name: 'Dwight Schrute',
      position: 'Store Manager',
      phone: '555-987-6543',
      address: '101 Retail Row, Scranton, PA',
      email: null,
    },
    companyOverview: 'A regional chain of general merchandise stores.'
  }
];

export const customerUploadCsvData = `"Employee","CustomerName","CustomerCode","Grade"
"jane-smith","New Wave Tech","A0010","A"
"alex-ray","Dynamic Imports","A0011","B"
"other-employee","Sunrise Foods","A0012","C"
`;

export const salesReportData = [
  { employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', customerCode: 'C-101', target: 15000, actual: 15250.50 },
  { employeeName: 'Jane Smith', customerName: 'Retail Goods Co.', customerCode: 'C-104', target: 2000, actual: 1200.00 },
  { employeeName: 'Alex Ray', customerName: 'Creative Minds LLC', customerCode: 'C-102', target: 9000, actual: 8050.25 },
  { employeeName: 'John Doe', customerName: 'Global Exports', customerCode: 'C-103', target: 20000, actual: 22100.00 },
  { employeeName: 'John Doe', customerName: 'Innovatech', customerCode: 'C-105', target: 18000, actual: 18900.75 },
];


export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 50000, costPrice: 0, customerType: 'own' },
      { type: '수입', salePrice: 180000, costPrice: 0, customerType: 'own' },
      { type: '현지', salePrice: 15000, costPrice: 13000, customerType: 'own' }, // margin 13.3% -> 10%
      { type: '현지', salePrice: 5000, costPrice: 4800, customerType: 'transfer' }, // margin 4% -> 3% * 0.5
    ]
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입', salePrice: 120000, costPrice: 0, customerType: 'transfer' },
      { type: '현지', salePrice: 30000, costPrice: 20000, customerType: 'own' }, // margin 33.3% -> 15%
      { type: '현지', salePrice: 25000, costPrice: 12000, customerType: 'own' }, // margin 52% -> 18%
    ]
  },
    {
    employeeId: 'EMP-003',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 250000, costPrice: 0, customerType: 'own' },
      { type: '현지', salePrice: 10000, costPrice: 9500, customerType: 'transfer' }, // margin 5% -> 3% * 0.5
      { type: '현지', salePrice: 50000, costPrice: 30000, customerType: 'own' }, // margin 40% -> 18%
    ]
  }
];

export const employeeCustomerSales = [
    { id: '1', customerName: 'Tech Solutions Inc.', salesTarget: 15000, salesAmount: 15250 },
    { id: '2', customerName: 'Retail Goods Co.', salesTarget: 2000, salesAmount: 1200 },
    { id: '3', customerName: 'Innovatech', salesTarget: 18000, salesAmount: 18900 },
];
export type EmployeeCustomerSale = typeof employeeCustomerSales[0];

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
    '1': [
        { productName: 'Laptop Pro 15-inch', salesTarget: 10000, salesAmount: 12000 },
        { productName: '4K Monitor 27-inch', salesTarget: 5000, salesAmount: 3250 },
    ],
    '2': [
        { productName: 'Wireless Mouse', salesTarget: 1000, salesAmount: 800 },
        { productName: 'USB-C Hub', salesTarget: 1000, salesAmount: 400 },
    ],
    '3': [
        { productName: 'Laptop Pro 15-inch', salesTarget: 12000, salesAmount: 14400 },
        { productName: 'Mechanical Keyboard', salesTarget: 6000, salesAmount: 4500 },
    ]
};
export type CustomerProductSale = { productName: string; salesTarget: number; salesAmount: number };


export const cashSalesData: CashSale[] = [
  { id: 'CS-001', date: '2024-09-02', employeeName: 'Jane Smith', customerName: 'Cash Sale Customer 1', source: '현금 판매', amount: 350.00 },
  { id: 'CS-002', date: '2024-09-02', employeeName: 'Alex Ray', customerName: 'Creative Minds LLC', source: '신용 수금', amount: 1500.75 },
  { id: 'CS-003', date: '2024-09-03', employeeName: 'John Doe', customerName: 'Cash Sale Customer 2', source: '현금 판매', amount: 50.00 },
  { id: 'CS-004', date: '2024-09-10', employeeName: 'Jane Smith', customerName: 'Tech Solutions Inc.', source: '신용 수금', amount: 2500.00 },
  { id: 'CS-005', date: '2024-09-11', employeeName: 'Alex Ray', customerName: 'Cash Sale Customer 3', source: '현금 판매', amount: 820.50 },
];

export type CashSale = {
  id: string;
  date: string;
  employeeName: string;
  customerName: string;
  source: '현금 판매' | '신용 수금';
  amount: number;
};

export const checkPaymentsData: CheckPayment[] = [
    { id: 'CHK-01', receiptDate: '2024-09-05', dueDate: '2024-10-05', salesperson: 'Jane Smith', customerName: 'Tech Solutions Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: 'Chase', depositDate: '2024-09-06', status: 'Confirmed', notes: 'Partial payment for INV-001' },
    { id: 'CHK-02', receiptDate: '2024-09-08', dueDate: '2024-09-22', salesperson: 'Alex Ray', customerName: 'Creative Minds LLC', issuingBank: 'Wells Fargo', checkNumber: '54321', amount: 1500.75, depositBank: '', depositDate: '', status: 'Pending', notes: 'Full payment for INV-002' },
    { id: 'CHK-03', receiptDate: '2024-09-10', dueDate: '2024-09-15', salesperson: 'John Doe', customerName: 'Global Exports', issuingBank: 'Citibank', checkNumber: '67890', amount: 350, depositBank: 'Bank of America', depositDate: '2024-09-11', status: 'Rejected', notes: 'Insufficient funds' },
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

export const cumulativeReportData = [
  { month: '1월', target: 50000, actual: 48000, lastYear: 45000 },
  { month: '2월', target: 50000, actual: 51000, lastYear: 47000 },
  { month: '3월', target: 55000, actual: 56000, lastYear: 52000 },
  { month: '4월', target: 55000, actual: 54000, lastYear: 53000 },
  { month: '5월', target: 60000, actual: 62000, lastYear: 58000 },
  { month: '6월', target: 60000, actual: 65000, lastYear: 61000 },
  { month: '7월', target: 65000, actual: 68000, lastYear: 64000 },
  { month: '8월', target: 65000, actual: 66000, lastYear: 65000 },
  { month: '9월', target: 70000, actual: 75000, lastYear: 69000 },
  // Data for Oct, Nov, Dec would follow
];

export const monthlyDetailReportData: MonthlyDetail[] = [
    {
        month: '9월',
        details: [
            {
                customerName: 'Tech Solutions Inc.',
                products: [
                    { productName: 'Laptop Pro 15-inch', target: 12000, actual: 14400 },
                    { productName: '4K Monitor 27-inch', target: 5000, actual: 4800 },
                ]
            },
            {
                customerName: 'Global Exports',
                products: [
                    { productName: 'USB-C Hub', target: 3000, actual: 3200 },
                    { productName: 'Wireless Mouse', target: 1000, actual: 1500 },
                ]
            }
        ]
    },
    {
        month: '8월',
        details: [
             {
                customerName: 'Tech Solutions Inc.',
                products: [
                    { productName: 'Laptop Pro 15-inch', target: 10000, actual: 11000 },
                ]
            },
        ]
    }
];

export type MonthlyDetail = {
    month: string;
    details: Array<{
        customerName: string;
        products: Array<{
            productName: string;
            target: number;
            actual: number;
        }>;
    }>;
};

export const pastSalesDetails = {
    'C-101': { // Tech Solutions Inc.
        '2024-06': [
            { product: 'Laptop Pro 15-inch', quantity: 5, total: 6000 },
            { product: '4K Monitor 27-inch', quantity: 2, total: 900 }
        ],
        '2024-07': [
            { product: 'Laptop Pro 15-inch', quantity: 8, total: 9600 }
        ],
        '2024-08': [
            { product: 'Wireless Mouse', quantity: 20, total: 500 },
            { product: 'Mechanical Keyboard', quantity: 10, total: 1500 }
        ]
    },
    'C-102': { // Creative Minds LLC
        '2024-08': [
            { product: 'USB-C Hub', quantity: 15, total: 900 }
        ]
    },
     'C-103': { // Global Exports
        '2024-07': [
            { product: 'Laptop Pro 15-inch', quantity: 10, total: 12000 }
        ],
        '2024-08': [
            { product: '4K Monitor 27-inch', quantity: 5, total: 2250 }
        ]
    }
};

export type PastSales = {
    [customerCode: string]: {
        [yearMonth: string]: Array<{
            product: string;
            quantity: number;
            total: number;
        }>;
    };
};

    