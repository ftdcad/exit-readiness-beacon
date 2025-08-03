-- Create buyer_analysis table for Know Your Buyer module
CREATE TABLE public.buyer_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_answers JSONB DEFAULT '{}',
  buyer_scores JSONB DEFAULT '{}',
  selected_buyer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.buyer_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can manage own buyer analysis" 
ON public.buyer_analysis 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_buyer_analysis_updated_at
BEFORE UPDATE ON public.buyer_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();