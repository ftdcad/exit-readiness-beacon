import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AddBackCategory {
  id: string;
  category: string;
  description: string | null;
  amount: number;
  is_applied: boolean;
  assessment_id: string;
}

interface AddBackSlidersProps {
  categories: AddBackCategory[];
  onUpdateCategory: (categoryId: string, amount: number, isApplied: boolean) => void;
  currentEbitda: number;
}

const DEFAULT_CATEGORIES = [
  {
    id: 'owner-salary',
    category: 'Owner Salary Add-Back',
    description: 'Excess owner compensation above market rate',
    maxAmount: 500000,
    step: 5000
  },
  {
    id: 'personal-vehicles',
    category: 'Personal Vehicle Expenses',
    description: 'Vehicle expenses not related to business operations',
    maxAmount: 50000,
    step: 1000
  },
  {
    id: 'travel-meals',
    category: 'Travel & Meals',
    description: 'Personal travel and meal expenses',
    maxAmount: 25000,
    step: 500
  },
  {
    id: 'legal-professional',
    category: 'Legal & Professional Fees',
    description: 'One-time or non-recurring professional fees',
    maxAmount: 100000,
    step: 2500
  },
  {
    id: 'other-expenses',
    category: 'Other Non-Recurring Expenses',
    description: 'Other one-time or personal expenses',
    maxAmount: 75000,
    step: 1000
  }
];

export function AddBackSliders({ categories, onUpdateCategory, currentEbitda }: AddBackSlidersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryData = (defaultCat: typeof DEFAULT_CATEGORIES[0]) => {
    const existing = categories.find(c => c.category === defaultCat.category);
    return {
      ...defaultCat,
      amount: existing?.amount || 0,
      isApplied: existing?.is_applied || false,
      id: existing?.id || defaultCat.id
    };
  };

  const totalAddBacks = categories
    .filter(c => c.is_applied)
    .reduce((sum, c) => sum + c.amount, 0);

  const adjustedEbitda = currentEbitda + totalAddBacks;

  const resetAllSliders = () => {
    categories.forEach(category => {
      if (category.amount > 0 || category.is_applied) {
        onUpdateCategory(category.id, 0, false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>EBITDA Add-Back Analysis</CardTitle>
            <CardDescription>
              Adjust potential add-backs to see the impact on adjusted EBITDA
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetAllSliders}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current vs Adjusted EBITDA Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Current EBITDA</div>
            <div className="text-lg font-semibold">{formatCurrency(currentEbitda)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total Add-Backs</div>
            <div className="text-lg font-semibold text-primary">{formatCurrency(totalAddBacks)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Adjusted EBITDA</div>
            <div className="text-lg font-semibold text-green-600">{formatCurrency(adjustedEbitda)}</div>
          </div>
        </div>

        {/* Add-Back Category Sliders */}
        <div className="space-y-6">
          {DEFAULT_CATEGORIES.map((defaultCat) => {
            const categoryData = getCategoryData(defaultCat);
            
            return (
              <div key={defaultCat.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{defaultCat.category}</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {defaultCat.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(categoryData.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {categoryData.isApplied ? 'Applied' : 'Not applied'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[categoryData.amount]}
                    onValueChange={(value) => {
                      const newAmount = value[0];
                      const isApplied = newAmount > 0;
                      onUpdateCategory(categoryData.id, newAmount, isApplied);
                    }}
                    max={defaultCat.maxAmount}
                    step={defaultCat.step}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>{formatCurrency(defaultCat.maxAmount)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Summary */}
        {totalAddBacks > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm font-medium text-green-800">
              Potential EBITDA Improvement
            </div>
            <div className="text-lg font-semibold text-green-700">
              +{formatCurrency(totalAddBacks)} ({((totalAddBacks / currentEbitda) * 100).toFixed(1)}% increase)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}