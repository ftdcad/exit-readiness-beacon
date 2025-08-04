import jsPDF from 'jspdf';

export interface MockCompanyData {
  name: string;
  industry: string;
  revenue: number;
  ebitda: number;
  margin: number;
  financials: {
    revenue: number;
    cogs: number;
    opex: number;
    netIncome: number;
    ownerSalaryAddback: number;
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
  };
  customers: Array<{
    name: string;
    revenue: number;
    percentage: number;
  }>;
}

export const mockCompanyData: MockCompanyData = {
  name: "Acme Manufacturing LLC",
  industry: "Manufacturing",
  revenue: 2500000,
  ebitda: 625000,
  margin: 25,
  financials: {
    revenue: 2500000,
    cogs: 1100000,
    opex: 950000,
    netIncome: 450000,
    ownerSalaryAddback: 175000,
    totalAssets: 1800000,
    totalLiabilities: 600000,
    equity: 1200000
  },
  customers: [
    { name: "MegaCorp Industries", revenue: 875000, percentage: 35 },
    { name: "Global Solutions Ltd", revenue: 450000, percentage: 18 },
    { name: "TechFlow Systems", revenue: 125000, percentage: 5 },
    { name: "Industrial Partners", revenue: 100000, percentage: 4 },
    { name: "Manufacturing Plus", revenue: 75000, percentage: 3 },
    { name: "Various Small Customers", revenue: 875000, percentage: 35 }
  ]
};

