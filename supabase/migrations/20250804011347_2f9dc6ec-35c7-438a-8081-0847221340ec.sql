-- Drop existing table if you want fresh start
DROP TABLE IF EXISTS strategy_initiatives CASCADE;

-- Main strategy document table
CREATE TABLE strategy_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Foundation
  vision_statement TEXT,
  mission_statement TEXT,
  core_values JSONB DEFAULT '[]',
  
  -- SWOT Analysis
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',
  threats JSONB DEFAULT '[]',
  
  -- Timeline & Projections
  initiatives_90_day JSONB DEFAULT '[]',
  goals_12_month JSONB DEFAULT '[]',
  goals_24_month JSONB DEFAULT '[]',
  vision_5_year TEXT,
  
  -- Financial Projections
  revenue_year1 NUMERIC,
  revenue_year2 NUMERIC,
  revenue_year3 NUMERIC,
  revenue_year4 NUMERIC,
  revenue_year5 NUMERIC,
  
  ebitda_year1 NUMERIC,
  ebitda_year2 NUMERIC,
  ebitda_year3 NUMERIC,
  ebitda_year4 NUMERIC,
  ebitda_year5 NUMERIC,
  
  -- Metadata
  last_saved TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

ALTER TABLE strategy_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own strategy docs" ON strategy_documents
  FOR ALL USING (auth.uid() = user_id);

-- Update trigger
CREATE TRIGGER update_strategy_documents_updated_at
  BEFORE UPDATE ON strategy_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();