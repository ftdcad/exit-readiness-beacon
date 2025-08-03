import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityLogEntry {
  id: string;
  action_type: string;
  details: string | null;
  action_metadata: any;
  user_id: string | null;
  company_id: string | null;
  created_at: string;
}

export const useActivityLog = (filters?: { companyId?: string; userId?: string }) => {
  return useQuery({
    queryKey: ['activity-log', filters],
    queryFn: async () => {
      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (filters?.companyId) {
        query = query.eq('company_id', filters.companyId);
      }
      
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as ActivityLogEntry[];
    },
  });
};