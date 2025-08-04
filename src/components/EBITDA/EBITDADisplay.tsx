import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FinancialAssessment, AddBackCategory } from "@/hooks/useFinancialAssessment";

interface EBITDADisplayProps {
  assessment: FinancialAssessment;
  addBacks?: AddBackCategory[];
  className?: string;
}

export function EBITDADisplay({ assessment, addBacks = [], className }: EBITDADisplayProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalAddBacks = addBacks
    .filter(addBack => addBack.is_applied)
    .reduce((sum, addBack) => sum + (addBack.amount || 0), 0);

  const adjustedEbitda = (assessment.current_ebitda || 0) + totalAddBacks;
  const ebitdaMargin = assessment.revenue ? (adjustedEbitda / assessment.revenue) * 100 : 0;

  const getMarginColor = (margin: number) => {
    if (margin >= 20) return "text-green-600";
    if (margin >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getMarginLabel = (margin: number) => {
    if (margin >= 20) return "Excellent";
    if (margin >= 10) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Evidence-Based EBITDA</CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your submitted financial data
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Core Financials */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Annual Revenue</span>
              <span className="text-lg font-semibold">{formatCurrency(assessment.revenue)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Net Income</span>
              <span className="text-lg font-semibold">{formatCurrency(assessment.net_income)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Current EBITDA</span>
              <span className="text-lg font-semibold">{formatCurrency(assessment.current_ebitda)}</span>
            </div>

            {totalAddBacks > 0 && (
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Total Add-Backs</span>
                <span className="text-lg font-semibold text-blue-600">+{formatCurrency(totalAddBacks)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="font-semibold">Adjusted EBITDA</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(adjustedEbitda)}</span>
            </div>
          </div>

          {/* EBITDA Margin */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">EBITDA Margin</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${getMarginColor(ebitdaMargin)}`}>
                  {ebitdaMargin.toFixed(1)}%
                </span>
                <Badge variant={ebitdaMargin >= 20 ? "default" : ebitdaMargin >= 10 ? "secondary" : "destructive"}>
                  {getMarginLabel(ebitdaMargin)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Assessment Status */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Assessment Status</span>
              <Badge variant={assessment.assessment_status === 'completed' ? 'default' : 'secondary'}>
                {assessment.assessment_status?.charAt(0).toUpperCase() + assessment.assessment_status?.slice(1) || 'Draft'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}