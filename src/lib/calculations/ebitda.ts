// SHARED EBITDA CALCULATION LOGIC - SINGLE SOURCE OF TRUTH
// This ensures identical calculation logic between admin and client views

export interface FinancialData {
  revenue: number;
  cogs: number;
  opex: number;
  addbacks: {
    ownerSalary?: number;
    personalVehicle?: number;
    travelMeals?: number;
    legalFees?: number;
    otherNonRecurring?: number;
  };
}

export interface EBITDAResults {
  revenue: number;
  cogs: number;
  opex: number;
  grossProfit: number;
  baseEBITDA: number;
  totalAddbacks: number;
  adjustedEBITDA: number;
  margin: number;
  healthStatus: 'red' | 'yellow' | 'green';
  healthMessage: string;
}

export function calculateEBITDA(data: FinancialData): EBITDAResults {
  // EXACT LOGIC FROM ADMIN PAGE - DO NOT MODIFY
  // Add defensive programming to handle invalid inputs
  const revenue = Number(data.revenue) || 0;
  const cogs = Number(data.cogs) || 0;
  const opex = Number(data.opex) || 0;
  
  const grossProfit = revenue - cogs;
  const baseEBITDA = grossProfit - opex;
  
  const totalAddbacks = Object.values(data.addbacks || {})
    .reduce((sum, val) => sum + (Number(val) || 0), 0);
  
  const adjustedEBITDA = baseEBITDA + totalAddbacks;
  const margin = revenue > 0 ? (adjustedEBITDA / revenue) * 100 : 0;
  
  // Ensure all calculated values are valid numbers
  const safeMargin = Number.isFinite(margin) ? margin : 0;
  
  // Traffic light status
  let healthStatus: 'red' | 'yellow' | 'green' = 'red';
  let healthMessage = 'Below PE Standards';
  if (safeMargin >= 15) {
    healthStatus = 'green';
    healthMessage = 'PE Ready';
  } else if (safeMargin >= 10) {
    healthStatus = 'yellow';
    healthMessage = 'Needs Improvement';
  }
  
  return {
    revenue: Number.isFinite(revenue) ? revenue : 0,
    cogs: Number.isFinite(cogs) ? cogs : 0,
    opex: Number.isFinite(opex) ? opex : 0,
    grossProfit: Number.isFinite(grossProfit) ? grossProfit : 0,
    baseEBITDA: Number.isFinite(baseEBITDA) ? baseEBITDA : 0,
    totalAddbacks: Number.isFinite(totalAddbacks) ? totalAddbacks : 0,
    adjustedEBITDA: Number.isFinite(adjustedEBITDA) ? adjustedEBITDA : 0,
    margin: safeMargin,
    healthStatus,
    healthMessage
  };
}

// Extract this from admin component - MUST BE IDENTICAL
export function calculateValuation(ebitda: number, multiple: number = 4.5): number {
  return ebitda * multiple;
}

// Format currency consistently
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage consistently
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}