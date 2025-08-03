import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role_id: string | null;
  created_at: string;
  updated_at: string;
  role?: {
    id: string;
    name: string;
    permissions: any;
  };
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          role:user_roles(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    },
  });
};

export const useProfileStats = () => {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      const { data: totalUsers, error: totalError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { data: adminUsers, error: adminError } = await supabase
        .from('profiles')
        .select(`
          *,
          role:user_roles!inner(*)
        `, { count: 'exact', head: true })
        .eq('user_roles.name', 'admin');

      if (totalError) throw totalError;
      if (adminError) throw adminError;

      return {
        total: totalUsers?.length || 0,
        admins: adminUsers?.length || 0,
      };
    },
  });
};