// Enhanced EBITDA simulator with traffic light system and specified sliders
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import { 
  simulateEBITDA, 
  getTrafficLight,
  formatCurrency,
  formatPercentage,
  FinancialData,
  SimulationParams
} from "@/lib/ebitdaCalculations";
import { ExtractedFinancialData } from "@/lib/dataRoomParser";

interface EBITDASimulatorEnhancedProps {
  baseline: ExtractedFinancialData;
  className?: string;
}

export function EBITDASimulatorEnhanced({ baseline, className }: EBITDASimulatorEnhancedProps) {
  const [revenueChange, setRevenueChange] = useState<number>(0);
  const [cogsChange, setCogsChange] = useState<number>(0);
  const [opexChange, setOpexChange] = useState<number>(0);
  const [additionalAddBacks, setAdditionalAddBacks] = useState<number>(0);

  const baselineData: FinancialData = {
    revenue: baseline.revenue || 0,
    netIncome: baseline.netIncome || 0,
    currentEbitda: baseline.currentEbitda || 0,
    cogs: baseline.cogs || 0,
    opex: baseline.opex || 0
  };

  const simulation: SimulationParams = {
    revenueChange,
    cogsChange,
    opexChange,
    additionalAddBacks
  };

  const results = simulateEBITDA(baselineData, simulation);
  const trafficLight = getTrafficLight(results.simulatedMargin);

  const resetSimulation = () => {
    setRevenueChange(0);
    setCogsChange(0);
    setOpexChange(0);
    setAdditionalAddBacks(0);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              EBITDA Scenario Simulator
              <div className={`w-3 h-3 rounded-full ${trafficLight.color}`} />
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Explore "what-if" scenarios for operational improvements
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSimulation}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Simulation Controls */}
        <div className="space-y-4">
          {/* Revenue Change */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Revenue Change ({formatPercentage(revenueChange / 100)})
            </Label>
            <Slider
              value={[revenueChange]}
              onValueChange={(value) => setRevenueChange(value[0])}
              min={-50}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-50%</span>
              <span>+50%</span>
            </div>
          </div>

          {/* COGS Change */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              COGS Change ({formatPercentage(cogsChange / 100)})
            </Label>
            <Slider
              value={[cogsChange]}
              onValueChange={(value) => setCogsChange(value[0])}
              min={-25}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-25%</span>
              <span>+25%</span>
            </div>
          </div>

          {/* OpEx Change */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              OpEx Change ({formatPercentage(opexChange / 100)})
            </Label>
            <Slider
              value={[opexChange]}
              onValueChange={(value) => setOpexChange(value[0])}
              min={-25}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-25%</span>
              <span>+25%</span>
            </div>
          </div>

          {/* Additional Add-backs */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Add-backs</Label>
            <Input
              type="number"
              value={additionalAddBacks}
              onChange={(e) => setAdditionalAddBacks(Number(e.target.value) || 0)}
              placeholder="Enter additional add-backs"
              className="w-full"
            />
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Simulated Revenue</div>
              <div className="text-lg font-semibold">{formatCurrency(results.simulatedRevenue)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Simulated EBITDA</div>
              <div className="text-lg font-semibold">{formatCurrency(results.simulatedEbitda)}</div>
            </div>
          </div>

          {/* EBITDA Delta */}
          <div className="flex items-center justify-between p-3 bg-background rounded border">
            <div>
              <div className="text-sm text-muted-foreground">EBITDA Impact</div>
              <div className={`text-xl font-bold flex items-center gap-2 ${
                results.ebitdaDelta >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {results.ebitdaDelta >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {results.ebitdaDelta >= 0 ? '+' : ''}{formatCurrency(results.ebitdaDelta)}
              </div>
            </div>
            <Badge variant={results.ebitdaDelta >= 0 ? 'default' : 'destructive'}>
              {results.ebitdaDelta >= 0 ? '+' : ''}{formatPercentage(results.ebitdaDelta / (baselineData.currentEbitda || 1))}
            </Badge>
          </div>

          {/* Margin with Traffic Light */}
          <div className="flex items-center justify-between p-3 bg-background rounded border">
            <div>
              <div className="text-sm text-muted-foreground">Simulated Margin</div>
              <div className="text-xl font-bold">{formatPercentage(results.simulatedMargin)}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${trafficLight.color}`} />
              <Badge variant={
                trafficLight.status === 'green' ? 'default' :
                trafficLight.status === 'yellow' ? 'secondary' : 'destructive'
              }>
                {trafficLight.status === 'green' ? 'Excellent' :
                 trafficLight.status === 'yellow' ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Traffic Light Legend */}
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">Margin Targets:</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Green: ≥15% (Excellent)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Yellow: 10-15% (Good)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Red: &lt;10% (Needs Work)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}