-- Drop existing insert policy and create one that works for all anonymous users
DROP POLICY IF EXISTS "Allow anonymous inserts" ON contact_inquiries;

-- Create policy that explicitly allows anonymous inserts for all roles
CREATE POLICY "contact_inquiries_anonymous_insert" 
ON public.contact_inquiries 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Also grant explicit insert permission to anon role
GRANT INSERT ON public.contact_inquiries TO anon;