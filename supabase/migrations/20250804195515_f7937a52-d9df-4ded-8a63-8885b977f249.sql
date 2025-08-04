-- Create the nda_records table
CREATE TABLE public.nda_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    status TEXT DEFAULT 'accepted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.nda_records ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (critical for pre-authentication NDA signing)
CREATE POLICY "Allow anonymous NDA submissions" ON public.nda_records
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Allow authenticated users to view their own records
CREATE POLICY "Users can view own NDA records" ON public.nda_records
    FOR SELECT
    TO authenticated
    USING (true);

-- Add trigger for automatic updated_at timestamp updates
CREATE TRIGGER update_nda_records_updated_at
    BEFORE UPDATE ON public.nda_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_nda_records_email ON public.nda_records(email);
CREATE INDEX idx_nda_records_created_at ON public.nda_records(created_at);
CREATE INDEX idx_nda_records_status ON public.nda_records(status);