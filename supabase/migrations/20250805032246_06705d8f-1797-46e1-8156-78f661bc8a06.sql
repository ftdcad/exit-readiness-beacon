-- Clean up orphaned activity_log entries that are blocking deletions
-- This removes activity_log entries where the referenced company_id no longer exists
-- or where there are 'company_deleted' logs but the company still exists (failed deletion)

-- First, remove activity_log entries for companies that were supposedly deleted but still exist
DELETE FROM activity_log 
WHERE action_type = 'company_deleted' 
AND company_id IN (
  SELECT id FROM contact_inquiries 
);

-- Also clean up any other orphaned activity_log entries where company_id doesn't exist
DELETE FROM activity_log 
WHERE company_id IS NOT NULL 
AND company_id NOT IN (
  SELECT id FROM contact_inquiries
);