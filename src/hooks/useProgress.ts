import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ModuleProgress {
  module_name: string;
  week_number: number;
  completed_at: string | null;
  created_at: string;
}

interface WeekProgress {
  weekNumber: number;
  completedModules: number;
  totalModules: number;
  isUnlocked: boolean;
  progress: number; // 0-100
}

export const useProgress = () => {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  const [weekProgress, setWeekProgress] = useState<WeekProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Module counts per week (matches sidebar data)
  const weekModuleCounts = {
    1: 5, // Interactive Glossary, Know Your Buyer, EBITDA Mastery, Asset Workshop, Quick Wins
    2: 6, // Exit Readiness Assessment, 90-Day Value Builder, PE-Ready Metrics, EBITDA Impact Calculator, Industry Multiple Finder, Exit Scenario Planner
    3: 3, // KPI Dashboard, PE Benchmarks, Management Scorecard
    4: 3  // Due Diligence Checklist, LOI Review, Final Report
  };

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setWeekProgress([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('client_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number, created_at');

      if (error) throw error;

      setProgress(data || []);
      
      // Calculate week progress and unlock status
      const weekProgressData: WeekProgress[] = [];
      
      for (let week = 1; week <= 4; week++) {
        const weekModules = (data || []).filter(p => p.week_number === week);
        const completedCount = weekModules.filter(m => m.completed_at).length;
        const totalCount = weekModuleCounts[week as keyof typeof weekModuleCounts];
        const progressPercent = Math.round((completedCount / totalCount) * 100);
        
        // Unlock logic:
        // Week 1 is always unlocked
        // Week N is unlocked if Week N-1 has at least 80% completion (4/5 for week 1)
        let isUnlocked = week === 1;
        if (week > 1) {
          const prevWeek = weekProgressData[week - 2];
          isUnlocked = prevWeek ? prevWeek.progress >= 80 : false;
        }
        
        weekProgressData.push({
          weekNumber: week,
          completedModules: completedCount,
          totalModules: totalCount,
          isUnlocked,
          progress: progressPercent
        });
      }
      
      setWeekProgress(weekProgressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
      setWeekProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const markModuleComplete = async (moduleName: string, weekNumber: number) => {
    if (!user) return;

    try {
      // Check if progress record already exists
      const { data: existing } = await supabase
        .from('client_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_name', moduleName)
        .eq('week_number', weekNumber)
        .maybeSingle();

      if (existing) {
        // Update existing record to mark as complete
        const { error } = await supabase
          .from('client_progress')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new progress record
        const { error } = await supabase
          .from('client_progress')
          .insert({
            user_id: user.id,
            module_name: moduleName,
            week_number: weekNumber,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Refresh progress data
      await fetchProgress();
    } catch (error) {
      console.error('Error marking module complete:', error);
    }
  };

  const isModuleCompleted = (moduleName: string, weekNumber: number): boolean => {
    return progress.some(p => 
      p.module_name === moduleName && 
      p.week_number === weekNumber && 
      p.completed_at !== null
    );
  };

  const getUnlockedWeeks = (): number[] => {
    return weekProgress.filter(wp => wp.isUnlocked).map(wp => wp.weekNumber);
  };

  const getWeekProgress = (weekNumber: number): WeekProgress | undefined => {
    return weekProgress.find(wp => wp.weekNumber === weekNumber);
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return {
    progress,
    weekProgress,
    loading,
    markModuleComplete,
    isModuleCompleted,
    getUnlockedWeeks,
    getWeekProgress,
    refetchProgress: fetchProgress
  };
};