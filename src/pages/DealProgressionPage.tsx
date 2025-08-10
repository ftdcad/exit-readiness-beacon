
import React from 'react';
import { ModuleProgress } from '@/components/ModuleProgress';
import { DealProgressionEducation } from '@/components/deal-progression/DealProgressionEducation';

export default function DealProgressionPage() {
  return (
    <div className="space-y-6">
      <ModuleProgress 
        moduleName="Deal Progression"
        weekNumber={1}
        description="Understanding NDA to Close: The 5 stages of your PE deal"
        estimatedTime="15 min"
      />
      <DealProgressionEducation />
    </div>
  );
}
