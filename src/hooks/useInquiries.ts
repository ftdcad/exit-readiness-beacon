import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactInquiry {
  id: string;
  company_name: string;
  industry: string | null;
  annual_revenue: number | null;
  contact_name: string | null;
  contact_email: string;
  status: string;
  exit_timeline: string | null;
  assigned_to: string | null;
  admin_notes: string | null;
  created_at: string;
  source_form_version: string | null;
}

export const useInquiries = (filters?: { status?: string; industry?: string }) => {
  return useQuery({
    queryKey: ['inquiries', filters],
    queryFn: async () => {
      let query = supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.industry) {
        query = query.eq('industry', filters.industry);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as ContactInquiry[];
    },
  });
};

export const useInquiry = (id: string) => {
  return useQuery({
    queryKey: ['inquiry', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ContactInquiry;
    },
    enabled: !!id,
  });
};

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContactInquiry> }) => {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast({
        title: "Success",
        description: "Company inquiry updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update inquiry: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteInquiry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inquiryId: string) => {
      // Get company name for logging
      const { data: inquiry } = await supabase
        .from('contact_inquiries')
        .select('company_name')
        .eq('id', inquiryId)
        .single();

      // Delete related records in correct order
      // 1. Delete add_back_categories (via financial_assessments)
      const { data: assessments } = await supabase
        .from('financial_assessments')
        .select('id')
        .eq('company_id', inquiryId);

      if (assessments?.length) {
        const assessmentIds = assessments.map(a => a.id);
        await supabase
          .from('add_back_categories')
          .delete()
          .in('assessment_id', assessmentIds);
      }

      // 2. Delete financial_assessments
      await supabase
        .from('financial_assessments')
        .delete()
        .eq('company_id', inquiryId);

      // 3. Delete company_comments
      await supabase
        .from('company_comments')
        .delete()
        .eq('company_id', inquiryId);

      // 4. Delete assessment_access
      await supabase
        .from('assessment_access')
        .delete()
        .eq('contact_inquiry_id', inquiryId);

      // 5. Delete existing activity_log records for this company
      await supabase
        .from('activity_log')
        .delete()
        .eq('company_id', inquiryId);

      // 6. Delete main contact_inquiries record
      const { error } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', inquiryId);

      if (error) throw error;

      // 7. Log the successful deletion AFTER deletion is complete
      await supabase.from('activity_log').insert({
        action_type: 'company_deleted',
        details: `Successfully deleted company: ${inquiry?.company_name || 'Unknown'}`
      });

      return inquiryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['inquiry-stats'] });
      toast({
        title: "Success",
        description: "Company and all related data deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete company: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useInquiryStats = () => {
  return useQuery({
    queryKey: ['inquiry-stats'],
    queryFn: async () => {
      const { count: totalCount, error: totalError } = await supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount, error: pendingError } = await supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      const { data: revenueData, error: revenueError } = await supabase
        .from('contact_inquiries')
        .select('annual_revenue')
        .not('annual_revenue', 'is', null);

      if (totalError) throw totalError;
      if (pendingError) throw pendingError;
      if (revenueError) throw revenueError;

      const avgRevenue = revenueData?.length > 0 
        ? revenueData.reduce((sum, item) => sum + (item.annual_revenue || 0), 0) / revenueData.length 
        : 0;

      console.log('Inquiry stats:', { totalCount, pendingCount, avgRevenue });

      return {
        total: totalCount || 0,
        pending: pendingCount || 0,
        avgRevenue: Math.round(avgRevenue),
      };
    },
  });
};