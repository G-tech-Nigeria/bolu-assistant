-- Fitness Goals System Setup
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- FITNESS GOALS TABLES
-- =============================================================================

-- Weekly Fitness Goals Table
CREATE TABLE IF NOT EXISTS fitness_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    goal_type TEXT NOT NULL CHECK (goal_type IN ('runs', 'distance', 'calories', 'workouts', 'steps')),
    target_value NUMERIC(10,2) NOT NULL,
    current_value NUMERIC(10,2) DEFAULT 0,
    period TEXT NOT NULL DEFAULT 'weekly' CHECK (period IN ('daily', 'weekly', 'monthly')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(goal_type, period, user_id)
);

-- Fitness Goal History (for tracking progress over time)
CREATE TABLE IF NOT EXISTS fitness_goal_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    goal_id UUID REFERENCES fitness_goals(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    achieved_value NUMERIC(10,2) NOT NULL,
    target_value NUMERIC(10,2) NOT NULL,
    percentage_complete NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_id ON fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_type ON fitness_goals(goal_type);
CREATE INDEX IF NOT EXISTS idx_fitness_goals_active ON fitness_goals(is_active);
CREATE INDEX IF NOT EXISTS idx_fitness_goal_progress_goal_id ON fitness_goal_progress(goal_id);
CREATE INDEX IF NOT EXISTS idx_fitness_goal_progress_date ON fitness_goal_progress(date);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goal_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on fitness_goals" ON fitness_goals
    FOR ALL USING (true);

CREATE POLICY "Allow all operations on fitness_goal_progress" ON fitness_goal_progress
    FOR ALL USING (true);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_fitness_goals_updated_at
    BEFORE UPDATE ON fitness_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTIONS FOR GOAL CALCULATIONS
-- =============================================================================

-- Function to calculate current week's progress for a goal type
CREATE OR REPLACE FUNCTION get_weekly_goal_progress(goal_type_param TEXT)
RETURNS TABLE (
    goal_type TEXT,
    current_value NUMERIC,
    target_value NUMERIC,
    percentage_complete NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fg.goal_type,
        COALESCE(fg.current_value, 0) as current_value,
        fg.target_value,
        CASE 
            WHEN fg.target_value > 0 THEN 
                ROUND((COALESCE(fg.current_value, 0) / fg.target_value) * 100, 1)
            ELSE 0 
        END as percentage_complete
    FROM fitness_goals fg
    WHERE fg.goal_type = goal_type_param
    AND fg.is_active = TRUE
    AND fg.period = 'weekly'
    AND fg.start_date <= CURRENT_DATE
    AND (fg.end_date IS NULL OR fg.end_date >= CURRENT_DATE)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update goal progress based on runs data
CREATE OR REPLACE FUNCTION update_fitness_goals_from_runs()
RETURNS VOID AS $$
BEGIN
    -- Update runs count goal
    UPDATE fitness_goals 
    SET current_value = (
        SELECT COUNT(*) 
        FROM runs 
        WHERE start_time >= date_trunc('week', CURRENT_DATE)
        AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
    )
    WHERE goal_type = 'runs' AND is_active = TRUE;

    -- Update distance goal
    UPDATE fitness_goals 
    SET current_value = (
        SELECT COALESCE(SUM(distance), 0) / 1000 -- Convert meters to kilometers
        FROM runs 
        WHERE start_time >= date_trunc('week', CURRENT_DATE)
        AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
    )
    WHERE goal_type = 'distance' AND is_active = TRUE;

    -- Update calories goal
    UPDATE fitness_goals 
    SET current_value = (
        SELECT COALESCE(SUM(calories), 0)
        FROM runs 
        WHERE start_time >= date_trunc('week', CURRENT_DATE)
        AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week'
    )
    WHERE goal_type = 'calories' AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- DEFAULT GOALS DATA
-- =============================================================================

-- Insert default weekly goals (only if none exist)
INSERT INTO fitness_goals (goal_type, target_value, period, start_date)
SELECT * FROM (
    VALUES 
    ('runs', 5, 'weekly', CURRENT_DATE),
    ('distance', 20, 'weekly', CURRENT_DATE),
    ('calories', 1500, 'weekly', CURRENT_DATE)
) AS new_goals(goal_type, target_value, period, start_date)
WHERE NOT EXISTS (
    SELECT 1 FROM fitness_goals 
    WHERE goal_type = new_goals.goal_type 
    AND period = 'weekly'
);

-- =============================================================================
-- INITIAL PROGRESS UPDATE
-- =============================================================================

-- Update current progress based on existing runs
SELECT update_fitness_goals_from_runs();

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Check current goals
SELECT 
    goal_type,
    target_value,
    current_value,
    ROUND((current_value / target_value) * 100, 1) as percentage_complete
FROM fitness_goals 
WHERE is_active = TRUE 
ORDER BY goal_type;

-- Check this week's runs
SELECT 
    COUNT(*) as runs_this_week,
    ROUND(SUM(distance) / 1000, 2) as distance_km,
    SUM(calories) as total_calories
FROM runs 
WHERE start_time >= date_trunc('week', CURRENT_DATE)
AND start_time < date_trunc('week', CURRENT_DATE) + INTERVAL '1 week';
