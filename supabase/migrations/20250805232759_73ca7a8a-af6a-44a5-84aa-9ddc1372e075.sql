-- Enable RLS on the table
ALTER TABLE public.nda_records ENABLE ROW LEVEL SECURITY;

-- Drop the existing incorrect policy 
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.nda_records;

-- Create correct INSERT policy for anonymous users
CREATE POLICY "Enable insert access for anonymous users" ON public.nda_records
FOR INSERT 
TO anon
WITH CHECK (true);

-- Keep the SELECT policy for authenticated reads
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.nda_records;
CREATE POLICY "Enable read access for authenticated users" ON public.nda_records
FOR SELECT 
TO authenticated
USING (true);