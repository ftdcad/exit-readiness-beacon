-- Add client role to user_roles table
INSERT INTO public.user_roles (name, permissions) 
VALUES ('client', '{"portal_access": true, "weeks_unlocked": ["week1"]}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create client progress tracking table
CREATE TABLE public.client_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 4),
  module_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_number, module_name)
);

-- Enable RLS on client_progress
ALTER TABLE public.client_progress ENABLE ROW LEVEL SECURITY;

-- Clients can view and update their own progress
CREATE POLICY "Clients can view own progress" 
ON public.client_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Clients can update own progress" 
ON public.client_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Clients can mark completion" 
ON public.client_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can view all client progress
CREATE POLICY "Admins can view all client progress" 
ON public.client_progress 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create client scenarios table for EBITDA calculator persistence
CREATE TABLE public.client_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  revenue BIGINT,
  current_ebitda BIGINT,
  adjusted_ebitda BIGINT,
  add_backs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on client_scenarios
ALTER TABLE public.client_scenarios ENABLE ROW LEVEL SECURITY;

-- Clients can manage their own scenarios
CREATE POLICY "Clients can manage own scenarios" 
ON public.client_scenarios 
FOR ALL 
USING (auth.uid() = user_id);

-- Admins can view all scenarios
CREATE POLICY "Admins can view all scenarios" 
ON public.client_scenarios 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Add updated_at trigger for client_scenarios
CREATE TRIGGER update_client_scenarios_updated_at
  BEFORE UPDATE ON public.client_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();