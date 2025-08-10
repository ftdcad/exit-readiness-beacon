
export interface ModuleConfig {
  name: string;
  path: string;
  weekNumber: number;
  order: number;
}

export interface WeekConfig {
  number: number;
  title: string;
  icon: string;
  modules: ModuleConfig[];
}

// Centralized module configuration that can be easily modified
export const moduleConfigurations: ModuleConfig[] = [
  // Week 1 - Foundation & Education
  { name: 'Interactive Glossary', path: '/portal/week-1/glossary', weekNumber: 1, order: 1 },
  { name: 'Know Your Buyer', path: '/portal/week-1/know-your-buyer', weekNumber: 1, order: 2 },
  { name: 'Data Room', path: '/portal/week-1/data-room', weekNumber: 1, order: 3 },
  { name: 'EBITDA Mastery', path: '/portal/week-1/ebitda-course', weekNumber: 1, order: 4 },
  { name: 'Asset Free Education', path: '/portal/week-1/asset-free-education', weekNumber: 1, order: 5 },
  { name: 'Time Kills Deals', path: '/portal/week-1/time-kills-deals', weekNumber: 1, order: 6 },
  
  // Week 2 - Deal Readiness
  { name: 'Executive Discovery Interview', path: '/portal/week-2/executive-discovery', weekNumber: 2, order: 1 },
  { name: 'Strategy Doc Builder', path: '/portal/week-2/value-builder', weekNumber: 2, order: 2 },
  { name: 'KPIs and OKRs', path: '/portal/week-2/kpis-okrs', weekNumber: 2, order: 3 },
  { name: 'Asset Workshop', path: '/portal/week-2/asset-workshop', weekNumber: 2, order: 4 },
  { name: 'Quick Wins', path: '/portal/week-2/quick-wins', weekNumber: 2, order: 5 },
  
  // Week 3 - Performance Readiness
  { name: 'EBITDA Calculator', path: '/portal/week-3/ebitda-calculator', weekNumber: 3, order: 1 },
  { name: 'Industry Multipliers', path: '/portal/week-3/multiples', weekNumber: 3, order: 2 },
  { name: 'Scenario Planning', path: '/portal/week-3/scenarios', weekNumber: 3, order: 3 },
  { name: 'PE Benchmarks', path: '/portal/week-3/benchmarks', weekNumber: 3, order: 4 },
  { name: 'Management Scorecard', path: '/portal/week-3/scorecard', weekNumber: 3, order: 5 },
  
  // Week 4 - Final Readiness
  { name: 'Due Diligence Checklist', path: '/portal/week-4/dd-checklist', weekNumber: 4, order: 1 },
  { name: 'LOI Review', path: '/portal/week-4/loi-review', weekNumber: 4, order: 2 },
  { name: 'Final Report', path: '/portal/week-4/final-report', weekNumber: 4, order: 3 }
];

// Helper function to get modules by week
export const getModulesByWeek = (weekNumber: number): ModuleConfig[] => {
  return moduleConfigurations
    .filter(module => module.weekNumber === weekNumber)
    .sort((a, b) => a.order - b.order);
};

// Helper function to get module count by week
export const getModuleCountByWeek = (weekNumber: number): number => {
  return moduleConfigurations.filter(module => module.weekNumber === weekNumber).length;
};

// Helper function to get all week configurations
export const getWeekConfigurations = () => {
  const weeks = [
    { number: 1, title: 'Foundation & Education', icon: 'BookOpen' },
    { number: 2, title: 'Deal Readiness', icon: 'Calculator' },
    { number: 3, title: 'Performance Readiness', icon: 'TrendingUp' },
    { number: 4, title: 'Final Readiness', icon: 'FileCheck' }
  ];

  return weeks.map(week => ({
    ...week,
    modules: getModulesByWeek(week.number)
  }));
};

// Helper function to move a module to a different week
export const moveModuleToWeek = (moduleName: string, newWeekNumber: number, newOrder: number = 999): ModuleConfig[] => {
  return moduleConfigurations.map(module => {
    if (module.name === moduleName) {
      return {
        ...module,
        weekNumber: newWeekNumber,
        order: newOrder,
        path: module.path.replace(/week-\d+/, `week-${newWeekNumber}`)
      };
    }
    return module;
  });
};
