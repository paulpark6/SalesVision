









export const overviewData = {
  totalRevenue: 45231.89,
  subscriptions: 2350,
  sales: 12234,
  activeNow: 573,
};

export const salesTargetData = {
  target: 50000,
  current: 45231.89,
  lastYear: 42100.5,
};

export const teamSalesTargetData = {
  target: 135000,
  current: 131000,
  lastYear: 125000,
};

export const salesTargetChartData = [
  { name: '9월', sales: 45231.89, target: 50000 },
];

export const salesComparisonData = [
    { name: '9월 누적 목표', jane: 45000, alex: 50000, john: 40000 },
    { name: '9월 누적 실적', jane: 38000, alex: 52000, john: 41000 },
    { name: '전년 동기 실적', jane: 35000, alex: 48000, john: 42000 },
];

export const cumulativeSalesTargetChartData = [
    { name: '당해년도', sales: 294000.5, target: 350000 },
    { name: '전년동기간', sales: 273653.25, target: 300000 },
];

export const teamCumulativeSalesTargetChartData = [
    { name: '팀 당해년도', sales: 851500, target: 945000 },
    { name: '팀 전년동기간', sales: 812500, target: 840000 },
];

export const cumulativeReportData = [
    { month: '1월', target: 35000, actual: 32000, lastYear: 30000 },
    { month: '2월', target: 35000, actual: 34000, lastYear: 31000 },
    { month: '3월', target: 38000, actual: 39000, lastYear: 35000 },
    { month: '4월', target: 38000, actual: 37000, lastYear: 36000 },
    { month: '5월', target: 40000, actual: 42000, lastYear: 38000 },
    { month: '6월', target: 40000, actual: 41000, lastYear: 39000 },
    { month: '7월', target: 42000, actual: 43000, lastYear: 40000 },
    { month: '8월', target: 42000, actual: 44000.50, lastYear: 41000 },
    { month: '9월', target: 45000, actual: 45231.89, lastYear: 42100.50 },
];


export type DuePayment = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  employee: string;
  amount: number;
  dueDate: string;
  status: 'due' | 'overdue' | 'nearing';
  collectionPlan?: string;
};

export const duePaymentsData: DuePayment[] = [
  {
    id: 'pay-1',
    customer: { name: 'Liam Johnson', email: 'liam@example.com' },
    employee: 'Jane Smith',
    amount: 250.0,
    dueDate: '2024-07-10', // Overdue
    status: 'overdue',
    collectionPlan: '이번 주 내 연락하여 8월 초까지 입금 요청 예정.',
  },
  {
    id: 'pay-2',
    customer: { name: 'Olivia Smith', email: 'olivia@example.com' },
    employee: 'Alex Ray',
    amount: 150.75,
    dueDate: '2024-08-05', // due in < 14 days
    status: 'due',
    collectionPlan: '만기일 전 알림 이메일 발송 완료.',
  },
  {
    id: 'pay-3',
    customer: { name: 'Noah Williams', email: 'noah@example.com' },
    employee: 'John Doe',
    amount: 350.0,
    dueDate: '2024-08-25', // nearing
    status: 'nearing',
  },
  {
    id: 'pay-4',
    customer: { name: 'Emma Brown', email: 'emma@example.com' },
    employee: 'Jane Smith',
    amount: 450.0,
    dueDate: '2024-08-01', // due or overdue depending on current date
    status: 'due',
  },
  {
    id: 'pay-5',
    customer: { name: 'Ava Jones', email: 'ava@example.com' },
    employee: 'Alex Ray',
    amount: 550.0,
    dueDate: '2024-08-28', // nearing
    status: 'nearing',
    collectionPlan: '다음 주 중으로 확인 전화 예정.',
  },
    {
    id: 'pay-6',
    customer: { name: 'James Wilson', email: 'james@example.com' },
    employee: 'John Doe',
    amount: 200.0,
    dueDate: '2024-07-15', // Overdue
    status: 'overdue',
  },
];


export type RecentSale = {
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  date: string;
};

