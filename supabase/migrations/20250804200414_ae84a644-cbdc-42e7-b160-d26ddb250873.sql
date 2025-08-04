-- Fix the RLS policy for anonymous NDA submissions
-- First, drop the existing policy
DROP POLICY IF EXISTS "Allow anonymous NDA submissions" ON public.nda_records;

-- Create a more permissive policy for NDA submissions
-- This allows any user (authenticated or anonymous) to insert NDA records
CREATE POLICY "Enable insert access for all users" ON public.nda_records
    FOR INSERT 
    WITH CHECK (true);

-- Also allow authenticated users to view all NDA records (for admin purposes)
DROP POLICY IF EXISTS "Users can view own NDA records" ON public.nda_records;
CREATE POLICY "Enable read access for authenticated users" ON public.nda_records
    FOR SELECT
    TO authenticated
    USING (true);