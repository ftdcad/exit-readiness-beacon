-- Re-create the missing RLS policy for anonymous contact form submissions
CREATE POLICY "Allow anonymous contact submission" ON public.contact_inquiries
FOR INSERT 
WITH CHECK (true);