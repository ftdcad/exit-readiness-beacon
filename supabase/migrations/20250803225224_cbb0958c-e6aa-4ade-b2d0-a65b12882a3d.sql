-- Create exit readiness assessments table
CREATE TABLE exit_readiness_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  assessment_version TEXT DEFAULT '1.0',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exit_readiness_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own assessments
CREATE POLICY "Users can manage own assessments" ON exit_readiness_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_exit_readiness_assessments_updated_at
  BEFORE UPDATE ON exit_readiness_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();