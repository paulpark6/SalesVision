import type { SidebarMenuItemProps, SidebarMenuSubButtonProps } from "@/components/ui/sidebar";

export const salesTrendCsvData = `Date,Product,Category,Price,Quantity,Total
2023-01-15,Laptop,Electronics,1200,10,12000
2023-01-17,Smartphone,Electronics,800,15,12000
2023-01-20,Headphones,Accessories,150,30,4500
2023-02-10,Laptop,Electronics,1200,12,14400
2023-02-12,Keyboard,Accessories,75,50,3750
2023-03-18,Smartphone,Electronics,850,20,17000
2023-03-22,Laptop,Electronics,1250,8,10000
2023-04-05,Mouse,Accessories,25,100,2500
2023-04-09,Headphones,Accessories,160,25,4000
2023-05-15,Laptop,Electronics,1150,15,17250
2023-05-20,Smartphone,Electronics,820,18,14760
2023-06-11,Webcam,Accessories,85,40,3400
2023-06-25,Laptop,Electronics,1300,10,13000
2023-07-13,Smartphone,Electronics,880,22,19360
2023-07-21,Keyboard,Accessories,80,45,3600
2023-08-10,Laptop,Electronics,1220,14,17080
2023-08-19,Mouse,Accessories,30,80,2400`;

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

export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  current: 41250,
  target: 50000,
}

export const salesTargetChartData = [
    { name: 'Jan', sales: 4000, target: 5000 },
    { name: 'Feb', sales: 3000, target: 4000 },
    { name: 'Mar', sales: 5000, target: 6000 },
    { name: 'Apr', sales: 4500, target: 5500 },
    { name: 'May', sales: 6000, target: 7000 },
    { name: 'Jun', sales: 5500, target: 6500 },
    { name: 'Jul', sales: 7000, target: 8000 },
    { name: 'Aug', sales: 6500, target: 7500 },
    { name: 'Sep', sales: 8000, target: 9000 },
]

