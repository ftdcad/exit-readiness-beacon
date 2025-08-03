-- Create test client user profile with correct UID
-- First, check if client role exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE name = 'client') THEN
        INSERT INTO public.user_roles (id, name, permissions) 
        VALUES (gen_random_uuid(), 'client', '{"portal_access": true}');
    END IF;
END $$;

-- Create test client profile (delete first if exists, then insert)
DELETE FROM public.profiles WHERE email = 'testclient@example.com';

INSERT INTO public.profiles (id, email, full_name, role_id) 
VALUES (
  '99b87918-8513-4fa0-a9ee-9f3fda8bd645',
  'testclient@example.com', 
  'Test Client',
  (SELECT id FROM public.user_roles WHERE name = 'client')
);