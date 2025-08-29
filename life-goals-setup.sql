-- Life Goals Management System Setup
-- This script creates the necessary tables and functions for managing life goals

-- Create life_goals table
CREATE TABLE IF NOT EXISTS life_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'health', 'career', 'finance', 'learning', 'relationships', 
    'personal', 'spiritual', 'travel', 'business', 'other'
  )),
  target_date DATE NOT NULL,
  current_progress DECIMAL(10,2) DEFAULT 0,
  target_value DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT '%',
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_life_goals_category ON life_goals(category);
CREATE INDEX IF NOT EXISTS idx_life_goals_status ON life_goals(status);
CREATE INDEX IF NOT EXISTS idx_life_goals_priority ON life_goals(priority);
CREATE INDEX IF NOT EXISTS idx_life_goals_target_date ON life_goals(target_date);
CREATE INDEX IF NOT EXISTS idx_life_goals_created_at ON life_goals(created_at);

-- Enable Row Level Security
ALTER TABLE life_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own goals" ON life_goals
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own goals" ON life_goals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own goals" ON life_goals
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own goals" ON life_goals
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_life_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_life_goals_updated_at
  BEFORE UPDATE ON life_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_life_goals_updated_at();

-- Create function to get goal statistics
CREATE OR REPLACE FUNCTION get_life_goals_stats()
RETURNS TABLE (
  total_goals BIGINT,
  active_goals BIGINT,
  completed_goals BIGINT,
  paused_goals BIGINT,
  avg_progress DECIMAL(5,2),
  overdue_goals BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_goals,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_goals,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_goals,
    COUNT(*) FILTER (WHERE status = 'paused')::BIGINT as paused_goals,
    ROUND(AVG(
      CASE 
        WHEN target_value > 0 THEN (current_progress / target_value) * 100
        ELSE 0 
      END
    ), 2) as avg_progress,
    COUNT(*) FILTER (WHERE target_date < CURRENT_DATE AND status != 'completed')::BIGINT as overdue_goals
  FROM life_goals;
END;
$$ LANGUAGE plpgsql;

-- Create function to get goals by category
CREATE OR REPLACE FUNCTION get_life_goals_by_category(goal_category TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  target_date DATE,
  current_progress DECIMAL(10,2),
  target_value DECIMAL(10,2),
  unit TEXT,
  priority TEXT,
  status TEXT,
  milestones JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.id,
    lg.title,
    lg.description,
    lg.category,
    lg.target_date,
    lg.current_progress,
    lg.target_value,
    lg.unit,
    lg.priority,
    lg.status,
    lg.milestones,
    lg.created_at,
    lg.updated_at
  FROM life_goals lg
  WHERE lg.category = goal_category
  ORDER BY lg.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get overdue goals
CREATE OR REPLACE FUNCTION get_overdue_life_goals()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  target_date DATE,
  days_overdue INTEGER,
  current_progress DECIMAL(10,2),
  target_value DECIMAL(10,2),
  unit TEXT,
  priority TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.id,
    lg.title,
    lg.description,
    lg.category,
    lg.target_date,
    (CURRENT_DATE - lg.target_date)::INTEGER as days_overdue,
    lg.current_progress,
    lg.target_value,
    lg.unit,
    lg.priority
  FROM life_goals lg
  WHERE lg.target_date < CURRENT_DATE 
    AND lg.status != 'completed'
  ORDER BY lg.target_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get upcoming goal deadlines
CREATE OR REPLACE FUNCTION get_upcoming_goal_deadlines(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  target_date DATE,
  days_remaining INTEGER,
  current_progress DECIMAL(10,2),
  target_value DECIMAL(10,2),
  unit TEXT,
  priority TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.id,
    lg.title,
    lg.description,
    lg.category,
    lg.target_date,
    (lg.target_date - CURRENT_DATE)::INTEGER as days_remaining,
    lg.current_progress,
    lg.target_value,
    lg.unit,
    lg.priority
  FROM life_goals lg
  WHERE lg.target_date >= CURRENT_DATE 
    AND lg.target_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND lg.status = 'active'
  ORDER BY lg.target_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO life_goals (title, description, category, target_date, current_progress, target_value, unit, priority, status, milestones) VALUES
(
  'Complete Full-Stack Developer Course',
  'Master React, Node.js, and database development to become a full-stack developer',
  'learning',
  '2025-12-31',
  65,
  100,
  '%',
  'high',
  'active',
  '[
    {"id": "1-1", "title": "Complete Frontend Module", "description": "Finish React and UI development", "targetDate": "2025-06-30", "completed": true, "completedAt": "2025-06-15"},
    {"id": "1-2", "title": "Complete Backend Module", "description": "Finish Node.js and API development", "targetDate": "2025-09-30", "completed": false},
    {"id": "1-3", "title": "Build Portfolio Project", "description": "Create a full-stack application", "targetDate": "2025-11-30", "completed": false}
  ]'::jsonb
),
(
  'Save £10,000 for Emergency Fund',
  'Build a 6-month emergency fund for financial security',
  'finance',
  '2025-12-31',
  7500,
  10000,
  '£',
  'high',
  'active',
  '[
    {"id": "2-1", "title": "Save £2,500", "description": "First quarter milestone", "targetDate": "2025-03-31", "completed": true, "completedAt": "2025-03-28"},
    {"id": "2-2", "title": "Save £5,000", "description": "Second quarter milestone", "targetDate": "2025-06-30", "completed": true, "completedAt": "2025-06-25"},
    {"id": "2-3", "title": "Save £7,500", "description": "Third quarter milestone", "targetDate": "2025-09-30", "completed": false},
    {"id": "2-4", "title": "Save £10,000", "description": "Final goal", "targetDate": "2025-12-31", "completed": false}
  ]'::jsonb
),
(
  'Run a Half Marathon',
  'Train and complete a half marathon in under 2 hours',
  'health',
  '2025-10-15',
  8,
  21,
  'km',
  'medium',
  'active',
  '[
    {"id": "3-1", "title": "Run 5km", "description": "Build base endurance", "targetDate": "2025-04-30", "completed": true, "completedAt": "2025-04-15"},
    {"id": "3-2", "title": "Run 10km", "description": "Increase distance", "targetDate": "2025-06-30", "completed": true, "completedAt": "2025-06-20"},
    {"id": "3-3", "title": "Run 15km", "description": "Build long-distance stamina", "targetDate": "2025-08-31", "completed": false},
    {"id": "3-4", "title": "Complete Half Marathon", "description": "Race day achievement", "targetDate": "2025-10-15", "completed": false}
  ]'::jsonb
),
(
  'Learn Spanish Fluently',
  'Achieve conversational fluency in Spanish for travel and career opportunities',
  'learning',
  '2025-08-31',
  30,
  100,
  '%',
  'medium',
  'active',
  '[
    {"id": "4-1", "title": "Complete Basic Course", "description": "Finish A1-A2 level Spanish course", "targetDate": "2025-02-28", "completed": true, "completedAt": "2025-02-25"},
    {"id": "4-2", "title": "Intermediate Level", "description": "Complete B1-B2 level course", "targetDate": "2025-05-31", "completed": false},
    {"id": "4-3", "title": "Conversational Practice", "description": "Practice with native speakers", "targetDate": "2025-07-31", "completed": false}
  ]'::jsonb
),
(
  'Build Emergency Fund',
  'Save 6 months of living expenses for financial security',
  'finance',
  '2025-06-30',
  60,
  100,
  '%',
  'high',
  'active',
  '[
    {"id": "5-1", "title": "Save 2 months", "description": "First milestone", "targetDate": "2025-02-28", "completed": true, "completedAt": "2025-02-20"},
    {"id": "5-2", "title": "Save 4 months", "description": "Second milestone", "targetDate": "2025-04-30", "completed": false},
    {"id": "5-3", "title": "Save 6 months", "description": "Final goal", "targetDate": "2025-06-30", "completed": false}
  ]'::jsonb
);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE life_goals;

