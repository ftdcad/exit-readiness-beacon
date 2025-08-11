
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getModuleCountByWeek } from '@/config/moduleConfig';

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
  const { user, profile } = useAuth();

  const isWeekCompleted = (weekNumber: number, weekModules: ModuleProgress[]): boolean => {
    const totalCount = getModuleCountByWeek(weekNumber);
    const completedCount = weekModules.filter(m => m.completed_at).length;
    return completedCount >= totalCount;
  };

  const calculateWeekUnlockStatus = (weekNumber: number, allProgress: ModuleProgress[]): boolean => {
    // Week 1 is always unlocked
    if (weekNumber === 1) {
      return true;
    }

    // Admins have access to all weeks
    if (profile?.role?.name === 'admin') {
      return true;
    }

    // For other weeks, check if the previous week is completed
    const previousWeekNumber = weekNumber - 1;
    const previousWeekModules = allProgress.filter(p => p.week_number === previousWeekNumber);
    
    return isWeekCompleted(previousWeekNumber, previousWeekModules);
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
      
      // Calculate week progress and unlock status using proper logic
      const weekProgressData: WeekProgress[] = [];
      
      for (let week = 1; week <= 4; week++) {
        const weekModules = (data || []).filter(p => p.week_number === week);
        const completedCount = weekModules.filter(m => m.completed_at).length;
        const totalCount = getModuleCountByWeek(week);
        const progressPercent = Math.round((completedCount / totalCount) * 100);
        
        // Calculate unlock status based on previous week completion and user role
        const isUnlocked = calculateWeekUnlockStatus(week, data || []);
        
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
  }, [user, profile]); // Add profile dependency to re-fetch when role is loaded

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
