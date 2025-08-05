import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/ebitda';

interface ValueWaterfallProps {
  currentValue: number;
  revenueGrowth: number;
  marginImprovement: number;
  multipleExpansion: number;
  className?: string;
}

export function ValueWaterfall({ 
  currentValue, 
  revenueGrowth, 
  marginImprovement, 
  multipleExpansion,
  className 
}: ValueWaterfallProps) {
  const finalValue = currentValue + revenueGrowth + marginImprovement + multipleExpansion;
  
  const steps = [
    { label: 'Current Value', value: currentValue, color: 'bg-muted' },
    { label: 'Revenue Growth', value: revenueGrowth, color: 'bg-blue-500' },
    { label: 'Margin Improvement', value: marginImprovement, color: 'bg-green-500' },
    { label: 'Multiple Expansion', value: multipleExpansion, color: 'bg-purple-500' },
    { label: 'Exit Value', value: finalValue, color: 'bg-primary' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Value Creation Waterfall
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-full h-16 ${step.color} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}>
                  {formatCurrency(step.value)}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2 break-words">
                  {step.label}
                </div>
                {index < 3 && step.value > 0 && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    +{formatCurrency(step.value)}
                  </div>
                )}
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Value Creation:</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(finalValue - currentValue)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-muted-foreground">ROI Multiple:</span>
            <span className="text-sm font-semibold">
              {currentValue > 0 ? `${(finalValue / currentValue).toFixed(1)}x` : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}