-- Temporarily disable RLS to test
ALTER TABLE public.contact_inquiries DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Drop any existing insert policies
DROP POLICY IF EXISTS "contact_inquiries_insert_policy" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow anonymous contact submission" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow any insert" ON contact_inquiries;

-- Create proper policy for anonymous inserts
CREATE POLICY "Allow anonymous inserts" 
ON public.contact_inquiries 
FOR INSERT 
TO public
WITH CHECK (true);