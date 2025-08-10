
import React from 'react';
import { Card } from '@/components/ui/card';
import { ModuleProgress } from '@/components/ModuleProgress';
import { DealProgressionEducation } from '@/components/deal-progression/DealProgressionEducation';

export default function DealProgressionPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 backdrop-blur-sm border-primary/20">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Deal Progression</h1>
              <p className="text-muted-foreground mt-1">
                Understanding NDA to Close: The 5 stages of your PE deal
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Week 1 • Module 7</p>
              <p>15 minutes</p>
            </div>
          </div>
        </div>
      </Card>
      
      <DealProgressionEducation />
    </div>
  );
}
