-- Main folder structure table
CREATE TABLE data_room_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  document_types TEXT[],
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table with versioning
CREATE TABLE data_room_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  document_type TEXT,
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  document_date DATE,
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES data_room_documents(id),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking table
CREATE TABLE data_room_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  total_required INTEGER DEFAULT 0,
  total_uploaded INTEGER DEFAULT 0,
  last_upload_date TIMESTAMP WITH TIME ZONE,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category, subcategory)
);

-- Overall readiness score
CREATE TABLE data_room_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  overall_score TEXT DEFAULT 'F', -- A, B, C, D, F
  total_documents INTEGER DEFAULT 0,
  required_documents INTEGER DEFAULT 0,
  missing_critical TEXT[],
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE data_room_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_readiness ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own documents" ON data_room_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view structure" ON data_room_structure
  FOR SELECT USING (true);

CREATE POLICY "Users view own progress" ON data_room_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own readiness" ON data_room_readiness
  FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert folder structure
INSERT INTO data_room_structure (category, subcategory, document_types, is_required, sort_order) VALUES
-- Corporate Documents
('Corporate Documents', 'Formation and Governance', ARRAY['Certificate of Incorporation', 'Bylaws', 'Operating Agreement', 'Board Minutes'], true, 10),
('Corporate Documents', 'Equity', ARRAY['Cap Table', 'Stock Option Plan', 'Shareholder Agreements', 'Previous Funding Rounds'], true, 11),

-- Financials
('Financials', 'Financial Statements', ARRAY['Balance Sheet', 'Income Statement', 'Cash Flow Statement'], true, 20),
('Financials', 'Forecasts & Budgets', ARRAY['Financial Projections', 'Annual Budget', 'Long-term Plan'], false, 21),
('Financials', 'Audits & Taxes', ARRAY['Audit Reports', 'Tax Returns', 'Financial Reviews'], true, 22),

-- Legal
('Legal', 'Contracts', ARRAY['Customer Agreements', 'Supplier Agreements', 'Partnership Agreements', 'Licenses'], true, 30),
('Legal', 'Intellectual Property', ARRAY['Patents', 'Trademarks', 'Copyrights', 'IP Licenses'], false, 31),
('Legal', 'Compliance', ARRAY['Regulatory Reports', 'Environmental Compliance', 'Legal Opinions'], false, 32),
('Legal', 'Real Estate', ARRAY['Leases', 'Property Titles'], false, 33),
('Legal', 'Litigation', ARRAY['Pending Litigation', 'Dispute Documentation'], false, 34),

-- Operations
('Operations', 'Production', ARRAY['Production Reports', 'Inventory Reports'], false, 40),
('Operations', 'Supply Chain', ARRAY['Supply Chain Documents', 'Vendor Agreements'], true, 41),
('Operations', 'Health and Safety', ARRAY['Safety Protocols', 'Compliance Certificates'], false, 42),

-- Marketing & Sales
('Marketing & Sales', 'Market Analysis', ARRAY['Industry Analysis', 'Market Share Reports'], false, 50),
('Marketing & Sales', 'Competitive Analysis', ARRAY['Competitive Reports', 'Positioning Documents'], false, 51),
('Marketing & Sales', 'Sales & Customers', ARRAY['Sales Strategy', 'Customer List', 'Customer Contracts', 'Pipeline Report'], true, 52),
('Marketing & Sales', 'Marketing', ARRAY['Marketing Plans', 'Marketing Assets'], false, 53),

-- Human Resources
('Human Resources', 'Employee Information', ARRAY['Employee Contracts', 'Compensation Plans', 'Benefits Summary'], true, 60),
('Human Resources', 'Key Personnel', ARRAY['Executive CVs', 'Org Chart'], true, 61);