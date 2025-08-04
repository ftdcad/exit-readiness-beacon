-- Create user financial data table for EBITDA calculator
CREATE TABLE user_financial_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source TEXT CHECK (source IN ('manual', 'extracted', 'mock')),
  revenue NUMERIC,
  cogs NUMERIC,
  opex NUMERIC,
  owner_salary NUMERIC,
  personal_vehicle NUMERIC,
  travel_meals NUMERIC,
  legal_fees NUMERIC,
  other_non_recurring NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_financial_data ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own financial data
CREATE POLICY "Users manage own financial data" ON user_financial_data
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_financial_data_updated_at
  BEFORE UPDATE ON user_financial_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();