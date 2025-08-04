import React from 'react';

interface ModuleInfo {
  number: number;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ModuleProgressProps {
  currentModule: number;
}

export const ModuleProgress = ({ currentModule }: ModuleProgressProps) => {
  const modules: ModuleInfo[] = [
    { number: 1, name: 'Executive Discovery', status: 'completed' },
    { number: 2, name: 'Strategy Doc', status: 'completed' },
    { number: 3, name: 'KPIs & OKRs', status: 'completed' },
    { number: 4, name: 'EBITDA Calculator', status: 'completed' },
    { number: 5, name: 'Industry Multiples', status: currentModule === 5 ? 'current' : currentModule > 5 ? 'completed' : 'upcoming' },
    { number: 6, name: 'Scenario Planning', status: currentModule === 6 ? 'current' : currentModule > 6 ? 'completed' : 'upcoming' }
  ];

  return (
    <div className="mb-8 bg-card/50 border border-border rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {modules.map((module, index) => (
          <React.Fragment key={module.number}>
            <div className={`flex items-center gap-2 ${
              module.status === 'current' ? 'text-primary' : 
              module.status === 'completed' ? 'text-green-500' : 
              'text-muted-foreground'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                module.status === 'current' ? 'bg-primary text-primary-foreground' : 
                module.status === 'completed' ? 'bg-green-500 text-white' : 
                'bg-muted'
              }`}>
                {module.status === 'completed' ? '✓' : module.number}
              </div>
              <span className="text-xs hidden lg:inline">{module.name}</span>
            </div>
            {index < modules.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                modules[index + 1].status !== 'upcoming' ? 'bg-green-500' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Week 2: Building Your Exit Foundation
      </p>
    </div>
  );
};