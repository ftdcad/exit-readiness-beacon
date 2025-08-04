-- Add missing columns to contact_inquiries table
ALTER TABLE public.contact_inquiries 
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS employee_count text,
ADD COLUMN IF NOT EXISTS revenue_2025 text,
ADD COLUMN IF NOT EXISTS revenue_2024 text,
ADD COLUMN IF NOT EXISTS revenue_2023 text,
ADD COLUMN IF NOT EXISTS revenue_2022 text,
ADD COLUMN IF NOT EXISTS investment_type text,
ADD COLUMN IF NOT EXISTS entity_type text,
ADD COLUMN IF NOT EXISTS ownership_type text,
ADD COLUMN IF NOT EXISTS ownership_structure jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pnl_availability text,
ADD COLUMN IF NOT EXISTS tax_returns_availability text,
ADD COLUMN IF NOT EXISTS balance_sheets_availability text,
ADD COLUMN IF NOT EXISTS exit_type text,
ADD COLUMN IF NOT EXISTS current_challenges text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS preferred_contact text,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS how_did_you_hear text,
ADD COLUMN IF NOT EXISTS add_backs jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ip_address inet,
ADD COLUMN IF NOT EXISTS nda_record_id uuid;

-- Create assessment_access table
CREATE TABLE IF NOT EXISTS public.assessment_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_inquiry_id uuid REFERENCES public.contact_inquiries(id) ON DELETE CASCADE,
  nda_record_id uuid REFERENCES public.nda_records(id) ON DELETE SET NULL,
  access_granted_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on assessment_access table
ALTER TABLE public.assessment_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for assessment_access table
CREATE POLICY "Admins can manage assessment access" 
ON public.assessment_access 
FOR ALL 
USING (is_admin(auth.uid()));

-- Allow public insert for assessment access (needed for the form submission)
CREATE POLICY "Public can insert assessment access" 
ON public.assessment_access 
FOR INSERT 
WITH CHECK (true);