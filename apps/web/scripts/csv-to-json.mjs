import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import papa from 'papaparse';

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function readCsv(csvPath) {
  const csvAbs = path.resolve(process.cwd(), csvPath);
  const csv = await readFile(csvAbs, 'utf8');
  const parsed = papa.parse(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) {
    // Only fail on critical errors, not delimiter detection
    const criticalErrors = parsed.errors.filter(e => e.code !== 'UndetectableDelimiter');
    if (criticalErrors.length) {
      console.error(`CSV parse error in ${csvPath}:`, criticalErrors[0]);
      process.exitCode = 1;
      return [];
    }
  }
  return parsed.data;
}

async function csvToJsonFile(csvPath, jsonPath, rowMap) {
  const rows = await readCsv(csvPath);
  const data = rows.map((row) => rowMap(row));
  const jsonAbs = path.resolve(process.cwd(), jsonPath);
  await ensureDir(path.dirname(jsonAbs));
  await writeFile(jsonAbs, JSON.stringify(data, null, 2) + '\n');
  console.log(`Wrote ${data.length} records -> ${jsonPath}`);
}

async function main() {
  const root = path.join('..', '..');  // Go up 2 levels from apps/web to project root
  const csvRoot = (...p) => path.join(root, 'db', 'csv', ...p);
  const uiRoot = (...p) => path.join(root, 'db', 'ui', ...p);

  // Dashboard
  // overview
  {
    const rows = await readCsv(csvRoot('dashboard', 'overview.csv'));
    const [row] = rows;
    const json = { totalRevenue: Number(row?.totalRevenue) || 0 };
    const out = uiRoot('dashboard', 'overview.json');
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify(json, null, 2) + '\n');
    console.log(`Wrote overview -> ${out}`);
  }
  // sales-target
  {
    const [row] = await readCsv(csvRoot('dashboard', 'sales-target.csv'));
    const json = {
      current: Number(row.current) || 0,
      target: Number(row.target) || 0,
    };
    const out = uiRoot('dashboard', 'sales-target.json');
    await writeFile(out, JSON.stringify(json, null, 2) + '\n');
    console.log(`Wrote sales-target -> ${out}`);
  }
  // sales-target-chart
  await csvToJsonFile(
    csvRoot('dashboard', 'sales-target-chart.csv'),
    uiRoot('dashboard', 'sales-target-chart.json'),
    (row) => ({ name: row.name, target: Number(row.target) || 0, sales: Number(row.sales) || 0 })
  );
  // sales-comparison
  await csvToJsonFile(
    csvRoot('dashboard', 'sales-comparison.csv'),
    uiRoot('dashboard', 'sales-comparison.json'),
    (row) => ({
      name: row.name,
      jane: row.jane ? Number(row.jane) : undefined,
      alex: row.alex ? Number(row.alex) : undefined,
      john: row.john ? Number(row.john) : undefined,
    })
  );
  // recent-sales
  await csvToJsonFile(
    csvRoot('dashboard', 'recent-sales.csv'),
    uiRoot('dashboard', 'recent-sales.json'),
    (row) => ({ customer: { name: row.customer_name, email: row.customer_email }, amount: Number(row.amount) || 0 })
  );

  // Employees data
  await csvToJsonFile(
    csvRoot('employees', 'employees.csv'),
    uiRoot('employees', 'employees.json'),
    (row) => ({ value: row.value, label: row.label, name: row.name, role: row.role, manager: row.manager || null })
  );
  await csvToJsonFile(
    csvRoot('employees', 'customer-sales.csv'),
    uiRoot('employees', 'customer-sales.json'),
    (row) => ({ id: row.id, customerName: row.customerName, salesTarget: Number(row.salesTarget) || 0, salesAmount: Number(row.salesAmount) || 0 })
  );
  // customer-product-sales-details.json as object keyed by customerId
  {
    const rows = await readCsv(csvRoot('employees', 'customer-product-sales-details.csv'));
    const map = {};
    for (const r of rows) {
      const key = r.customerId;
      if (!map[key]) map[key] = [];
      map[key].push({
        productName: r.productName,
        salesTarget: Number(r.salesTarget) || 0,
        salesAmount: Number(r.salesAmount) || 0,
      });
    }
    const out = uiRoot('employees', 'customer-product-sales-details.json');
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify(map, null, 2) + '\n');
    console.log(`Wrote employee customer-product-sales-details -> ${out}`);
  }

  // Inventory products
  await csvToJsonFile(
    csvRoot('inventory', 'products.csv'),
    uiRoot('inventory', 'products.json'),
    (row) => ({ label: row.label, value: row.value, basePrice: Number(row.basePrice) || 0 })
  );

  // Customers pickers
  await csvToJsonFile(
    csvRoot('customers', 'customers.csv'),
    uiRoot('customers', 'customers.json'),
    (row) => ({ label: row.label, value: row.value, grade: row.grade })
  );
  // Customer roster + monthly/yearly breakdown
  {
    const roster = await readCsv(csvRoot('customers', 'customer-roster.csv'));
    const monthly = await readCsv(csvRoot('customers', 'customer-monthly-sales.csv'));
    const yearly = await readCsv(csvRoot('customers', 'customer-yearly-sales.csv'));

    const monthlyByCode = monthly.reduce((acc, r) => {
      const code = r.customerCode;
      if (!acc[code]) acc[code] = [];
      acc[code].push({ month: Number(r.month), actual: Number(r.actual) || 0, average: Number(r.average) || 0 });
      return acc;
    }, {});
    const yearlyByCode = yearly.reduce((acc, r) => {
      const code = r.customerCode;
      if (!acc[code]) acc[code] = [];
      acc[code].push({ year: Number(r.year), amount: Number(r.amount) || 0 });
      return acc;
    }, {});

    const data = roster.map((r) => ({
      employee: r.employee,
      employeeId: r.employeeId,
      customerName: r.customerName,
      customerCode: r.customerCode,
      customerGrade: r.customerGrade,
      customerType: r.customerType,
      monthlySales: monthlyByCode[r.customerCode] || [],
      yearlySales: yearlyByCode[r.customerCode] || [],
      creditBalance: Number(r.creditBalance) || 0,
      contact: {
        name: r.contact_name,
        position: r.contact_position,
        phone: r.contact_phone,
        address: r.contact_address,
        email: r.contact_email || null,
      },
      companyOverview: r.companyOverview,
    }));

    const out = uiRoot('customers', 'customer-data.json');
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify(data, null, 2) + '\n');
    console.log(`Wrote customer-data -> ${out}`);
  }

  // Credit due payments
  await csvToJsonFile(
    csvRoot('credit', 'due-payments.csv'),
    uiRoot('credit', 'due-payments.json'),
    (r) => ({
      id: r.id,
      employee: r.employee,
      customer: { name: r.customer_name, email: r.customer_email },
      dueDate: r.dueDate,
      amount: Number(r.amount) || 0,
      collectionPlan: r.collectionPlan || null,
    })
  );

  // Reports
  await csvToJsonFile(
    csvRoot('reports', 'cash', 'cash-sales.csv'),
    uiRoot('reports', 'cash', 'cash-sales.json'),
    (r) => ({ id: r.id, employeeName: r.employeeName, customerName: r.customerName, source: r.source, amount: Number(r.amount) || 0, date: r.date })
  );
  await csvToJsonFile(
    csvRoot('reports', 'checks', 'check-payments.csv'),
    uiRoot('reports', 'checks', 'check-payments.json'),
    (r) => ({
      id: r.id,
      receiptDate: r.receiptDate,
      dueDate: r.dueDate,
      salesperson: r.salesperson,
      customerName: r.customerName,
      issuingBank: r.issuingBank,
      checkNumber: r.checkNumber,
      amount: Number(r.amount) || 0,
      depositBank: r.depositBank || undefined,
      depositDate: r.depositDate || undefined,
      status: r.status,
      notes: r.notes || undefined,
    })
  );

  // Sales
  await csvToJsonFile(
    csvRoot('sales', 'sales-report.csv'),
    uiRoot('sales', 'sales-report.json'),
    (r) => ({ employeeName: r.employeeName, customerName: r.customerName, customerCode: r.customerCode, target: Number(r.target) || 0, actual: Number(r.actual) || 0 })
  );
  await csvToJsonFile(
    csvRoot('sales', 'cumulative-report.csv'),
    uiRoot('sales', 'cumulative-report.json'),
    (r) => ({ month: r.month, target: Number(r.target) || 0, actual: Number(r.actual) || 0, lastYear: Number(r.lastYear) || 0 })
  );
  // monthly detail rebuild nested structure by month and customer
  {
    const rows = await readCsv(csvRoot('sales', 'monthly-detail-report.csv'));
    const map = new Map(); // month -> { customerName -> products[] }
    for (const r of rows) {
      const m = r.month;
      const cust = r.customerName;
      const prod = { productName: r.productName, target: Number(r.target) || 0, actual: Number(r.actual) || 0 };
      if (!map.has(m)) map.set(m, new Map());
      const byCustomer = map.get(m);
      if (!byCustomer.has(cust)) byCustomer.set(cust, []);
      byCustomer.get(cust).push(prod);
    }
    const outArr = [];
    for (const [month, byCustomer] of map.entries()) {
      const details = [];
      for (const [customerName, products] of byCustomer.entries()) {
        details.push({ customerName, products });
      }
      outArr.push({ month, details });
    }
    const out = uiRoot('sales', 'monthly-detail-report.json');
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify(outArr, null, 2) + '\n');
    console.log(`Wrote monthly-detail-report -> ${out}`);
  }

  // Imports samples (wrap CSV content as { csv: "..." })
  for (const file of [
    ['imports', 'product-upload-sample.csv', 'imports', 'product-upload-sample.json'],
    ['imports', 'customer-upload-sample.csv', 'imports', 'customer-upload-sample.json'],
    ['imports', 'import-upload-sample.csv', 'imports', 'import-upload-sample.json'],
    ['ai', 'sales-trend.csv', 'ai', 'sales-trend.json'],
  ]) {
    const [inDir, inFile, outDir, outFile] = file;
    const csvPath = csvRoot(inDir, inFile);
    const content = await readFile(path.resolve(process.cwd(), csvPath), 'utf8');
    const out = uiRoot(outDir, outFile);
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify({ csv: content }, null, 2) + '\n');
    console.log(`Wrapped CSV -> ${out}`);
  }

  // Commissions
  {
    const employees = await readCsv(csvRoot('commissions', 'commissions-employees.csv'));
    const sales = await readCsv(csvRoot('commissions', 'commissions-sales.csv'));
    const salesByEmp = sales.reduce((acc, r) => {
      const id = r.employeeId;
      if (!acc[id]) acc[id] = [];
      acc[id].push({
        type: r.type,
        salePrice: Number(r.salePrice) || 0,
        costPrice: Number(r.costPrice) || 0,
        customerType: r.customerType,
      });
      return acc;
    }, {});
    const outArr = employees.map((e) => ({
      employeeId: e.employeeId,
      employeeName: e.employeeName,
      sales: salesByEmp[e.employeeId] || [],
    }));
    const out = uiRoot('commissions', 'commission-data.json');
    await ensureDir(path.dirname(out));
    await writeFile(out, JSON.stringify(outArr, null, 2) + '\n');
    console.log(`Wrote commission-data -> ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
