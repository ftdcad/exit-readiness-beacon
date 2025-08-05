-- Drop existing policy and recreate with explicit anon role
DROP POLICY IF EXISTS "Anonymous users can submit contact inquiries" ON contact_inquiries;

-- Create new policy with explicit true condition for all inserts
CREATE POLICY "Allow any insert" 
ON contact_inquiries 
FOR INSERT 
WITH CHECK (true);