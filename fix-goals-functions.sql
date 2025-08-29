-- Fix script for missing get_upcoming_goal_deadlines function
-- Run this in your Supabase SQL editor

-- Drop the function if it exists (to avoid conflicts)
DROP FUNCTION IF EXISTS get_upcoming_goal_deadlines(INTEGER);

-- Create the function
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_upcoming_goal_deadlines(INTEGER) TO authenticated;

-- Test the function
SELECT * FROM get_upcoming_goal_deadlines(30);
