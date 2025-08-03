-- Complete admin dashboard setup with all required tables

-- 1. Create contact_inquiries table first (this was missing)
CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  annual_revenue BIGINT,
  exit_timeline TEXT,
  contact_email TEXT NOT NULL,
  contact_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create user_roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role_id UUID REFERENCES user_roles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enhance contact_inquiries table with admin metadata
ALTER TABLE contact_inquiries ADD COLUMN status TEXT DEFAULT 'new';
ALTER TABLE contact_inquiries ADD COLUMN assigned_to UUID REFERENCES profiles(id);
ALTER TABLE contact_inquiries ADD COLUMN admin_notes TEXT;
ALTER TABLE contact_inquiries ADD COLUMN source_form_version TEXT DEFAULT 'v1';

-- 5. Create activity_log table
CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  company_id UUID REFERENCES contact_inquiries(id),
  action_metadata JSONB DEFAULT '{}'::jsonb,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create company_comments table
CREATE TABLE company_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES contact_inquiries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  comment TEXT NOT NULL,
  comment_type TEXT DEFAULT 'note',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create initial admin role
INSERT INTO user_roles (name, permissions) 
VALUES ('admin', '{"all": true}'::jsonb);

-- 8. Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    JOIN public.user_roles r ON p.role_id = r.id
    WHERE p.id = user_id AND r.name = 'admin'
  );
$$;

-- 9. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_comments ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies for profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- 11. Create RLS policies for contact_inquiries
CREATE POLICY "Admins can view all inquiries" ON contact_inquiries
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update inquiries" ON contact_inquiries
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can insert inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- 12. Create RLS policies for activity_log
CREATE POLICY "Admins can view activity log" ON activity_log
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity log" ON activity_log
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- 13. Create RLS policies for company_comments
CREATE POLICY "Admins can view comments" ON company_comments
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert comments" ON company_comments
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update comments" ON company_comments
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- 14. Create indexes for better performance
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_assigned_to ON contact_inquiries(assigned_to);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX idx_activity_log_company_id ON activity_log(company_id);
CREATE INDEX idx_company_comments_company_id ON company_comments(company_id);

-- 15. Create trigger for updating profiles.updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();