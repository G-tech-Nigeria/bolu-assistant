-- Accountability System Database Setup
-- Run this in your Supabase SQL editor

-- Create accountability_users table
CREATE TABLE IF NOT EXISTS accountability_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '👤',
  points INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accountability_tasks table
CREATE TABLE IF NOT EXISTS accountability_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  proof_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accountability_penalties table
CREATE TABLE IF NOT EXISTS accountability_penalties (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accountability_achievements table
CREATE TABLE IF NOT EXISTS accountability_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accountability_settings table
CREATE TABLE IF NOT EXISTS accountability_settings (
  id TEXT PRIMARY KEY,
  penalty_amount DECIMAL(10,2) NOT NULL DEFAULT 5.00,
  points_per_task INTEGER NOT NULL DEFAULT 10,
  points_per_achievement INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accountability_tasks_user_date ON accountability_tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_accountability_tasks_date ON accountability_tasks(date);
CREATE INDEX IF NOT EXISTS idx_accountability_penalties_user_date ON accountability_penalties(user_id, date);
CREATE INDEX IF NOT EXISTS idx_accountability_achievements_user ON accountability_achievements(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE accountability_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a personal app)
CREATE POLICY "Allow all operations on accountability_users" ON accountability_users
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on accountability_tasks" ON accountability_tasks
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on accountability_penalties" ON accountability_penalties
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on accountability_achievements" ON accountability_achievements
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on accountability_settings" ON accountability_settings
  FOR ALL USING (true);

-- Insert default settings
INSERT INTO accountability_settings (id, penalty_amount, points_per_task, points_per_achievement)
VALUES ('default-settings', 5.00, 10, 25)
ON CONFLICT (id) DO NOTHING;

-- Insert default users if they don't exist
INSERT INTO accountability_users (id, name, avatar, points, streak)
VALUES 
  ('default-user-1', 'Me', '👤', 0, 0),
  ('default-user-2', 'Friend', '👥', 0, 0)
ON CONFLICT (id) DO NOTHING;


