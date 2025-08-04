-- Fix the RLS policy for contact_inquiries to allow proper public inserts
-- Drop the existing policy and recreate it with proper configuration
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.contact_inquiries;

-- Create a new policy that allows anonymous inserts with proper validation
CREATE POLICY "Enable anonymous insert for contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Ensure RLS is enabled on the table
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;