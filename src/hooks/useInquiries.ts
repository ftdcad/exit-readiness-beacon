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
      console.log('Starting delete process for company:', inquiryId);
      
      // Delete in EXACT order to avoid foreign key violations:
      
      // 1. First delete all activity_log entries for this company
      console.log('Step 1: Checking activity_log entries...');
      const { data: activities } = await supabase
        .from('activity_log')
        .select('*')
        .eq('company_id', inquiryId);
      console.log('Found activities to delete:', activities?.length || 0, activities);
      
      console.log('Step 1: Deleting activity_log entries...');
      const { error: activityError } = await supabase
        .from('activity_log')
        .delete()
        .eq('company_id', inquiryId);
      console.log('Activity log delete result:', activityError);
      if (activityError) throw new Error(`Failed to delete activity_log: ${activityError.message}`);
      
      // 2. Delete company_comments
      console.log('Step 2: Deleting company_comments...');
      const { error: commentsError } = await supabase
        .from('company_comments')
        .delete()
        .eq('company_id', inquiryId);
      console.log('Comments delete result:', commentsError);
      if (commentsError) throw new Error(`Failed to delete company_comments: ${commentsError.message}`);
      
      // 3. Delete assessment_access records
      console.log('Step 3: Deleting assessment_access...');
      const { error: accessError } = await supabase
        .from('assessment_access')
        .delete()
        .eq('contact_inquiry_id', inquiryId);
      console.log('Assessment access delete result:', accessError);
      if (accessError) throw new Error(`Failed to delete assessment_access: ${accessError.message}`);
      
      // 4. Delete add_back_categories (via financial_assessments)
      console.log('Step 4: Finding financial assessments...');
      const { data: assessments, error: assessmentsSelectError } = await supabase
        .from('financial_assessments')
        .select('id')
        .eq('company_id', inquiryId);
      console.log('Found assessments:', assessments?.length || 0, assessments);
      if (assessmentsSelectError) throw new Error(`Failed to select assessments: ${assessmentsSelectError.message}`);

      if (assessments?.length) {
        console.log('Step 4: Deleting add_back_categories...');
        const assessmentIds = assessments.map(a => a.id);
        const { error: addBacksError } = await supabase
          .from('add_back_categories')
          .delete()
          .in('assessment_id', assessmentIds);
        console.log('Add backs delete result:', addBacksError);
        if (addBacksError) throw new Error(`Failed to delete add_back_categories: ${addBacksError.message}`);
      }

      // 5. Delete financial_assessments
      console.log('Step 5: Deleting financial_assessments...');
      const { error: financialError } = await supabase
        .from('financial_assessments')
        .delete()
        .eq('company_id', inquiryId);
      console.log('Financial assessments delete result:', financialError);
      if (financialError) throw new Error(`Failed to delete financial_assessments: ${financialError.message}`);
      
      // 6. Finally delete the main contact_inquiries record
      console.log('Step 6: Deleting main contact_inquiries record...');
      const { error: mainError } = await supabase
        .from('contact_inquiries')
        .delete()
        .eq('id', inquiryId);
      console.log('Main record delete result:', mainError);
      if (mainError) throw new Error(`Failed to delete contact_inquiries: ${mainError.message}`);

      console.log('Delete process completed successfully for company:', inquiryId);
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