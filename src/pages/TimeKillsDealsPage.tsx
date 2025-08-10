
import React from 'react';
import { Card } from '@/components/ui/card';
import { TimeKillsDealsEducation } from '@/components/time-kills-deals/TimeKillsDealsEducation';

export default function TimeKillsDealsPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 backdrop-blur-sm border-primary/20">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Time Kills Deals</h1>
              <p className="text-muted-foreground mt-1">
                Learn why speed and preparation are critical to M&A success
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Week 1 • Module 5</p>
              <p>15 minutes</p>
            </div>
          </div>
        </div>
      </Card>
      
      <TimeKillsDealsEducation />
    </div>
  );
}