export const recentSalesData: RecentSale[] = [
  {
    customer: { name: 'Olivia Martin', email: 'olivia.martin@email.com' },
    amount: 1999.0,
    date: '2024-08-01',
  },
  {
    customer: { name: 'Jackson Lee', email: 'jackson.lee@email.com' },
    amount: 39.0,
    date: '2024-08-01',
  },
  {
    customer: { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com' },
    amount: 299.0,
    date: '2024-07-31',
  },
  {
    customer: { name: 'William Kim', email: 'will@email.com' },
    amount: 99.0,
    date: '2024-07-30',
  },
  {
    customer: { name: 'Sofia Davis', email: 'sofia.davis@email.com' },
    amount: 39.0,
    date: '2024-07-30',
  },
];

export const salesTrendCsvData = `Date,Product Category,Product Code,Description,Customer Name,Customer Code,Customer Grade,Quantity,Price,Total Price,Payment Method,Employee Code,Invoice Number
2023-01-15,Electronics,E-001,Laptop,John Doe,C-101,A,2,1200,2400,Credit,EMP-01,INV-1001
2023-01-20,Clothing,C-005,T-Shirt,Jane Smith,C-102,B,5,25,125,Cash,EMP-02,
2023-02-10,Electronics,E-002,Smartphone,John Doe,C-101,A,1,800,800,Credit,EMP-01,INV-1002
2023-03-05,Books,B-010,Science Fiction Novel,Peter Jones,C-103,C,3,15,45,Cash,EMP-03,
2023-04-12,Clothing,C-008,Jeans,Jane Smith,C-102,B,2,75,150,Credit,EMP-02,INV-1003
2023-05-25,Electronics,E-001,Laptop,Alice Williams,C-104,A,1,1250,1250,Prepayment,EMP-01,INV-1004
2023-06-18,Home Goods,H-003,Coffee Maker,John Doe,C-101,A,1,100,100,Check,EMP-01,
2023-07-22,Clothing,C-005,T-Shirt,Peter Jones,C-103,C,10,20,200,Cash,EMP-03,
2023-08-30,Electronics,E-003,Tablet,Jane Smith,C-102,B,1,450,450,Credit,EMP-02,INV-1005
2023-09-14,Books,B-012,Cookbook,Alice Williams,C-104,A,2,30,60,Cash,EMP-01,
2023-11-01,Clothing,C-015,Winter Jacket,John Doe,C-101,A,1,200,200,Credit,EMP-01,INV-1006
2023-12-20,Electronics,E-004,Gaming Console,Jane Smith,C-102,B,1,500,500,Credit,EMP-02,INV-1007
`;

export const productUploadCsvData = `Category,Code,Description,ImportPrice,LocalPurchasePrice
Electronics,e-001,Laptop,1200,1150
Electronics,e-002,Smartphone,800,780
Clothing,c-005,T-Shirt,25,22
`;

export const importUploadCsvData = `Date,Supplier,Product Category,Product Code,Product Description,Quantity,Unit Price (Import)
2024-08-01,Overseas Supplier Co.,Electronics,e-001,Laptop,50,850
2024-08-01,Global Tech Inc.,Electronics,e-002,Smartphone,100,600
2024-08-02,Fashion Forward,Clothing,c-008,Jeans,200,45
`;

export const customerUploadCsvData = `CustomerName,CustomerCode,Employee,Grade
Tech Solutions,C-201,manager,A
Retail Giant,C-202,employee,B
Local Biz,C-203,employee,C
`;

const getLatestPrice = (history: { date: string; price: number }[]) => {
    if (!history || history.length === 0) return 0;
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].price;
};

export const products = [
    { value: 'e-001', label: 'Laptop', priceHistory: [{ date: '2023-01-15', price: 1200 }, { date: '2023-05-25', price: 1250 }] },
    { value: 'e-002', label: 'Smartphone', priceHistory: [{ date: '2023-02-10', price: 800 }] },
    { value: 'e-003', label: 'Tablet', priceHistory: [{ date: '2023-08-30', price: 450 }] },
    { value: 'e-004', label: 'Gaming Console', priceHistory: [{ date: '2023-12-20', price: 500 }] },
    { value: 'c-005', label: 'T-Shirt', priceHistory: [{ date: '2023-01-20', price: 25 }, { date: '2023-07-22', price: 20 }] },
    { value: 'c-008', label: 'Jeans', priceHistory: [{ date: '2023-04-12', price: 75 }] },
    { value: 'c-015', label: 'Winter Jacket', priceHistory: [{ date: '2023-11-01', price: 200 }] },
    { value: 'b-010', label: 'Science Fiction Novel', priceHistory: [{ date: '2023-03-05', price: 15 }] },
    { value: 'b-012', label: 'Cookbook', priceHistory: [{ date: '2023-09-14', price: 30 }] },
    { value: 'h-003', label: 'Coffee Maker', priceHistory: [{ date: '2023-06-18', price: 100 }] },
].map(p => ({ ...p, basePrice: getLatestPrice(p.priceHistory) }));


