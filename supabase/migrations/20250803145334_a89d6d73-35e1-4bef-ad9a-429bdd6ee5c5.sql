-- Fix security linter issues

-- 1. Fix function search path mutable issues
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.user_roles r ON p.role_id = r.id
    WHERE p.id = user_id AND r.name = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Enable RLS on user_roles table (this was missing)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy for user_roles table
CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (public.is_admin(auth.uid()));