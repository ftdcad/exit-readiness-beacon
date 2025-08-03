-- Create quick_wins_progress table for storing user progress on Quick Wins checklist
CREATE TABLE public.quick_wins_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  completed_items JSONB DEFAULT '[]'::jsonb,
  values JSONB DEFAULT '{}'::jsonb,
  notes JSONB DEFAULT '{}'::jsonb,
  multiple INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quick_wins_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own quick wins progress" 
ON public.quick_wins_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quick wins progress" 
ON public.quick_wins_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quick wins progress" 
ON public.quick_wins_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quick_wins_progress_updated_at
BEFORE UPDATE ON public.quick_wins_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();