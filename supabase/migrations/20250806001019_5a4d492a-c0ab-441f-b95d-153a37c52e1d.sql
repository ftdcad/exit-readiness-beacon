-- Grant table-level permissions to anon role for NDA submissions
GRANT INSERT ON public.nda_records TO anon;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON public.nda_records TO authenticated;