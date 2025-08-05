-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Enable anonymous insert for contact inquiries" ON public.contact_inquiries;

-- Create a new policy that explicitly allows anonymous (unauthenticated) users
CREATE POLICY "Allow anonymous contact inquiry submissions"
ON public.contact_inquiries
FOR INSERT
TO anon
WITH CHECK (true);

-- Also ensure authenticated users can still insert
CREATE POLICY "Allow authenticated contact inquiry submissions" 
ON public.contact_inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);