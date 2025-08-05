-- Test if we can insert a basic record to verify RLS policy
-- This is just a test insert that we'll delete immediately
INSERT INTO public.contact_inquiries (contact_email, company_name) 
VALUES ('test@example.com', 'Test Company');

-- Clean up the test record
DELETE FROM public.contact_inquiries WHERE contact_email = 'test@example.com' AND company_name = 'Test Company';