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
  const grossProfit = data.revenue - data.cogs;
  const baseEBITDA = grossProfit - data.opex;
  
  const totalAddbacks = Object.values(data.addbacks || {})
    .reduce((sum, val) => sum + (val || 0), 0);
  
  const adjustedEBITDA = baseEBITDA + totalAddbacks;
  const margin = data.revenue > 0 ? (adjustedEBITDA / data.revenue) * 100 : 0;
  
  // Traffic light status
  let healthStatus: 'red' | 'yellow' | 'green' = 'red';
  let healthMessage = 'Below PE Standards';
  if (margin >= 15) {
    healthStatus = 'green';
    healthMessage = 'PE Ready';
  } else if (margin >= 10) {
    healthStatus = 'yellow';
    healthMessage = 'Needs Improvement';
  }
  
  return {
    revenue: data.revenue,
    cogs: data.cogs,
    opex: data.opex,
    grossProfit,
    baseEBITDA,
    totalAddbacks,
    adjustedEBITDA,
    margin,
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