import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancialAssessment } from "@/hooks/useFinancialAssessment";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EBITDASimulatorProps {
  baseline: FinancialAssessment;
  className?: string;
}

export function EBITDASimulator({ baseline, className }: EBITDASimulatorProps) {
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [costReduction, setCostReduction] = useState(0);
  const [additionalAddBacks, setAdditionalAddBacks] = useState(0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Simulation calculations
  const baseRevenue = baseline.revenue || 0;
  const baseEbitda = baseline.current_ebitda || 0;
  
  const simulatedRevenue = baseRevenue * (1 + revenueGrowth / 100);
  const revenueIncrease = simulatedRevenue - baseRevenue;
  
  // Assume cost reduction applies to current costs (revenue - ebitda)
  const baseCosts = baseRevenue - baseEbitda;
  const costSavings = baseCosts * (costReduction / 100);
  
  const simulatedEbitda = baseEbitda + (revenueIncrease * 0.3) + costSavings + additionalAddBacks;
  const ebitdaDelta = simulatedEbitda - baseEbitda;
  const simulatedMargin = simulatedRevenue > 0 ? (simulatedEbitda / simulatedRevenue) * 100 : 0;
  
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

  const resetSimulation = () => {
    setRevenueGrowth(0);
    setCostReduction(0);
    setAdditionalAddBacks(0);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            EBITDA Simulator
            <Badge variant="secondary">What-If Scenario</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore potential improvements to your EBITDA
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Revenue Growth (%)</Label>
              <div className="space-y-2">
                <Slider
                  value={[revenueGrowth]}
                  onValueChange={([value]) => setRevenueGrowth(value)}
                  max={50}
                  min={-20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>-20%</span>
                  <span className="font-medium">{formatPercentage(revenueGrowth)}</span>
                  <span>+50%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cost Reduction (%)</Label>
              <div className="space-y-2">
                <Slider
                  value={[costReduction]}
                  onValueChange={([value]) => setCostReduction(value)}
                  max={30}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span className="font-medium">{formatPercentage(costReduction)}</span>
                  <span>+30%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Add-Backs ($)</Label>
              <Input
                type="number"
                value={additionalAddBacks}
                onChange={(e) => setAdditionalAddBacks(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Simulated Revenue</span>
                <span className="text-lg font-semibold">{formatCurrency(simulatedRevenue)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="font-semibold">Simulated EBITDA</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(simulatedEbitda)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">EBITDA Delta</span>
                <div className="flex items-center gap-1">
                  {ebitdaDelta >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                  <span className={`text-lg font-semibold ${ebitdaDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ebitdaDelta >= 0 ? '+' : ''}{formatCurrency(ebitdaDelta)}
                  </span>
                </div>
              </div>
            </div>

            {/* Margin Analysis */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Simulated EBITDA Margin</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-semibold ${getMarginColor(simulatedMargin)}`}>
                    {simulatedMargin.toFixed(1)}%
                  </span>
                  <Badge variant={simulatedMargin >= 20 ? "default" : simulatedMargin >= 10 ? "secondary" : "destructive"}>
                    {getMarginLabel(simulatedMargin)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={resetSimulation} className="w-full">
                Reset Simulation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}