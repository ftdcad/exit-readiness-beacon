// Shared EBITDA calculation utilities extracted from admin components
// This ensures identical calculation logic between admin and client views

export interface FinancialData {
  revenue: number;
  netIncome: number;
  currentEbitda: number;
  cogs?: number;
  opex?: number;
}

export interface AddBackData {
  amount: number;
  isApplied: boolean;
}

export interface SimulationParams {
  revenueChange: number; // percentage change
  cogsChange: number; // percentage change  
  opexChange: number; // percentage change
  additionalAddBacks: number; // dollar amount
}

// Core EBITDA calculation - single source of truth
export const calculateEBITDA = (data: FinancialData): number => {
  return data.currentEbitda || 0;
};

// Calculate adjusted EBITDA with add-backs
export const calculateAdjustedEBITDA = (
  baseEbitda: number, 
  addBacks: AddBackData[]
): number => {
  const totalAddBacks = addBacks
    .filter(addBack => addBack.isApplied)
    .reduce((sum, addBack) => sum + addBack.amount, 0);
  
  return baseEbitda + totalAddBacks;
};

// Calculate EBITDA margin
export const calculateEBITDAMargin = (ebitda: number, revenue: number): number => {
  if (!revenue || revenue === 0) return 0;
  return ebitda / revenue;
};

// Simulate EBITDA changes based on operational improvements
export const simulateEBITDA = (
  baseline: FinancialData,
  simulation: SimulationParams
): {
  simulatedRevenue: number;
  simulatedEbitda: number;
  ebitdaDelta: number;
  simulatedMargin: number;
} => {
  const simulatedRevenue = baseline.revenue * (1 + simulation.revenueChange / 100);
  
  // Calculate impact on EBITDA from revenue and cost changes
  const revenueImpact = baseline.revenue * (simulation.revenueChange / 100);
  const cogsImpact = (baseline.cogs || 0) * (simulation.cogsChange / 100);
  const opexImpact = (baseline.opex || 0) * (simulation.opexChange / 100);
  
  // EBITDA = Revenue - COGS - OpEx, so cost increases reduce EBITDA
  const simulatedEbitda = baseline.currentEbitda + revenueImpact - cogsImpact - opexImpact + simulation.additionalAddBacks;
  
  const ebitdaDelta = simulatedEbitda - baseline.currentEbitda;
  const simulatedMargin = calculateEBITDAMargin(simulatedEbitda, simulatedRevenue);
  
  return {
    simulatedRevenue,
    simulatedEbitda,
    ebitdaDelta,
    simulatedMargin
  };
};

// Get margin classification and color
export const getMarginClassification = (margin: number): {
  label: string;
  color: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
} => {
  if (margin >= 0.20) {
    return { label: 'Excellent', color: 'text-green-600', variant: 'default' };
  } else if (margin >= 0.15) {
    return { label: 'Good', color: 'text-green-500', variant: 'default' };
  } else if (margin >= 0.10) {
    return { label: 'Fair', color: 'text-yellow-600', variant: 'secondary' };
  } else {
    return { label: 'Needs Work', color: 'text-red-600', variant: 'destructive' };
  }
};

// Traffic light system for simulator
export const getTrafficLight = (margin: number): {
  color: string;
  status: 'red' | 'yellow' | 'green';
} => {
  if (margin >= 0.15) {
    return { color: 'bg-green-500', status: 'green' };
  } else if (margin >= 0.10) {
    return { color: 'bg-yellow-500', status: 'yellow' };
  } else {
    return { color: 'bg-red-500', status: 'red' };
  }
};

// Format currency consistently
export const formatCurrency = (amount: number | null): string => {
  if (!amount && amount !== 0) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage consistently
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};