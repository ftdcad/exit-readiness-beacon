import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FinancialAssessment {
  id: string;
  company_id: string;
  revenue: number | null;
  net_income: number | null;
  current_ebitda: number | null;
  adjusted_ebitda: number | null;
  ebitda_margin: number | null;
  pe_readiness_score: number;
  assessment_status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface AddBackCategory {
  id: string;
  assessment_id: string;
  category: string;
  description: string | null;
  amount: number;
  is_applied: boolean;
  created_at: string;
}

export interface IndustryBenchmark {
  id: string;
  industry: string;
  multiple_low: number;
  multiple_mid: number;
  multiple_high: number;
  margin_excellent: number;
  margin_good: number;
  margin_fair: number;
  created_at: string;
}

export const useFinancialAssessment = (companyId: string) => {
  return useQuery({
    queryKey: ['financial-assessment', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_assessments')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();
      
      if (error) throw error;
      return data as FinancialAssessment | null;
    },
    enabled: !!companyId,
  });
};

export const useAddBackCategories = (assessmentId: string) => {
  return useQuery({
    queryKey: ['add-back-categories', assessmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('add_back_categories')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('category');
      
      if (error) throw error;
      return data as AddBackCategory[];
    },
    enabled: !!assessmentId,
  });
};

export const useIndustryBenchmarks = () => {
  return useQuery({
    queryKey: ['industry-benchmarks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industry_benchmarks')
        .select('*')
        .order('industry');
      
      if (error) throw error;
      return data as IndustryBenchmark[];
    },
  });
};

export const useCreateFinancialAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assessment: Partial<FinancialAssessment> & { company_id: string }) => {
      const { data, error } = await supabase
        .from('financial_assessments')
        .insert(assessment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assessment', data.company_id] });
      toast({
        title: "Success",
        description: "Financial assessment created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create financial assessment: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateFinancialAssessment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FinancialAssessment> }) => {
      const { data, error } = await supabase
        .from('financial_assessments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financial-assessment', data.company_id] });
      toast({
        title: "Success",
        description: "Financial assessment updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update financial assessment: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAddBackCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, amount, isApplied }: { id: string; amount: number; isApplied: boolean }) => {
      const { data, error } = await supabase
        .from('add_back_categories')
        .update({ amount, is_applied: isApplied })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['add-back-categories', data.assessment_id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update add-back category: " + error.message,
        variant: "destructive",
      });
    },
  });
};

// Calculate PE Readiness Score
export const calculatePEScore = (
  ebitdaMargin: number,
  hasDocuments: { taxReturns: boolean; pAndLs: boolean; balanceSheets: boolean; contracts: boolean },
  addBacks: AddBackCategory[],
  healthMetrics: { concentrationUnder30: boolean; recurringRevenue: boolean; cleanBooks: boolean; ownerNotPrimary: boolean }
): number => {
  let score = 0;

  // EBITDA Margin (40 points max)
  if (ebitdaMargin >= 0.20) score += 40;
  else if (ebitdaMargin >= 0.15) score += 30;
  else if (ebitdaMargin >= 0.10) score += 20;
  else if (ebitdaMargin >= 0.05) score += 10;

  // Documentation (20 points max)
  const docs = Object.values(hasDocuments);
  score += docs.filter(Boolean).length * 5;

  // Add-back potential (20 points max)
  const appliedAddBacks = addBacks.filter(ab => ab.is_applied);
  const addBackScore = Math.min(appliedAddBacks.length * 5, 20);
  score += addBackScore;

  // Business health (20 points max)
  const health = Object.values(healthMetrics);
  score += health.filter(Boolean).length * 5;

  return Math.min(score, 100);
};

// Calculate industry multiple based on margin and industry
export const calculateValuationMultiple = (
  ebitdaMargin: number,
  industry: string,
  benchmarks: IndustryBenchmark[]
): number => {
  const benchmark = benchmarks.find(b => b.industry === industry);
  if (!benchmark) return 4.0; // Default multiple

  if (ebitdaMargin >= benchmark.margin_excellent) return benchmark.multiple_high;
  if (ebitdaMargin >= benchmark.margin_good) return benchmark.multiple_mid;
  return benchmark.multiple_low;
};