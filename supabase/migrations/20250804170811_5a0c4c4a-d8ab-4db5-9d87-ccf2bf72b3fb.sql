-- Industry multiplier reference table
CREATE TABLE industry_multiples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_category TEXT NOT NULL,
  industry_subcategory TEXT,
  size_band TEXT NOT NULL CHECK (size_band IN ('Small (<$1M)', 'Lower-Middle ($1-5M)', 'Middle-Market ($5M+)')),
  min_ebitda NUMERIC,
  max_ebitda NUMERIC,
  base_multiple NUMERIC NOT NULL,
  high_multiple NUMERIC NOT NULL,
  typical_margin_percent NUMERIC,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company industry profile
CREATE TABLE company_industry_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  industry_category TEXT NOT NULL,
  industry_subcategory TEXT,
  annual_revenue NUMERIC,
  ebitda NUMERIC,
  recurring_revenue_percent NUMERIC DEFAULT 0,
  customer_concentration NUMERIC DEFAULT 0,
  years_in_business INTEGER,
  growth_rate_percent NUMERIC,
  calculated_multiple NUMERIC,
  enterprise_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Valuation exports history
CREATE TABLE valuation_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_profile JSONB NOT NULL,
  valuation_data JSONB NOT NULL,
  export_format TEXT CHECK (export_format IN ('pdf', 'markdown')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE industry_multiples ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_industry_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuation_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Industry multiples are public" ON industry_multiples
  FOR SELECT USING (true);

CREATE POLICY "Users manage own company profiles" ON company_industry_profile
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own exports" ON valuation_exports
  FOR ALL USING (auth.uid() = user_id);

-- Seed data with 3 size bands
INSERT INTO industry_multiples (industry_category, industry_subcategory, size_band, min_ebitda, max_ebitda, base_multiple, high_multiple, typical_margin_percent) VALUES
-- Healthcare
('Healthcare', 'Medical Practice', 'Small (<$1M)', 0, 1000000, 6.0, 8.0, 15),
('Healthcare', 'Medical Practice', 'Lower-Middle ($1-5M)', 1000000, 5000000, 8.0, 12.0, 15),
('Healthcare', 'Medical Practice', 'Middle-Market ($5M+)', 5000000, 999999999, 10.0, 15.0, 18),
('Healthcare', 'Dental Practice', 'Small (<$1M)', 0, 1000000, 5.0, 7.0, 20),
('Healthcare', 'Dental Practice', 'Lower-Middle ($1-5M)', 1000000, 5000000, 7.0, 10.0, 20),
('Healthcare', 'Dental Practice', 'Middle-Market ($5M+)', 5000000, 999999999, 9.0, 14.0, 22),

-- Professional Services
('Professional Services', 'Consulting', 'Small (<$1M)', 0, 1000000, 8.0, 10.0, 25),
('Professional Services', 'Consulting', 'Lower-Middle ($1-5M)', 1000000, 5000000, 10.0, 13.0, 25),
('Professional Services', 'Consulting', 'Middle-Market ($5M+)', 5000000, 999999999, 12.0, 15.0, 30),
('Professional Services', 'IT Services', 'Small (<$1M)', 0, 1000000, 6.0, 8.0, 20),
('Professional Services', 'IT Services', 'Lower-Middle ($1-5M)', 1000000, 5000000, 8.0, 11.4, 20),
('Professional Services', 'IT Services', 'Middle-Market ($5M+)', 5000000, 999999999, 10.0, 12.9, 22),

-- Construction
('Construction', 'HVAC', 'Small (<$1M)', 0, 1000000, 4.0, 5.5, 12),
('Construction', 'HVAC', 'Lower-Middle ($1-5M)', 1000000, 5000000, 5.0, 7.5, 12),
('Construction', 'HVAC', 'Middle-Market ($5M+)', 5000000, 999999999, 6.5, 9.0, 15),
('Construction', 'Electrical', 'Small (<$1M)', 0, 1000000, 4.0, 5.5, 10),
('Construction', 'Electrical', 'Lower-Middle ($1-5M)', 1000000, 5000000, 5.0, 7.0, 10),
('Construction', 'Electrical', 'Middle-Market ($5M+)', 5000000, 999999999, 6.0, 8.5, 12),

-- Technology
('Technology', 'SaaS', 'Small (<$1M)', 0, 1000000, 8.0, 12.0, 70),
('Technology', 'SaaS', 'Lower-Middle ($1-5M)', 1000000, 5000000, 10.0, 15.0, 70),
('Technology', 'SaaS', 'Middle-Market ($5M+)', 5000000, 999999999, 12.0, 17.0, 75);