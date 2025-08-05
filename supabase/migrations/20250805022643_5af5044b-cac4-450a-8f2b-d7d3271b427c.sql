-- Enable Row Level Security on contact_inquiries table
-- The policies already exist, we just need to activate RLS enforcement
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;