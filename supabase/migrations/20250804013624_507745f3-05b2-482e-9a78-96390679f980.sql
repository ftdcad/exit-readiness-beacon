CREATE TABLE kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- KPI Details
  metric_name TEXT NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('KPI', 'OKR')),
  category TEXT CHECK (category IN ('Financial', 'Operational', 'Customer', 'Growth', 'Quality')),
  
  -- Measurement
  current_value NUMERIC,
  target_value NUMERIC,
  unit_of_measure TEXT,
  measurement_frequency TEXT CHECK (measurement_frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly')),
  
  -- Timeline
  start_date DATE,
  target_date DATE,
  
  -- Business Impact
  strategic_initiative_link TEXT,
  valuation_impact TEXT CHECK (valuation_impact IN ('High', 'Medium', 'Low')),
  ebitda_impact NUMERIC,
  
  -- Accountability
  owner TEXT,
  department TEXT,
  
  -- Status Tracking
  status TEXT CHECK (status IN ('Not Started', 'On Track', 'At Risk', 'Behind', 'Achieved')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OKR specific table for key results
CREATE TABLE okr_key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  objective_id UUID REFERENCES kpi_metrics(id) ON DELETE CASCADE,
  key_result TEXT NOT NULL,
  current_progress NUMERIC DEFAULT 0,
  target_progress NUMERIC DEFAULT 100,
  status TEXT CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE okr_key_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own KPIs" ON kpi_metrics
  FOR ALL USING (auth.uid() = user_id);
  
CREATE POLICY "Users manage own key results" ON okr_key_results
  FOR ALL USING (
    objective_id IN (
      SELECT id FROM kpi_metrics WHERE user_id = auth.uid()
    )
  );

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_kpi_metrics_updated_at
BEFORE UPDATE ON kpi_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();