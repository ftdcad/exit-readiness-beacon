// Read-only admin EBITDA calculator display - reuses exact admin calculation logic
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddBackCategory } from "@/hooks/useFinancialAssessment";
import { 
  calculateEBITDA, 
  calculateAdjustedEBITDA, 
  calculateEBITDAMargin,
  getMarginClassification,
  formatCurrency,
  formatPercentage,
  FinancialData 
} from "@/lib/ebitdaCalculations";
import { ExtractedFinancialData } from "@/lib/dataRoomParser";

interface EBITDAAdminDisplayProps {
  financialData: ExtractedFinancialData;
  addBacks?: AddBackCategory[];
  className?: string;
}

export function EBITDAAdminDisplay({ 
  financialData, 
  addBacks = [], 
  className 
}: EBITDAAdminDisplayProps) {
  
  const baseEbitda = calculateEBITDA({
    revenue: financialData.revenue || 0,
    netIncome: financialData.netIncome || 0,
    currentEbitda: financialData.currentEbitda || 0,
    cogs: financialData.cogs,
    opex: financialData.opex
  });

  const addBackData = addBacks.map(addBack => ({
    amount: addBack.amount,
    isApplied: addBack.is_applied
  }));

  const adjustedEbitda = calculateAdjustedEBITDA(baseEbitda, addBackData);
  const totalAddBacks = addBackData
    .filter(ab => ab.isApplied)
    .reduce((sum, ab) => sum + ab.amount, 0);

  const revenue = financialData.revenue || 0;
  const margin = calculateEBITDAMargin(adjustedEbitda, revenue);
  const { label: marginLabel, variant: marginVariant } = getMarginClassification(margin);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Evidence-Based EBITDA</CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on {financialData.source === 'data_room' ? 'uploaded documents' : 
                   financialData.source === 'assessment' ? 'financial assessment' : 
                   'manual entry'}
          {financialData.documentName && ` (${financialData.documentName})`}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Financial Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Annual Revenue</div>
            <div className="text-lg font-semibold">{formatCurrency(revenue)}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Net Income</div>
            <div className="text-lg font-semibold">{formatCurrency(financialData.netIncome)}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Current EBITDA</div>
          <div className="text-xl font-bold">{formatCurrency(baseEbitda)}</div>
        </div>

        {/* Add-backs if any */}
        {totalAddBacks > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Add-Backs</div>
            <div className="text-lg font-semibold text-primary">{formatCurrency(totalAddBacks)}</div>
          </div>
        )}

        {/* Adjusted EBITDA */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Adjusted EBITDA</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(adjustedEbitda)}</div>
        </div>

        {/* EBITDA Margin */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">EBITDA Margin</div>
            <div className="text-lg font-semibold">{formatPercentage(margin)}</div>
          </div>
          <Badge variant={marginVariant}>{marginLabel}</Badge>
        </div>

        {/* Data Source Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Data Source</span>
            <Badge variant="outline" className="text-xs">
              {financialData.source === 'data_room' ? 'Data Room' :
               financialData.source === 'assessment' ? 'Assessment' : 'Manual'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}