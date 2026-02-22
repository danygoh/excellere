-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  job_title TEXT,
  sector TEXT,
  organisation TEXT,
  onboarding_complete BOOLEAN DEFAULT false,
  sessions_completed INTEGER DEFAULT 0,
  sessions_total INTEGER DEFAULT 12,
  readiness_score INTEGER DEFAULT 0,
  stage TEXT,
  validator_id TEXT,
  status TEXT DEFAULT 'active',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create validation_queue table
CREATE TABLE IF NOT EXISTS validation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  report_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  days_waiting INTEGER DEFAULT 0,
  validator_id TEXT,
  validated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_queue ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access)
CREATE POLICY "Service role full access students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access validation_queue" ON validation_queue FOR ALL USING (true) WITH CHECK (true);
