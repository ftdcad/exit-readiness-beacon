-- Add vehicle_assets column to quick_wins_progress table
ALTER TABLE public.quick_wins_progress 
ADD COLUMN vehicle_assets JSONB DEFAULT '[]'::jsonb;