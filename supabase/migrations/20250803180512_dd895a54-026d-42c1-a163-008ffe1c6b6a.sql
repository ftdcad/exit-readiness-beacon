-- Create test client user and set up authentication
-- First, check if client role exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE name = 'client') THEN
        INSERT INTO public.user_roles (id, name, permissions) 
        VALUES (gen_random_uuid(), 'client', '{"portal_access": true}');
    END IF;
END $$;

-- Create test client profile
-- Note: We'll insert with a proper UUID that matches what we'll use in auth
INSERT INTO public.profiles (id, email, full_name, role_id) 
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'testclient@example.com', 
  'Test Client',
  (SELECT id FROM public.user_roles WHERE name = 'client')
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role_id = EXCLUDED.role_id;