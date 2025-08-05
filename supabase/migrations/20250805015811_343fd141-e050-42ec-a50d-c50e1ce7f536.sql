-- Drop the duplicate INSERT policies that might be conflicting
DROP POLICY IF EXISTS "Allow anonymous contact inquiry submissions" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow authenticated contact inquiry submissions" ON public.contact_inquiries;

-- Create a single, clear INSERT policy for public access
CREATE POLICY "Public can submit contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);