export const generatePnLStatement = (data: MockCompanyData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(`${data.name}`, pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Profit & Loss Statement', pageWidth / 2, 35, { align: 'center' });
  doc.text('For the Year Ended December 31, 2023', pageWidth / 2, 45, { align: 'center' });
  
  // Revenue Section
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('REVENUE', 20, 65);
  doc.setFont(undefined, 'normal');
  doc.text('Gross Revenue', 25, 75);
  doc.text(`$${data.financials.revenue.toLocaleString()}`, 160, 75, { align: 'right' });
  
  // Draw line
  doc.line(20, 80, 190, 80);
  doc.setFont(undefined, 'bold');
  doc.text('Total Revenue', 25, 90);
  doc.text(`$${data.financials.revenue.toLocaleString()}`, 160, 90, { align: 'right' });
  
  // COGS Section
  doc.text('COST OF GOODS SOLD', 20, 110);
  doc.setFont(undefined, 'normal');
  doc.text('Materials & Direct Labor', 25, 120);
  doc.text(`$${data.financials.cogs.toLocaleString()}`, 160, 120, { align: 'right' });
  
  doc.line(20, 125, 190, 125);
  doc.setFont(undefined, 'bold');
  doc.text('Total COGS', 25, 135);
  doc.text(`$${data.financials.cogs.toLocaleString()}`, 160, 135, { align: 'right' });
  
  // Gross Profit
  const grossProfit = data.financials.revenue - data.financials.cogs;
  doc.text('GROSS PROFIT', 25, 150);
  doc.text(`$${grossProfit.toLocaleString()}`, 160, 150, { align: 'right' });
  
  // Operating Expenses
  doc.text('OPERATING EXPENSES', 20, 170);
  doc.setFont(undefined, 'normal');
  doc.text('General & Administrative', 25, 180);
  doc.text(`$${Math.round(data.financials.opex * 0.6).toLocaleString()}`, 160, 180, { align: 'right' });
  doc.text('Sales & Marketing', 25, 190);
  doc.text(`$${Math.round(data.financials.opex * 0.4).toLocaleString()}`, 160, 190, { align: 'right' });
  
  doc.line(20, 195, 190, 195);
  doc.setFont(undefined, 'bold');
  doc.text('Total Operating Expenses', 25, 205);
  doc.text(`$${data.financials.opex.toLocaleString()}`, 160, 205, { align: 'right' });
  
  // EBITDA
  const ebitda = grossProfit - data.financials.opex;
  doc.text('EBITDA', 25, 220);
  doc.text(`$${ebitda.toLocaleString()}`, 160, 220, { align: 'right' });
  
  // Net Income
  doc.text('NET INCOME', 25, 240);
  doc.text(`$${data.financials.netIncome.toLocaleString()}`, 160, 240, { align: 'right' });
  
  // Add-back notes
  doc.setFontSize(10);
  doc.text('Notes:', 20, 260);
  doc.text(`• Owner salary add-back: $${data.financials.ownerSalaryAddback.toLocaleString()}`, 25, 270);
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
};

export const generateBalanceSheet = (data: MockCompanyData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text(`${data.name}`, pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Balance Sheet', pageWidth / 2, 35, { align: 'center' });
  doc.text('As of December 31, 2023', pageWidth / 2, 45, { align: 'center' });
  
  // Assets
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('ASSETS', 20, 65);
  
  doc.setFont(undefined, 'normal');
  doc.text('Current Assets:', 25, 80);
  doc.text('Cash & Cash Equivalents', 30, 90);
  doc.text(`$${Math.round(data.financials.totalAssets * 0.15).toLocaleString()}`, 160, 90, { align: 'right' });
  doc.text('Accounts Receivable', 30, 100);
  doc.text(`$${Math.round(data.financials.totalAssets * 0.25).toLocaleString()}`, 160, 100, { align: 'right' });
  doc.text('Inventory', 30, 110);
  doc.text(`$${Math.round(data.financials.totalAssets * 0.20).toLocaleString()}`, 160, 110, { align: 'right' });
  
  doc.text('Fixed Assets:', 25, 130);
  doc.text('Property, Plant & Equipment', 30, 140);
  doc.text(`$${Math.round(data.financials.totalAssets * 0.40).toLocaleString()}`, 160, 140, { align: 'right' });
  
  doc.line(20, 150, 190, 150);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL ASSETS', 25, 160);
  doc.text(`$${data.financials.totalAssets.toLocaleString()}`, 160, 160, { align: 'right' });
  
  // Liabilities
  doc.text('LIABILITIES', 20, 180);
  doc.setFont(undefined, 'normal');
  doc.text('Current Liabilities', 25, 195);
  doc.text(`$${Math.round(data.financials.totalLiabilities * 0.6).toLocaleString()}`, 160, 195, { align: 'right' });
  doc.text('Long-term Debt', 25, 205);
  doc.text(`$${Math.round(data.financials.totalLiabilities * 0.4).toLocaleString()}`, 160, 205, { align: 'right' });
  
  doc.line(20, 210, 190, 210);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL LIABILITIES', 25, 220);
  doc.text(`$${data.financials.totalLiabilities.toLocaleString()}`, 160, 220, { align: 'right' });
  
  // Equity
  doc.text('EQUITY', 20, 240);
  doc.setFont(undefined, 'normal');
  doc.text('Owner Equity', 25, 250);
  doc.text(`$${data.financials.equity.toLocaleString()}`, 160, 250, { align: 'right' });
  
  doc.line(20, 255, 190, 255);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL LIABILITIES & EQUITY', 25, 265);
  doc.text(`$${(data.financials.totalLiabilities + data.financials.equity).toLocaleString()}`, 160, 265, { align: 'right' });
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
};

export const generateTaxReturn = (data: MockCompanyData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Form 1120S', pageWidth / 2, 25, { align: 'center' });
  doc.text('U.S. Income Tax Return for an S Corporation', pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Tax Year 2023', pageWidth / 2, 50, { align: 'center' });
  
  // Company Info
  doc.setFont(undefined, 'normal');
  doc.text('Corporation Name:', 20, 70);
  doc.text(data.name, 80, 70);
  
  doc.text('EIN:', 20, 80);
  doc.text('XX-XXXXXXX', 80, 80);
  
  // Income Section
  doc.setFont(undefined, 'bold');
  doc.text('INCOME', 20, 100);
  doc.setFont(undefined, 'normal');
  doc.text('1. Gross Revenue', 25, 115);
  doc.text(`$${data.financials.revenue.toLocaleString()}`, 160, 115, { align: 'right' });
  
  doc.text('2. Total Income', 25, 130);
  doc.text(`$${data.financials.revenue.toLocaleString()}`, 160, 130, { align: 'right' });
  
  // Deductions
  doc.setFont(undefined, 'bold');
  doc.text('DEDUCTIONS', 20, 150);
  doc.setFont(undefined, 'normal');
  doc.text('12. Cost of Goods Sold', 25, 165);
  doc.text(`$${data.financials.cogs.toLocaleString()}`, 160, 165, { align: 'right' });
  
  doc.text('13. Operating Expenses', 25, 175);
  doc.text(`$${data.financials.opex.toLocaleString()}`, 160, 175, { align: 'right' });
  
  const totalDeductions = data.financials.cogs + data.financials.opex;
  doc.text('21. Total Deductions', 25, 190);
  doc.text(`$${totalDeductions.toLocaleString()}`, 160, 190, { align: 'right' });
  
  // Taxable Income
  doc.setFont(undefined, 'bold');
  doc.text('22. Ordinary Business Income', 25, 210);
  doc.text(`$${data.financials.netIncome.toLocaleString()}`, 160, 210, { align: 'right' });
  
  // Footer
  doc.setFontSize(10);
  doc.text('This is a mock tax return for demonstration purposes only.', 20, 260);
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
};

export const generateOperatingAgreement = (data: MockCompanyData): Blob => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('OPERATING AGREEMENT', pageWidth / 2, 25, { align: 'center' });
  doc.text(`OF ${data.name.toUpperCase()}`, pageWidth / 2, 35, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('This Operating Agreement is entered into as of January 1, 2020', 20, 55);
  
  // Article 1
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 1 - FORMATION', 20, 75);
  doc.setFont(undefined, 'normal');
  doc.text('1.1 Formation. The Company was formed as a limited liability', 20, 90);
  doc.text('company under the laws of Delaware on January 1, 2020.', 20, 100);
  
  doc.text(`1.2 Name. The name of the Company is "${data.name}".`, 20, 115);
  
  doc.text('1.3 Registered Office. The registered office of the Company', 20, 130);
  doc.text('is located at 123 Manufacturing Street, Delaware, DE 19801.', 20, 140);
  
  // Article 2
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 2 - PURPOSE', 20, 160);
  doc.setFont(undefined, 'normal');
  doc.text(`2.1 Purpose. The purpose of the Company is to engage in ${data.industry.toLowerCase()}`, 20, 175);
  doc.text('activities and any other lawful business activities.', 20, 185);
  
  // Article 3
  doc.setFont(undefined, 'bold');
  doc.text('ARTICLE 3 - MANAGEMENT', 20, 205);
  doc.setFont(undefined, 'normal');
  doc.text('3.1 Management Structure. The Company shall be managed by', 20, 220);
  doc.text('its members in accordance with this Agreement.', 20, 230);
  
  // Footer
  doc.setFontSize(10);
  doc.text('This is a mock operating agreement for demonstration purposes only.', 20, 270);
  
  return new Blob([doc.output('blob')], { type: 'application/pdf' });
};

export const generateCustomerListCSV = (data: MockCompanyData): Blob => {
  const csvContent = [
    'Customer Name,Annual Revenue,Percentage of Total,Industry,Contact',
    ...data.customers.map(customer => 
      `"${customer.name}","$${customer.revenue.toLocaleString()}","${customer.percentage}%","Manufacturing","contact@${customer.name.toLowerCase().replace(/\s+/g, '')}.com"`
    )
  ].join('\n');
  
  return new Blob([csvContent], { type: 'text/csv' });
};

export const mockDocuments = [
  {
    name: '2023_PnL_Statement.pdf',
    category: 'Financials',
    subcategory: 'Income Statements',
    documentType: 'Income Statement',
    generator: generatePnLStatement
  },
  {
    name: '2023_Balance_Sheet.pdf',
    category: 'Financials',
    subcategory: 'Balance Sheets',
    documentType: 'Balance Sheet',
    generator: generateBalanceSheet
  },
  {
    name: '2023_Tax_Return.pdf',
    category: 'Financials',
    subcategory: 'Tax Returns',
    documentType: 'Tax Return',
    generator: generateTaxReturn
  },
  {
    name: 'Operating_Agreement_Acme.pdf',
    category: 'Corporate Documents',
    subcategory: 'Governing Documents',
    documentType: 'Operating Agreement',
    generator: generateOperatingAgreement
  },
  {
    name: 'Customer_List_2023.csv',
    category: 'Marketing & Sales',
    subcategory: 'Customer Data',
    documentType: 'Customer List',
    generator: generateCustomerListCSV
  }
];