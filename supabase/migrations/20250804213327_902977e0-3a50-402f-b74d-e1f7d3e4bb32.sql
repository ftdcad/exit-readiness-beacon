-- Add company_website column to contact_inquiries table
ALTER TABLE public.contact_inquiries 
ADD COLUMN company_website text;