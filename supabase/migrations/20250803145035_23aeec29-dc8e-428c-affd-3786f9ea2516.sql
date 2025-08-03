-- Create the first admin user manually
-- This user will need to be created in the Supabase Auth dashboard first
-- Then we create their profile with admin role

-- First, get the admin role ID
DO $$
DECLARE
    admin_role_id UUID;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM user_roles WHERE name = 'admin';
    
    -- Insert a sample admin profile (you'll need to replace this with actual user ID from auth.users)
    -- This is just a placeholder - the actual admin user ID should be inserted after creating in Supabase Auth
    INSERT INTO profiles (id, email, full_name, role_id) 
    VALUES (
        '00000000-0000-0000-0000-000000000000'::UUID, -- Replace with actual user ID
        'admin@example.com', 
        'System Administrator',
        admin_role_id
    ) ON CONFLICT (id) DO NOTHING;
END $$;