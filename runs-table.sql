-- Create runs table for Activity Tracker
CREATE TABLE IF NOT EXISTS runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER NOT NULL DEFAULT 0, -- in seconds
  distance NUMERIC(10,2) NOT NULL DEFAULT 0, -- in meters
  pace NUMERIC(8,2) NOT NULL DEFAULT 0, -- minutes per kilometer
  calories INTEGER NOT NULL DEFAULT 0,
  route JSONB, -- GPS route points
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_start_time ON runs(start_time);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your auth needs)
CREATE POLICY "Allow all operations on runs" ON runs
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_runs_updated_at 
  BEFORE UPDATE ON runs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
