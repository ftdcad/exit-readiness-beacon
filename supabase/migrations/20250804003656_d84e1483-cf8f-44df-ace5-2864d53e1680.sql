CREATE TABLE public.strategy_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  timeline_30 TEXT,
  timeline_60 TEXT, 
  timeline_90 TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategy_initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own initiatives" 
ON public.strategy_initiatives 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_strategy_initiatives_updated_at
  BEFORE UPDATE ON public.strategy_initiatives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();