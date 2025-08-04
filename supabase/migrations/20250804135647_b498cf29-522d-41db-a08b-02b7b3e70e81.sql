-- Add is_completed column to data_room_progress table
ALTER TABLE public.data_room_progress 
ADD COLUMN is_completed boolean DEFAULT false;