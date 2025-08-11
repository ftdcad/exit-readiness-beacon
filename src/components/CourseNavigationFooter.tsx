
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '@/hooks/useProgress';
import { useToast } from '@/hooks/use-toast';

// Define the complete course progression order
const COURSE_PROGRESSION = [
  // Week 1 - Foundation & Education
  { week: 1, module: 'Interactive Glossary', path: '/portal/week-1/glossary', name: 'Interactive Glossary' },
  { week: 1, module: 'Deal Progression', path: '/portal/week-1/deal-progression', name: 'Deal Progression' },
  { week: 1, module: 'Professional Advisors', path: '/portal/week-1/professional-advisors', name: 'Professional Advisors' },
  { week: 1, module: 'Know Your Buyer', path: '/portal/week-1/know-your-buyer', name: 'Know Your Buyer' },
  { week: 1, module: 'Asset Free, Debt Free', path: '/portal/week-1/asset-free-education', name: 'Asset Free, Debt Free' },
  { week: 1, module: 'Time Kills Deals', path: '/portal/week-1/time-kills-deals', name: 'Time Kills Deals' },
  { week: 1, module: 'EBITDA Explained', path: '/portal/week-1/ebitda-course', name: 'EBITDA Explained' },
  
  // Week 2 - Deal Readiness
  { week: 2, module: 'Data Room', path: '/portal/week-2/data-room', name: 'Data Room' },
  { week: 2, module: 'Asset Workshop', path: '/portal/week-2/asset-workshop', name: 'Asset Workshop' },
  { week: 2, module: 'HoldCo Structure', path: '/portal/week-2/holdco-structure', name: 'HoldCo Structure' },
  { week: 2, module: 'Add Backs', path: '/portal/week-2/quick-wins', name: 'Add Backs' },
  { week: 2, module: 'Debt & Interest Payments', path: '/portal/week-2/debt-interest', name: 'Debt & Interest Payments' },
  { week: 2, module: 'Seller Earnouts & Performance Multipliers', path: '/portal/week-2/earnouts-multipliers', name: 'Earnouts & Multipliers' },
  { week: 2, module: 'Post-Closing Reality', path: '/portal/week-2/post-closing-reality', name: 'Post-Closing Reality' },
  
  // Week 3 - Performance Readiness
  { week: 3, module: 'EBITDA Calculator', path: '/portal/week-3/ebitda-calculator', name: 'EBITDA Calculator' },
  { week: 3, module: 'Industry Multipliers', path: '/portal/week-3/industry-multipliers', name: 'Industry Multipliers' },
  { week: 3, module: 'Scenario Planning', path: '/portal/week-3/scenarios', name: 'Scenario Planning' },
  { week: 3, module: 'Management Scorecard', path: '/portal/week-3/scorecard', name: 'Management Scorecard' },
  { week: 3, module: 'Top Performers', path: '/portal/week-3/top-performers', name: 'Top Performers' },
  { week: 3, module: 'Business Scorecard', path: '/portal/week-3/business-scorecard', name: 'Business Scorecard' },
  { week: 3, module: 'Deal Killers Diagnostic', path: '/portal/week-3/deal-killers', name: 'Deal Killers Diagnostic' },
  
  // Week 4 - Final Readiness
  { week: 4, module: 'Due Diligence Checklist', path: '/portal/week-4/dd-checklist', name: 'Due Diligence Checklist' },
  { week: 4, module: 'LOI Review', path: '/portal/week-4/loi-review', name: 'LOI Review' },
  { week: 4, module: 'Final Report', path: '/portal/week-4/final-report', name: 'Final Report' },
  { week: 4, module: 'Discovery Interview', path: '/portal/week-4/discovery-interview', name: 'Discovery Interview' },
  { week: 4, module: 'Strategy Doc Builder', path: '/portal/week-4/value-builder', name: 'Strategy Doc Builder' },
  { week: 4, module: 'KPIs and OKRs', path: '/portal/week-4/kpis-okrs', name: 'KPIs and OKRs' }
];

interface CourseNavigationFooterProps {
  currentModulePath: string;
  onComplete?: () => void;
}

export function CourseNavigationFooter({ currentModulePath, onComplete }: CourseNavigationFooterProps) {
  const navigate = useNavigate();
  const { markModuleComplete } = useProgress();
  const { toast } = useToast();
  
  // Find current module index
  const currentIndex = COURSE_PROGRESSION.findIndex(m => m.path === currentModulePath);
  
  // Get previous and next modules
  const previousModule = currentIndex > 0 ? COURSE_PROGRESSION[currentIndex - 1] : null;
  const nextModule = currentIndex < COURSE_PROGRESSION.length - 1 ? COURSE_PROGRESSION[currentIndex + 1] : null;
  const currentModule = COURSE_PROGRESSION[currentIndex];
  
  // Calculate module position within week
  const weekModules = COURSE_PROGRESSION.filter(m => m.week === currentModule?.week);
  const moduleInWeek = weekModules.findIndex(m => m.path === currentModulePath) + 1;
  const totalInWeek = weekModules.length;
  
  const handleComplete = async () => {
    if (currentModule) {
      try {
        // Track completion
        await markModuleComplete(currentModule.name, currentModule.week);
        
        if (onComplete) {
          onComplete();
        }
        
        toast({
          title: "Module Completed!",
          description: `You've completed ${currentModule.module}.`,
        });
        
        // Navigate to next module
        if (nextModule) {
          navigate(nextModule.path);
        } else {
          // Last module - go to dashboard
          navigate('/portal');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to mark module as complete.",
          variant: "destructive",
        });
      }
    }
  };
  
  const isLastModule = currentIndex === COURSE_PROGRESSION.length - 1;
  
  if (currentIndex === -1) {
    // Module not found in progression
    return null;
  }
  
  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <div className="flex-1">
          {previousModule && (
            <Button
              variant="outline"
              onClick={() => navigate(previousModule.path)}
              className="group"
            >
              <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Previous: {previousModule.name}
            </Button>
          )}
        </div>
        
        {/* Progress Indicator */}
        <div className="flex-1 text-center">
          <p className="text-sm text-muted-foreground">
            Week {currentModule?.week} • Module {moduleInWeek} of {totalInWeek}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Overall Progress: {currentIndex + 1} of {COURSE_PROGRESSION.length}
          </p>
        </div>
        
        {/* Next/Complete Button */}
        <div className="flex-1 flex justify-end">
          {isLastModule ? (
            <Button
              onClick={handleComplete}
              className="bg-success text-success-foreground hover:bg-success/90 group"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Program
            </Button>
          ) : nextModule ? (
            <Button
              onClick={handleComplete}
              className="group"
            >
              Next: {nextModule.name}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
