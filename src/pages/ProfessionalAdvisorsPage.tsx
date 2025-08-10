
import React from 'react';
import { Card } from '@/components/ui/card';
import { ProfessionalAdvisorsEducation } from '@/components/professional-advisors/ProfessionalAdvisorsEducation';

const ProfessionalAdvisorsPage = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 backdrop-blur-sm border-primary/20">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Professional Advisors</h1>
              <p className="text-muted-foreground mt-1">
                Building the right team for your exit
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Week 1 • Module 6</p>
              <p>15 minutes</p>
            </div>
          </div>
        </div>
      </Card>
      
      <ProfessionalAdvisorsEducation />
    </div>
  );
};

export default ProfessionalAdvisorsPage;
