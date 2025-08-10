
import React from 'react';
import { ModuleProgress } from '@/components/ModuleProgress';
import { DealProgressionEducation } from '@/components/deal-progression/DealProgressionEducation';

export default function DealProgressionPage() {
  return (
    <div className="space-y-6">
      <ModuleProgress currentModule={7} />
      <DealProgressionEducation />
    </div>
  );
}
