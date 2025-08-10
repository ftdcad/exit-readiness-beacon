
import React from 'react';
import { ProfessionalAdvisorsEducation } from '@/components/professional-advisors/ProfessionalAdvisorsEducation';

const ProfessionalAdvisorsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Professional Advisors</h1>
          <p className="text-xl text-gray-300">
            Building the right team for your exit
          </p>
        </div>
        
        <ProfessionalAdvisorsEducation />
      </div>
    </div>
  );
};

export default ProfessionalAdvisorsPage;
