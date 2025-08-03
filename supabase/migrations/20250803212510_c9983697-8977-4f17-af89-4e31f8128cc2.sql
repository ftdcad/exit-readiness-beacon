-- Add custom_items column to quick_wins_progress table
ALTER TABLE public.quick_wins_progress 
ADD COLUMN custom_items JSONB DEFAULT '[]'::jsonb;