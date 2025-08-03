-- Week 1: Financial Assessment Database Foundation

-- Financial assessments table to store detailed financial data per company
CREATE TABLE public.financial_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  revenue BIGINT,
  net_income BIGINT,
  current_ebitda BIGINT,
  adjusted_ebitda BIGINT,
  ebitda_margin DECIMAL(5,4),
  pe_readiness_score INTEGER DEFAULT 0,
  assessment_status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Industry benchmarks for scoring and multiples
CREATE TABLE public.industry_benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  multiple_low DECIMAL(3,1) NOT NULL,
  multiple_mid DECIMAL(3,1) NOT NULL,
  multiple_high DECIMAL(3,1) NOT NULL,
  margin_excellent DECIMAL(3,2) NOT NULL,
  margin_good DECIMAL(3,2) NOT NULL,
  margin_fair DECIMAL(3,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add-back categories for standardized adjustments
CREATE TABLE public.add_back_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.financial_assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount BIGINT DEFAULT 0,
  is_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Assessment sessions for multiple scenarios
CREATE TABLE public.assessment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.financial_assessments(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL DEFAULT 'Default',
  scenario_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.financial_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.add_back_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for financial_assessments
CREATE POLICY "Admins can manage financial assessments" 
ON public.financial_assessments 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for industry_benchmarks
CREATE POLICY "Admins can view industry benchmarks" 
ON public.industry_benchmarks 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage industry benchmarks" 
ON public.industry_benchmarks 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for add_back_categories
CREATE POLICY "Admins can manage add-back categories" 
ON public.add_back_categories 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS Policies for assessment_sessions
CREATE POLICY "Admins can manage assessment sessions" 
ON public.assessment_sessions 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add updated_at trigger for financial_assessments
CREATE TRIGGER update_financial_assessments_updated_at
BEFORE UPDATE ON public.financial_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add updated_at trigger for assessment_sessions
CREATE TRIGGER update_assessment_sessions_updated_at
BEFORE UPDATE ON public.assessment_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default industry benchmarks
INSERT INTO public.industry_benchmarks (industry, multiple_low, multiple_mid, multiple_high, margin_excellent, margin_good, margin_fair) VALUES
('HVAC', 3.0, 4.5, 6.0, 0.20, 0.15, 0.10),
('Plumbing', 3.5, 5.0, 6.5, 0.22, 0.17, 0.12),
('IT Services', 4.0, 6.0, 8.0, 0.25, 0.18, 0.12),
('Manufacturing', 3.2, 4.8, 6.2, 0.18, 0.13, 0.08),
('Professional Services', 3.8, 5.5, 7.0, 0.23, 0.16, 0.10),
('Healthcare', 4.5, 6.5, 8.5, 0.28, 0.20, 0.15),
('Construction', 2.8, 4.2, 5.5, 0.16, 0.11, 0.07),
('Technology', 5.0, 7.5, 10.0, 0.30, 0.22, 0.15);