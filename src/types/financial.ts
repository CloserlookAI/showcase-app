export interface IncomeData {
  _id: string;
  Year: number;
  "Net Sales (thousands)": string;
  "Cost of Goods Sold (thousands)": string;
  "Depreciation Expense (thousands)": string;
  "Total Cost of Goods Sold (thousands)": string;
  "Gross Profit (thousands)": string;
  "Gross Profit Margin %": string;
  "Selling Expenses (thousands)": string;
  "General & Administrative Expenses (thousands)": string;
  "Amortization Expense (thousands)": number;
  "Total Operating Expenses (thousands)": string;
  "Income from Operations (thousands)": string;
  "Operating Margin %": string;
  "Interest Expense (thousands)": string;
  "Gain Loss on Sale of Equipment (thousands)": string;
  "Other Income (thousands)": string;
  "Total Other Income Expense (thousands)": string;
  "Income Before Taxes (thousands)": string;
  "Provision for Income taxes (thousands)": string;
  "Net Income (thousands)": string;
  "Net Profit Margin %": string;
}

export interface AssetsData {
  _id: string;
  Year: number;
  "Total Assets (thousands)": string;
  "Cash and Cash Equivalents (thousands)": string;
  "Accounts Receivable Net (thousands)": string;
  "Inventories Net (thousands)": string;
  "Prepaid Expenses and Other Current Assets (thousands)": string;
  "Refundable Income Taxes (thousands)": number;
  "Total Current Assets (thousands)": string;
  "Property Plant Equipment Net (thousands)": string;
  "Operating Lease Right of Use Asset (thousands)": number;
  "Goodwill (thousands)": string;
  "Intangible Assets Net (thousands)": string;
  "Other Assets (thousands)": number;
  "Current Portion Note Payable (thousands)": number;
  "Accounts Payable (thousands)": string;
  "Accrued Expenses (thousands)": string;
  "Accrued Income Taxes (thousands)": string;
  "Total Current Liabilities (thousands)": string;
  "Note Payable Long Term (thousands)": number;
  "Line of Credit (thousands)": number;
  "Operating Lease Liabilities (thousands)": number;
  "Deferred Income Taxes Net (thousands)": string;
  "Total Liabilities (thousands)": string;
  "Common Stock Outstanding Shares": string;
  "Total Stockholders Equity (thousands)": string;
  "Working Capital (thousands)": string;
}

export interface ProcessedFinancialData {
  year: number;
  revenue: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  shareholdersEquity: number;
  operatingIncome: number;
  grossProfit: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  currentAssets: number;
  currentLiabilities: number;
  workingCapital: number;
  cash: number;
  inventory: number;
  outstandingShares: number;
  eps: number;
  bookValuePerShare: number;
  currentRatio: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
}