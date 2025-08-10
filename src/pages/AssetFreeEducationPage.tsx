
import React from 'react';
import { Card } from '@/components/ui/card';
import { AssetFreeEducation } from '@/components/asset-free-debt-free/AssetFreeEducation';

export default function AssetFreeEducationPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 backdrop-blur-sm border-primary/20">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Asset Free, Debt Free Education</h1>
              <p className="text-muted-foreground mt-1">
                Learn what PE buyers really mean when they say "asset free, debt free, cash free" transaction
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Week 1 • Module 4</p>
              <p>15 minutes</p>
            </div>
          </div>
        </div>
      </Card>
      
      <AssetFreeEducation />
    </div>
  );
}
