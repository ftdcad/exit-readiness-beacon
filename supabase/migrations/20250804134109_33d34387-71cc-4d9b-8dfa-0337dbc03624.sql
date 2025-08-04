-- Add support for custom folders and sections
ALTER TABLE data_room_structure ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false;
ALTER TABLE data_room_structure ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE data_room_structure ADD COLUMN IF NOT EXISTS company_type TEXT;

-- Update RLS policies to support custom folders
DROP POLICY IF EXISTS "Users view structure" ON data_room_structure;

CREATE POLICY "Users view structure" ON data_room_structure
  FOR SELECT USING (
    is_custom = false OR created_by = auth.uid()
  );

CREATE POLICY "Users create custom structure" ON data_room_structure
  FOR INSERT WITH CHECK (auth.uid() = created_by AND is_custom = true);

CREATE POLICY "Users update own structure" ON data_room_structure
  FOR UPDATE USING (auth.uid() = created_by AND is_custom = true);

CREATE POLICY "Users delete own structure" ON data_room_structure
  FOR DELETE USING (auth.uid() = created_by AND is_custom = true);