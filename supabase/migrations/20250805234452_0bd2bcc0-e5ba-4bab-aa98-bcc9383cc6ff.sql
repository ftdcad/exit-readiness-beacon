-- Grant table-level permissions for NDA records
-- This fixes the 401 error by giving anon role INSERT permission
-- and authenticated role SELECT permission

GRANT INSERT ON public.nda_records TO anon;
GRANT SELECT ON public.nda_records TO authenticated;