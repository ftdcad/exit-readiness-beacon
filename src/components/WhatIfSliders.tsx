import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Calendar, DollarSign, TrendingUp, Shield } from 'lucide-react';

interface WhatIfScenario {
  timelineMonths: number;
  investmentAmount: number;
  growthRate: number;
  riskTolerance: 'Low' | 'Medium' | 'High';
}

interface WhatIfSlidersProps {
  scenario: WhatIfScenario;
  onScenarioChange: (scenario: WhatIfScenario) => void;
  className?: string;
}

export function WhatIfSliders({ scenario, onScenarioChange, className }: WhatIfSlidersProps) {
  const updateScenario = (field: keyof WhatIfScenario, value: any) => {
    onScenarioChange({ ...scenario, [field]: value });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          What-If Scenario Modeling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Label>Timeline to Exit</Label>
            <Badge variant="outline">{scenario.timelineMonths} months</Badge>
          </div>
          <Slider
            value={[scenario.timelineMonths]}
            onValueChange={([value]) => updateScenario('timelineMonths', value)}
            min={6}
            max={60}
            step={6}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>6 months</span>
            <span>60 months</span>
          </div>
        </div>

        {/* Investment Amount Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <Label>Investment Amount</Label>
            <Badge variant="outline">${scenario.investmentAmount.toLocaleString()}</Badge>
          </div>
          <Slider
            value={[scenario.investmentAmount]}
            onValueChange={([value]) => updateScenario('investmentAmount', value)}
            min={0}
            max={500000}
            step={25000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$500K</span>
          </div>
        </div>

        {/* Growth Rate Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <Label>Annual Growth Rate</Label>
            <Badge variant="outline">{scenario.growthRate}%</Badge>
          </div>
          <Slider
            value={[scenario.growthRate]}
            onValueChange={([value]) => updateScenario('growthRate', value)}
            min={0}
            max={50}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <Label>Risk Tolerance</Label>
            <Badge className={getRiskColor(scenario.riskTolerance)}>
              {scenario.riskTolerance}
            </Badge>
          </div>
          <div className="flex gap-2">
            {(['Low', 'Medium', 'High'] as const).map((risk) => (
              <button
                key={risk}
                onClick={() => updateScenario('riskTolerance', risk)}
                className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-colors ${
                  scenario.riskTolerance === risk
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-4 border-t">
          <Label className="text-sm font-medium">Quick Presets:</Label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onScenarioChange({ timelineMonths: 12, investmentAmount: 100000, growthRate: 15, riskTolerance: 'High' })}
              className="px-3 py-1 text-xs bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              Quick Exit
            </button>
            <button
              onClick={() => onScenarioChange({ timelineMonths: 36, investmentAmount: 250000, growthRate: 25, riskTolerance: 'Medium' })}
              className="px-3 py-1 text-xs bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              Value Build
            </button>
            <button
              onClick={() => onScenarioChange({ timelineMonths: 24, investmentAmount: 500000, growthRate: 35, riskTolerance: 'Low' })}
              className="px-3 py-1 text-xs bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              Conservative
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}