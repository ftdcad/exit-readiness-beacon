-- Drop the current policy and create a more explicit one
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;

-- Create explicit policy for anonymous users (anon role)
CREATE POLICY "Anonymous users can submit contact inquiries" 
ON public.contact_inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);