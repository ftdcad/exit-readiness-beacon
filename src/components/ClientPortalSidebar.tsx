import React from 'react';
import { 
  BookOpen,
  Calculator,
  Target,
  FileCheck,
  Crown,
  TrendingUp,
  Lock,
  CheckCircle
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const weeks = [
  {
    number: 1,
    title: 'Foundation & Education',
    icon: BookOpen,
    modules: [
      { name: 'Interactive Glossary', path: '/portal/week-1/glossary' },
      { name: 'Know Your Buyer', path: '/portal/week-1/know-your-buyer' },
      { name: 'EBITDA Mastery', path: '/portal/week-1/ebitda-course' },
      { name: 'Asset Workshop', path: '/portal/week-1/asset-workshop' },
      { name: 'Quick Wins', path: '/portal/week-1/quick-wins' }
    ]
  },
  {
    number: 2,
    title: 'Deal Readiness',
    icon: Calculator,
    modules: [
      { name: 'Executive Discovery Interview', path: '/portal/week-2/assessment' },
      { name: 'Strategy Builder', path: '/portal/week-2/value-builder' },
      { name: 'KPIs and OKRs', path: '/portal/week-2/metrics' },
      { name: 'EBITDA Calculator', path: '/portal/week-2/calculator' },
      { name: 'Industry Multiples', path: '/portal/week-2/multiples' },
      { name: 'Scenario Planning', path: '/portal/week-2/scenarios' }
    ]
  },
  {
    number: 3,
    title: 'Performance Readiness',
    icon: TrendingUp,
    modules: [
      { name: 'KPI Dashboard', path: '/portal/week-3/kpis' },
      { name: 'PE Benchmarks', path: '/portal/week-3/benchmarks' },
      { name: 'Management Scorecard', path: '/portal/week-3/scorecard' }
    ]
  },
  {
    number: 4,
    title: 'Final Readiness',
    icon: FileCheck,
    modules: [
      { name: 'Due Diligence Checklist', path: '/portal/week-4/dd-checklist' },
      { name: 'LOI Review', path: '/portal/week-4/loi-review' },
      { name: 'Final Report', path: '/portal/week-4/final-report' }
    ]
  }
];

export function ClientPortalSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile } = useAuth();
  const { getUnlockedWeeks, getWeekProgress, isModuleCompleted } = useProgress();
  const collapsed = state === 'collapsed';

  const unlockedWeeks = getUnlockedWeeks();
  const isWeekUnlocked = (weekNumber: number) => unlockedWeeks.includes(weekNumber);
  const isActive = (path: string) => location.pathname === path;

  const getNavClasses = (path: string, isLocked: boolean = false) => {
    if (isLocked) {
      return "text-muted-foreground/50 cursor-not-allowed opacity-50";
    }
    return isActive(path) 
      ? "bg-accent/10 text-accent font-medium border-r-2 border-accent" 
      : "hover:bg-muted/50 text-foreground";
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-background">
        {/* Welcome Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-primary flex items-center gap-2">
            <Crown className="h-4 w-4" />
            {!collapsed && "Your Journey"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {!collapsed && (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                <p>Welcome to your exclusive Deal Room</p>
                <p className="mt-1 font-medium text-primary">4-Week Exit Readiness Program</p>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Weekly Modules */}
        {weeks.map((week) => {
          const weekUnlocked = isWeekUnlocked(week.number);
          const weekProgress = getWeekProgress(week.number);
          const WeekIcon = week.icon;
          
          return (
            <SidebarGroup key={week.number}>
              <SidebarGroupLabel className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WeekIcon className="h-4 w-4" />
                  {!collapsed && (
                    <>
                      <span>Week {week.number}</span>
                      {!weekUnlocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-1">
                    {weekProgress && (
                      <Badge variant="outline" className="text-xs">
                        {weekProgress.completedModules}/{weekProgress.totalModules}
                      </Badge>
                    )}
                    {weekUnlocked && (
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                )}
              </SidebarGroupLabel>
              
              {!collapsed && (
                <SidebarGroupContent>
                  <div className="text-xs text-foreground font-medium px-3 mb-2">
                    {week.title}
                  </div>
                  <SidebarMenu>
                    {week.modules.map((module) => {
                      const moduleCompleted = isModuleCompleted(module.name, week.number);
                      
                      return (
                        <SidebarMenuItem key={module.name}>
                          <SidebarMenuButton asChild>
                            {weekUnlocked ? (
                              <NavLink 
                                to={module.path} 
                                className={getNavClasses(module.path)}
                              >
                                <span className="text-sm">{module.name}</span>
                                {moduleCompleted ? (
                                  <CheckCircle className="h-4 w-4 ml-auto text-primary" />
                                ) : isActive(module.path) ? (
                                  <div className="h-2 w-2 rounded-full bg-primary ml-auto" />
                                ) : null}
                              </NavLink>
                            ) : (
                              <div className={getNavClasses(module.path, true)}>
                                <span className="text-sm">{module.name}</span>
                                <Lock className="h-3 w-3 ml-auto" />
                              </div>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                  
                  {/* Progress guidance for non-paying users */}
                  {!collapsed && !weekUnlocked && week.number > 1 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Recommended Path: Week {week.number - 1} first</span>
                      </div>
                      {weekProgress && (
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className="bg-primary h-1 rounded-full transition-all" 
                            style={{ width: `${weekProgress.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}