export const customers = [
    { value: 'c-101', label: 'John Doe', grade: 'A' },
    { value: 'c-102', label: 'Jane Smith', grade: 'B' },
    { value: 'c-103', label: 'Peter Jones', grade: 'C' },
    { value: 'c-104', label: 'Alice Williams', grade: 'A' },
    { value: 'c-105', label: 'Michael Brown', grade: 'B' },
];

export const employees = [
    { value: 'admin', label: 'John Doe (Admin)', role: 'admin', name: 'John Doe' },
    { value: 'manager', label: 'Alex Ray (Manager)', role: 'manager', name: 'Alex Ray' },
    { value: 'employee', label: 'Jane Smith (Employee)', role: 'employee', name: 'Jane Smith' },
];

export type EmployeeCustomerSale = {
  id: string;
  customerName: string;
  salesTarget: number;
  salesAmount: number;
};

export const employeeCustomerSales: EmployeeCustomerSale[] = [
  { id: 'cus-1', customerName: 'John Doe', salesTarget: 10000, salesAmount: 12500 },
  { id: 'cus-2', customerName: 'Jane Smith', salesTarget: 8000, salesAmount: 7500 },
  { id: 'cus-3', customerName: 'Alice Williams', salesTarget: 5000, salesAmount: 6000 },
  { id: 'cus-4', customerName: 'Peter Jones', salesTarget: 3000, salesAmount: 2000 },
  { id: 'cus-5', customerName: 'Michael Brown', salesTarget: 15000, salesAmount: 17231.89 },
];

export type CustomerProductSale = {
  productName: string;
  salesTarget: number;
  salesAmount: number;
};

export const customerProductSalesDetails: Record<string, CustomerProductSale[]> = {
  'cus-1': [
    { productName: 'Laptop', salesTarget: 8000, salesAmount: 9600 },
    { productName: 'Smartphone', salesTarget: 2000, salesAmount: 2100 },
    { productName: 'Coffee Maker', salesTarget: 0, salesAmount: 800 },
  ],
  'cus-2': [
    { productName: 'T-Shirt', salesTarget: 3000, salesAmount: 2500 },
    { productName: 'Jeans', salesTarget: 4000, salesAmount: 4000 },
    { productName: 'Tablet', salesTarget: 1000, salesAmount: 1000 },
  ],
  'cus-3': [
    { productName: 'Laptop', salesTarget: 5000, salesAmount: 6000 },
  ],
  'cus-4': [
     { productName: 'Science Fiction Novel', salesTarget: 2500, salesAmount: 1500 },
     { productName: 'T-Shirt', salesTarget: 500, salesAmount: 500 },
  ],
  'cus-5': [
      { productName: 'Gaming Console', salesTarget: 10000, salesAmount: 12231.89 },
      { productName: 'Winter Jacket', salesTarget: 5000, salesAmount: 5000 },
  ],
};

type MonthlySale = { month: number; actual: number; average: number };
type YearlySale = { year: number; amount: number };

