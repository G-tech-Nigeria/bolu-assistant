-- Create coding_journey_progress table for tracking roadmap progress
CREATE TABLE IF NOT EXISTS coding_journey_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  section_id TEXT NOT NULL,
  subsection_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique progress per user, section, and subsection
  UNIQUE(user_id, section_id, subsection_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coding_journey_user_id ON coding_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_journey_section_id ON coding_journey_progress(section_id);
CREATE INDEX IF NOT EXISTS idx_coding_journey_subsection_id ON coding_journey_progress(subsection_id);
CREATE INDEX IF NOT EXISTS idx_coding_journey_completed ON coding_journey_progress(completed);
CREATE INDEX IF NOT EXISTS idx_coding_journey_updated_at ON coding_journey_progress(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE coding_journey_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your auth needs)
CREATE POLICY "Allow all operations on coding_journey_progress" ON coding_journey_progress
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coding_journey_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_coding_journey_progress_updated_at 
  BEFORE UPDATE ON coding_journey_progress 
  FOR EACH ROW 
  EXECUTE FUNCTION update_coding_journey_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE coding_journey_progress IS 'Tracks user progress through the coding journey roadmap';
COMMENT ON COLUMN coding_journey_progress.section_id IS 'ID of the roadmap section (e.g., fundamentals, javascript-mastery)';
COMMENT ON COLUMN coding_journey_progress.subsection_id IS 'ID of the subsection within the section (e.g., variables-types, control-flow)';
COMMENT ON COLUMN coding_journey_progress.completed IS 'Whether the subsection has been completed by the user';
