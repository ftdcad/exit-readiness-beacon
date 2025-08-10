
import React from 'react';
import { ManagementScorecard } from '@/components/management-scorecard/ManagementScorecard';

const ManagementScorecardPage = () => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Management Scorecard
        </h1>
        <p className="text-xl text-muted-foreground">
          Assess your leadership team's readiness for PE ownership and identify who survives the transition.
        </p>
      </div>
      
      <ManagementScorecard />
    </div>
  );
};

export default ManagementScorecardPage;