export type Customer = {
  employee: string;
  customerName: string;
  customerCode: string;
  customerGrade: string;
  customerType: 'own' | 'transfer' | 'pending';
  monthlySales: MonthlySale[];
  yearlySales: YearlySale[];
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
    customerName: 'Liam Johnson',
    customerCode: 'C-106',
    customerGrade: 'B',
    customerType: 'own',
    monthlySales: [
        { month: 8, actual: 2450.50, average: 2350.00 },
        { month: 9, actual: 2600.00, average: 2400.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 28340.75 },
        { year: 2024, amount: 15400.25 },
    ],
    creditBalance: 250.00,
    contact: {
      name: 'Liam Johnson',
      position: 'Purchasing Manager',
      phone: '123-456-7890',
      address: '123 Main St, Anytown, USA',
      email: 'liam.j@example.com'
    },
    companyOverview: 'A mid-sized manufacturing company specializing in custom parts.'
  },
  {
    employee: 'Jane Smith',
    customerName: 'Emma Brown',
    customerCode: 'C-107',
    customerGrade: 'A',
    customerType: 'transfer',
    monthlySales: [
        { month: 8, actual: 5890.00, average: 5500.00 },
        { month: 9, actual: 6100.00, average: 5600.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 61230.00 },
        { year: 2024, amount: 32100.00 },
    ],
    creditBalance: 450.00,
    contact: {
      name: 'Emma Brown',
      position: 'Senior Buyer',
      phone: '234-567-8901',
      address: '456 Oak Ave, Anytown, USA',
      email: null
    },
    companyOverview: 'A large retail chain with stores across the country.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Olivia Smith',
    customerCode: 'C-108',
    customerGrade: 'B',
    customerType: 'own',
    monthlySales: [
        { month: 8, actual: 1530.25, average: 1600.00 },
        { month: 9, actual: 1700.00, average: 1650.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 18450.50 },
        { year: 2024, amount: 9800.75 },
    ],
    creditBalance: 150.75,
    contact: {
      name: 'Olivia Smith',
      position: 'Owner',
      phone: '345-678-9012',
      address: '789 Pine Rd, Anytown, USA',
      email: 'olivia.s@example.com'
    },
    companyOverview: 'A local boutique specializing in handcrafted goods.'
  },
  {
    employee: 'Alex Ray',
    customerName: 'Ava Jones',
    customerCode: 'C-109',
    customerGrade: 'C',
    customerType: 'transfer',
    monthlySales: [
        { month: 8, actual: 780.00, average: 820.00 },
        { month: 9, actual: 810.00, average: 815.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 9870.00 },
        { year: 2024, amount: 5400.00 },
    ],
    creditBalance: 550.00,
    contact: {
      name: 'Ava Jones',
      position: 'Store Manager',
      phone: '456-789-0123',
      address: '101 Maple St, Anytown, USA',
      email: null
    },
    companyOverview: 'A small business focused on eco-friendly products.'
  },
  {
    employee: 'John Doe',
    customerName: 'Noah Williams',
    customerCode: 'C-110',
    customerGrade: 'A',
    customerType: 'pending',
    monthlySales: [
        { month: 8, actual: 8940.00, average: 8500.00 },
        { month: 9, actual: 9200.00, average: 8600.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 95040.00 },
        { year: 2024, amount: 51200.00 },
    ],
    creditBalance: 350.00,
    contact: {
      name: 'Noah Williams',
      position: 'CEO',
      phone: '567-890-1234',
      address: '212 Birch Ln, Anytown, USA',
      email: 'noah.w@example.com'
    },
    companyOverview: 'A rapidly growing tech startup.'
  },
    {
    employee: 'John Doe',
    customerName: 'James Wilson',
    customerCode: 'C-111',
    customerGrade: 'C',
    customerType: 'own',
    monthlySales: [
        { month: 8, actual: 950.00, average: 900.00 },
        { month: 9, actual: 1000.00, average: 925.00 },
    ],
    yearlySales: [
        { year: 2023, amount: 11200.00 },
        { year: 2024, amount: 6100.00 },
    ],
    creditBalance: 200.00,
    contact: {
      name: 'James Wilson',
      position: 'Operations Manager',
      phone: '678-901-2345',
      address: '333 Cedar Blvd, Anytown, USA',
      email: null
    },
    companyOverview: 'A logistics and transportation company.'
  },
];

// Commission data includes sales records for commission calculation.
// '수입' (Imported) products are registered by Admins. '현지' (Local) products are registered by Managers.
// 'customerType' determines if the commission rules for 'own' or 'transfer' customers apply.
export const commissionData = [
  {
    employeeId: 'emp-01',
    employeeName: 'Jane Smith',
    sales: [
      { type: '수입', salePrice: 210000, costPrice: 150000, customerType: 'own' },
      { type: '현지', salePrice: 5000, costPrice: 4600, customerType: 'own' }, // Margin 8%
      { type: '현지', salePrice: 10000, costPrice: 8500, customerType: 'own' }, // Margin 15%
      { type: '수입', salePrice: 50000, costPrice: 30000, customerType: 'transfer' }, // 1% commission
      { type: '현지', salePrice: 20000, costPrice: 16000, customerType: 'transfer' }, // Margin 20% -> 12% rate * 50%
    ],
  },
  {
    employeeId: 'emp-02',
    employeeName: 'Alex Ray',
    sales: [
      { type: '수입', salePrice: 180000, costPrice: 120000, customerType: 'own' },
      { type: '현지', salePrice: 20000, costPrice: 15000, customerType: 'own' }, // Margin 25%
      { type: '현지', salePrice: 15000, costPrice: 10000, customerType: 'own' }, // Margin 33.3%
    ],
  },
  {
    employeeId: 'emp-03',
    employeeName: 'John Doe',
    sales: [
      { type: '수입', salePrice: 50000, costPrice: 30000, customerType: 'own' },
      { type: '현지', salePrice: 30000, costPrice: 15000, customerType: 'own' }, // Margin 50%
      { type: '현지', salePrice: 100000, costPrice: 95000, customerType: 'transfer' }, // Margin 5% -> 3% rate * 50%
    ],
  },
];


