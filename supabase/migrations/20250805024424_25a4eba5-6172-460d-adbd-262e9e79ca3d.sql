-- Clean up duplicate INSERT policies and create one that definitely works
DROP POLICY IF EXISTS "Allow anonymous contact submission" ON contact_inquiries;
DROP POLICY IF EXISTS "Allow any insert" ON contact_inquiries;

-- Create a single, clear policy for anonymous contact form submissions  
CREATE POLICY "contact_inquiries_insert_policy" 
ON public.contact_inquiries 
FOR INSERT 
WITH CHECK (true);