export const duePaymentsData: DuePayment[] = [
  {
    id: 'INV-001',
    customer: { name: 'Acme Inc.', email: 'contact@acme.com' },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2023-10-15',
    amount: 2500.0,
    collectionPlan: 'Follow up on 10/10'
  },
  {
    id: 'INV-002',
    customer: { name: 'Stark Industries', email: 'tony@stark.com' },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2023-09-28',
    amount: 450.75,
    collectionPlan: ''
  },
  {
    id: 'INV-003',
    customer: { name: 'Wayne Enterprises', email: 'bruce@wayne.com' },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: '2024-08-20',
    amount: 1200.0,
    collectionPlan: ''
  },
  {
    id: 'INV-004',
    customer: { name: 'Ollivanders Wand Shop', email: 'ollivander@wands.co.uk' },
    employee: 'Jane Smith',
    employeeId: 'jane-smith',
    dueDate: '2023-01-05',
    amount: 800.0,
    collectionPlan: 'Customer unresponsive. Manager notified.'
  },
  {
    id: 'INV-005',
    customer: { name: 'Gringotts Bank', email: 'accounts@gringotts.wiz' },
    employee: 'John Doe',
    employeeId: 'john-doe',
    dueDate: '2024-09-10',
    amount: 5000.0,
    collectionPlan: ''
  },
  {
    id: 'INV-006',
    customer: { name: 'Cyberdyne Systems', email: 'info@cyberdyne.com' },
    employee: 'Alex Ray',
    employeeId: 'alex-ray',
    dueDate: '1997-08-29',
    amount: 150000.0,
    collectionPlan: 'Considered unrecoverable.'
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

export const salesComparisonData = [
  { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
  { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
  { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const products = [
    { value: 'p-001', label: '15" Laptop', basePrice: 1200.00 },
    { value: 'p-002', label: 'Wireless Mouse', basePrice: 25.00 },
    { value: 'p-003', label: 'Mechanical Keyboard', basePrice: 150.00 },
    { value: 'p-004', label: '27" 4K Monitor', basePrice: 450.00 },
    { value: 'p-005', label: 'Docking Station', basePrice: 250.00 },
    { value: 'p-006', label: 'Webcam', basePrice: 85.00 },
];

export const customers = [
    { value: 'c-101', label: 'Acme Inc.', grade: 'A' },
    { value: 'c-102', label: 'Stark Industries', grade: 'B' },
    { value: 'c-103', label: 'Wayne Enterprises', grade: 'A' },
    { value: 'c-104', label: 'Cyberdyne Systems', grade: 'C' },
    { value: 'c-105', label: 'Gringotts Bank', grade: 'B' },
];

export const employees = [
    { value: 'john-doe', label: 'John Doe', name: 'John Doe', role: 'admin', manager: null },
    { value: 'alex-ray', label: 'Alex Ray', name: 'Alex Ray', role: 'manager', manager: 'john-doe' },
    { value: 'jane-smith', label: 'Jane Smith', name: 'Jane Smith', role: 'employee', manager: 'alex-ray' },
];

export const salesReportData = [
  {
    employeeName: "Jane Smith",
    customerName: "Acme Inc.",
    customerCode: "C-101",
    target: 5000,
    actual: 5500,
  },
  {
    employeeName: "Jane Smith",
    customerName: "Stark Industries",
    customerCode: "C-102",
    target: 8000,
    actual: 7500,
  },
  {
    employeeName: "Alex Ray",
    customerName: "Wayne Enterprises",
    customerCode: "C-103",
    target: 12000,
    actual: 13000,
  },
  {
    employeeName: "Alex Ray",
    customerName: "Cyberdyne Systems",
    customerCode: "C-104",
    target: 3000,
    actual: 2500,
  },
  {
    employeeName: "John Doe",
    customerName: "Gringotts Bank",
    customerCode: "C-105",
    target: 10000,
    actual: 11000,
  },
   {
    employeeName: "Jane Smith",
    customerName: "Ollivanders Wand Shop",
    customerCode: "C-106",
    target: 1500,
    actual: 1800,
  },
];

export const cumulativeReportData = [
    { month: '1월', target: 20000, actual: 18000, lastYear: 17000 },
    { month: '2월', target: 22000, actual: 23000, lastYear: 20000 },
    { month: '3월', target: 25000, actual: 26000, lastYear: 24000 },
    { month: '4월', target: 24000, actual: 23500, lastYear: 22000 },
    { month: '5월', target: 28000, actual: 29000, lastYear: 27000 },
    { month: '6월', target: 27000, actual: 28000, lastYear: 26000 },
    { month: '7월', target: 30000, actual: 31000, lastYear: 29000 },
    { month: '8월', target: 32000, actual: 31500, lastYear: 30000 },
    { month: '9월', target: 35000, actual: 38000, lastYear: 33000 },
    { month: '10월', target: 33000, actual: 0, lastYear: 31000 },
    { month: '11월', target: 38000, actual: 0, lastYear: 36000 },
    { month: '12월', target: 40000, actual: 0, lastYear: 38000 },
];

export type ProductTarget = {
    categoryCode: string;
    categoryName: string;
    productCode: string;
    productName: string;
    pastSales: { [month: number]: number };
    monthlyTarget: { [month: number]: number };
    monthlyActual: { [month: number]: number };
};

export type CustomerTarget = {
    customerCode: string;
    customerName: string;
    employeeId: string;
    products: ProductTarget[];
};

export const salesTargetManagementData: CustomerTarget[] = [
    {
        customerCode: 'C-101',
        customerName: 'Acme Inc.',
        employeeId: 'jane-smith',
        products: [
            { 
                categoryCode: 'electronics', 
                categoryName: 'Electronics', 
                productCode: 'P-001', 
                productName: '15" Laptop', 
                pastSales: { 6: 2400, 7: 3600, 8: 3000 },
                monthlyTarget: { 9: 3500 }, 
                monthlyActual: { 9: 3800 } 
            },
            { 
                categoryCode: 'accessories', 
                categoryName: 'Accessories', 
                productCode: 'P-002', 
                productName: 'Wireless Mouse', 
                pastSales: { 6: 100, 7: 150, 8: 120 },
                monthlyTarget: { 9: 200 }, 
                monthlyActual: { 9: 180 } 
            },
        ]
    },
    {
        customerCode: 'C-102',
        customerName: 'Stark Industries',
        employeeId: 'jane-smith',
        products: [
            { 
                categoryCode: 'electronics', 
                categoryName: 'Electronics', 
                productCode: 'P-004', 
                productName: '27" 4K Monitor', 
                pastSales: { 6: 4500, 7: 5400, 8: 4800 },
                monthlyTarget: { 9: 6000 }, 
                monthlyActual: { 9: 5500 } 
            },
        ]
    },
    {
        customerCode: 'C-103',
        customerName: 'Wayne Enterprises',
        employeeId: 'alex-ray',
        products: [
            { 
                categoryCode: 'electronics', 
                categoryName: 'Electronics', 
                productCode: 'P-005', 
                productName: 'Docking Station', 
                pastSales: { 6: 2500, 7: 3000, 8: 2800 },
                monthlyTarget: { 9: 3200 }, 
                monthlyActual: { 9: 3400 } 
            },
        ]
    },
];

export const employeeCustomerSales = [
  { id: 1, customerName: 'Acme Inc.', salesTarget: 15000, salesAmount: 16500 },
  { id: 2, customerName: 'Stark Industries', salesTarget: 20000, salesAmount: 18200 },
  { id: 3, customerName: 'Ollivanders Wand Shop', salesTarget: 10000, salesAmount: 12300 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};

export const customerProductSalesDetails: { [key: number]: CustomerProductSale[] } = {
  1: [
    { productName: '15" Laptop', salesTarget: 10000, salesAmount: 11000 },
    { productName: 'Wireless Mouse', salesTarget: 5000, salesAmount: 5500 },
  ],
  2: [
    { productName: '27" 4K Monitor', salesTarget: 15000, salesAmount: 14000 },
    { productName: 'Mechanical Keyboard', salesTarget: 5000, salesAmount: 4200 },
  ],
  3: [
    { productName: 'Docking Station', salesTarget: 8000, salesAmount: 9000 },
    { productName: 'Webcam', salesTarget: 2000, salesAmount: 3300 },
  ],
};

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
        month: '9월', 
        details: [
            { 
                customerName: 'Acme Inc.',
                products: [
                    { productName: '15" Laptop', target: 10000, actual: 11000 },
                    { productName: 'Wireless Mouse', target: 500, actual: 600 },
                ]
            },
            { 
                customerName: 'Stark Industries',
                products: [
                    { productName: '27" 4K Monitor', target: 15000, actual: 14000 },
                    { productName: 'Mechanical Keyboard', target: 1000, actual: 800 },
                ]
            },
             { 
                customerName: 'Wayne Enterprises',
                products: [
                    { productName: 'Docking Station', target: 3000, actual: 3500 },
                ]
            }
        ]
    },
    // Add data for other months as needed
];


export const commissionData = [
  {
    employeeId: 'EMP-001',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 150000, costPrice: 0, customerType: 'own' as 'own' | 'transfer' },
      { type: '수입' as '수입' | '현지', salePrice: 80000, costPrice: 0, customerType: 'transfer' as 'own' | 'transfer' },
      { type: '현지' as '수입' | '현지', salePrice: 5000, costPrice: 4000, customerType: 'own' as 'own' | 'transfer' }, // margin 20% -> 12%
      { type: '현지' as '수입' | '현지', salePrice: 2000, costPrice: 1500, customerType: 'transfer' as 'own' | 'transfer' }, // margin 25% -> 12% * 0.5
    ],
  },
  {
    employeeId: 'EMP-002',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입' as '수입' | '현지', salePrice: 250000, costPrice: 0, customerType: 'own' as 'own' | 'transfer' }, // 200k @ 5%, 50k @ 3%
      { type: '현지' as '수입' | '현지', salePrice: 10000, costPrice: 5000, customerType: 'own' as 'own' | 'transfer' }, // margin 50% -> 18%
    ],
  },
];

export const cashSalesData: CashSale[] = [
    { id: 'CS001', date: '2023-09-01', employeeName: 'Jane Smith', customerName: 'Acme Inc.', source: '현금 판매', amount: 500 },
    { id: 'CS002', date: '2023-09-01', employeeName: 'Alex Ray', customerName: 'Stark Industries', source: '신용 수금', amount: 1200 },
    { id: 'CS003', date: '2023-09-02', employeeName: 'Jane Smith', customerName: 'Local Shop', source: '현금 판매', amount: 350 },
    { id: 'CS004', date: '2023-09-08', employeeName: 'John Doe', customerName: 'Wayne Enterprises', source: '신용 수금', amount: 2000 },
    { id: 'CS005', date: '2023-09-08', employeeName: 'Alex Ray', customerName: 'Cyberdyne', source: '현금 판매', amount: 800 },
    { id: 'CS006', date: '2023-09-09', employeeName: 'Jane Smith', customerName: 'Acme Inc.', source: '신용 수금', amount: 1000 },
    { id: 'CS007', date: '2023-08-28', employeeName: 'Jane Smith', customerName: 'Gringotts', source: '현금 판매', amount: 750 },
];
export type CashSale = {
    id: string;
    date: string;
    employeeName: string;
    customerName: string;
    source: '현금 판매' | '신용 수금';
    amount: number;
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
    depositBank?: string;
    depositDate?: string;
    status: CheckStatus;
    notes?: string;
};

export const checkPaymentsData: CheckPayment[] = [
    { id: 'CHK001', receiptDate: '2023-09-01', dueDate: '2023-10-01', salesperson: 'Jane Smith', customerName: 'Acme Inc.', issuingBank: 'Bank of America', checkNumber: '12345', amount: 5000, depositBank: '', depositDate: '', status: 'Pending', notes: '' },
    { id: 'CHK002', receiptDate: '2023-09-03', dueDate: '2023-09-18', salesperson: 'Alex Ray', customerName: 'Stark Industries', issuingBank: 'Chase', checkNumber: '67890', amount: 12500, depositBank: 'Wells Fargo', depositDate: '2023-09-05', status: 'Confirmed', notes: '' },
    { id: 'CHK003', receiptDate: '2023-09-05', dueDate: '2023-11-05', salesperson: 'Jane Smith', customerName: 'Wayne Enterprises', issuingBank: 'Citibank', checkNumber: '54321', amount: 8200, depositBank: '', depositDate: '', status: 'Pending', notes: 'Customer has post-dated' },
    { id: 'CHK004', receiptDate: '2023-08-20', dueDate: '2023-09-20', salesperson: 'John Doe', customerName: 'Gringotts Bank', issuingBank: 'Wizarding Bank', checkNumber: '98765', amount: 25000, depositBank: 'Bank of America', depositDate: '2023-08-22', status: 'Rejected', notes: 'Bounced. Penalty applied.' },
];

export const productUploadCsvData = `Category,Product Code,Description,Import Price,Local Purchase Price
Electronics,E-001,15" Laptop,1100,1150
Electronics,E-002,27" 4K Monitor,400,420
Accessories,A-001,Wireless Mouse,20,22
Accessories,A-002,Mechanical Keyboard,130,140
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price
2023-10-01,Global Imports,Electronics,E-001,15" Laptop,50,1100
2023-10-01,Tech Suppliers,Accessories,A-001,Wireless Mouse,200,20
`;


export const customerData = [
    {
        employee: 'Jane Smith',
        employeeId: 'jane-smith',
        customerName: 'Acme Inc.',
        customerCode: 'A0001',
        customerGrade: 'A',
        customerType: 'own' as 'own' | 'transfer' | 'pending',
        monthlySales: [
            { month: 9, actual: 5500, average: 5200 },
            { month: 8, actual: 5100, average: 5150 },
        ],
        yearlySales: [
            { year: 2023, amount: 45000 },
            { year: 2022, amount: 42000 },
        ],
        creditBalance: 15230.50,
        contact: {
            name: 'W. E. Coyote',
            position: 'Chief Buyer',
            phone: '123-456-7890',
            address: '123 Desert Rd, AZ',
            email: 'coyote@acme.com',
        },
        companyOverview: 'A leading manufacturer of elaborate contraptions and devices. Frequent purchaser of high-end electronics and industrial components. Known for ambitious projects and a high budget, but sometimes experiences cash flow issues related to said projects.'
    },
    {
        employee: 'Alex Ray',
        employeeId: 'alex-ray',
        customerName: 'Stark Industries',
        customerCode: 'B0001',
        customerGrade: 'A',
        customerType: 'transfer' as 'own' | 'transfer' | 'pending',
        monthlySales: [
            { month: 9, actual: 8200, average: 8000 },
        ],
        yearlySales: [
            { year: 2023, amount: 75000 },
        ],
        creditBalance: 32000.00,
        contact: {
            name: 'Pepper Potts',
            position: 'CEO',
            phone: '987-654-3210',
            address: '10880 Malibu Point, CA',
            email: 'pepper.potts@starkind.com',
        },
        companyOverview: 'Global leader in technology, defense, and clean energy. Requires cutting-edge components and custom solutions. High volume, high value client with a strong payment history.'
    },
     {
        employee: 'John Doe',
        employeeId: 'john-doe',
        customerName: 'Wayne Enterprises',
        customerCode: 'C0001',
        customerGrade: 'B',
        customerType: 'pending' as 'own' | 'transfer' | 'pending',
        monthlySales: [],
        yearlySales: [],
        creditBalance: 0,
        contact: {
            name: 'Lucius Fox',
            position: 'CEO',
            phone: '555-0100',
            address: '1007 Mountain Drive, Gotham',
            email: null,
        },
        companyOverview: 'A multinational conglomerate with diverse holdings in technology, shipping, and research. Currently pending final approval for their account.'
    }
];

export const customerUploadCsvData = `Employee,CustomerName,CustomerCode,Grade
jane-smith,Globex Corporation,A0002,A
alex-ray,Soylent Corp,B0002,C
`;