export const salesTargetHistoryData = [
    { 
        customerCode: 'C-106', 
        customerName: 'Liam Johnson', 
        monthlySales: [
            { month: '6월', amount: 2250.00, products: ['Laptop'] },
            { month: '7월', amount: 2300.00, products: ['Laptop', 'T-Shirt'] },
            { month: '8월', amount: 2450.50, products: ['Smartphone'] }
        ],
        nextMonthTarget: [ // September targets
            { productName: 'Laptop', targetAmount: 2000 },
            { productName: 'T-Shirt', targetAmount: 500 },
        ]
    },
    { 
        customerCode: 'C-107', 
        customerName: 'Emma Brown', 
        monthlySales: [
            { month: '6월', amount: 5200.00, products: ['Jeans'] },
            { month: '7월', amount: 5400.00, products: ['Jeans', 'Winter Jacket'] },
            { month: '8월', amount: 5890.00, products: ['Jeans', 'T-Shirt', 'Cookbook'] }
        ],
        nextMonthTarget: [ // September targets
            { productName: 'Jeans', targetAmount: 4000 },
            { productName: 'Gaming Console', targetAmount: 2500 },
        ]
    },
    { 
        customerCode: 'C-108', 
        customerName: 'Olivia Smith', 
        monthlySales: [
            { month: '6월', amount: 1450.00, products: [] },
            { month: '7월', amount: 1500.00, products: ['Tablet'] },
            { month: '8월', amount: 1530.25, products: ['Tablet', 'T-Shirt'] }
        ],
        nextMonthTarget: [ // September targets
            { productName: 'Tablet', targetAmount: 1800 }
        ]
    },
    {
        customerCode: 'C-205',
        customerName: 'New Customer Inc.',
        monthlySales: [
            { month: '6월', amount: 0, products: [] },
            { month: '7월', amount: 0, products: [] },
            { month: '8월', amount: 0, products: [] }
        ],
        nextMonthTarget: [ // September targets
            { productName: 'Initial Product', targetAmount: 5000 }
        ]
    }
];

export const salesReportData = [
    { employeeName: 'Jane Smith', customerName: 'Liam Johnson', customerCode: 'C-106', target: 2500, actual: 2600.00 },
    { employeeName: 'Jane Smith', customerName: 'Emma Brown', customerCode: 'C-107', target: 6500, actual: 6100.00 },
    { employeeName: 'Alex Ray', customerName: 'Olivia Smith', customerCode: 'C-108', target: 1800, actual: 1700.00 },
    { employeeName: 'Alex Ray', customerName: 'Ava Jones', customerCode: 'C-109', target: 1000, actual: 810.00 },
    { employeeName: 'John Doe', customerName: 'Noah Williams', customerCode: 'C-110', target: 9000, actual: 9200.00 },
    { employeeName: 'John Doe', customerName: 'James Wilson', customerCode: 'C-111', target: 1000, actual: 1000.00 },
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
                customerName: 'Liam Johnson',
                products: [
                    { productName: 'Laptop', target: 2000, actual: 2100 },
                    { productName: 'T-Shirt', target: 500, actual: 500 },
                ],
            },
            {
                customerName: 'Emma Brown',
                products: [
                    { productName: 'Jeans', target: 4000, actual: 3800 },
                    { productName: 'Gaming Console', target: 2500, actual: 2300 },
                ],
            },
            {
                customerName: 'Noah Williams',
                products: [
                    { productName: 'Smartphone', target: 9000, actual: 9200 },
                ],
            },
        ],
    },
    // Add more months as needed
    {
        month: '8월',
        details: [
            {
                customerName: 'Liam Johnson',
                products: [
                    { productName: 'Smartphone', target: 2500, actual: 2450.50 },
                ],
            },
            {
                customerName: 'Emma Brown',
                products: [
                    { productName: 'Jeans', target: 3000, actual: 3200 },
                    { productName: 'T-Shirt', target: 1000, actual: 1200 },
                    { productName: 'Cookbook', target: 1500, actual: 1490 },
                ],
            },
        ],
    },
];



const calculateTotalTarget = (data: typeof salesTargetHistoryData) => {
    return data.reduce((total, customer) => {
        const customerTotal = customer.nextMonthTarget.reduce((sum, product) => sum + product.targetAmount, 0);
        return total + customerTotal;
    }, 0);
};

const calculateCurrentSales = (data: typeof salesTargetHistoryData) => {
    // This is now a bit of a misnomer, as we don't have September sales yet.
    // For demonstration, let's use August sales as a placeholder for "current".
    // In a real app, you'd fetch actual September sales data.
    return 45231.89; // Keeping a static value for consistency with dashboard cards
};

export const monthlySalesData = {
    target: calculateTotalTarget(salesTargetHistoryData),
    current: calculateCurrentSales(salesTargetHistoryData),
};