-- Grant necessary permissions
GRANT ALL ON life_goals TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create view for goal progress tracking
CREATE OR REPLACE VIEW goal_progress_summary AS
SELECT 
  category,
  COUNT(*) as total_goals,
  COUNT(*) FILTER (WHERE status = 'active') as active_goals,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
  ROUND(AVG(
    CASE 
      WHEN target_value > 0 THEN (current_progress / target_value) * 100
      ELSE 0 
    END
  ), 2) as avg_progress,
  COUNT(*) FILTER (WHERE target_date < CURRENT_DATE AND status != 'completed') as overdue_goals
FROM life_goals
GROUP BY category
ORDER BY category;

-- Grant access to the view
GRANT SELECT ON goal_progress_summary TO authenticated;

COMMENT ON TABLE life_goals IS 'Life goals management system for personal development tracking';
COMMENT ON COLUMN life_goals.milestones IS 'JSON array of milestone objects with id, title, description, targetDate, completed, and completedAt fields';
COMMENT ON FUNCTION get_life_goals_stats() IS 'Returns comprehensive statistics about all life goals';
COMMENT ON FUNCTION get_overdue_life_goals() IS 'Returns goals that are past their target date and not completed';
COMMENT ON FUNCTION get_upcoming_goal_deadlines() IS 'Returns goals with upcoming deadlines within specified days';
