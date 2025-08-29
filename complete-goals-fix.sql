-- Complete Goals System Fix
-- Run this entire script in your Supabase SQL editor

-- First, let's check if the life_goals table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'life_goals') THEN
        -- Create life_goals table if it doesn't exist
        CREATE TABLE life_goals (
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
        
        -- Create indexes
        CREATE INDEX idx_life_goals_category ON life_goals(category);
        CREATE INDEX idx_life_goals_status ON life_goals(status);
        CREATE INDEX idx_life_goals_priority ON life_goals(priority);
        CREATE INDEX idx_life_goals_target_date ON life_goals(target_date);
        CREATE INDEX idx_life_goals_created_at ON life_goals(created_at);
        
        -- Enable RLS
        ALTER TABLE life_goals ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Users can view their own goals" ON life_goals FOR SELECT USING (true);
        CREATE POLICY "Users can insert their own goals" ON life_goals FOR INSERT WITH CHECK (true);
        CREATE POLICY "Users can update their own goals" ON life_goals FOR UPDATE USING (true);
        CREATE POLICY "Users can delete their own goals" ON life_goals FOR DELETE USING (true);
        
        RAISE NOTICE 'Created life_goals table and all necessary components';
    ELSE
        RAISE NOTICE 'life_goals table already exists';
    END IF;
END $$;

-- Create or replace the update timestamp function
CREATE OR REPLACE FUNCTION update_life_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_life_goals_updated_at ON life_goals;
CREATE TRIGGER trigger_update_life_goals_updated_at
    BEFORE UPDATE ON life_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_life_goals_updated_at();

-- Drop existing functions if they exist (to avoid conflicts)
DROP FUNCTION IF EXISTS get_life_goals_stats();
DROP FUNCTION IF EXISTS get_life_goals_by_category(TEXT);
DROP FUNCTION IF EXISTS get_overdue_life_goals();
DROP FUNCTION IF EXISTS get_upcoming_goal_deadlines(INTEGER);

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

-- Grant permissions on all functions
GRANT EXECUTE ON FUNCTION get_life_goals_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_life_goals_by_category(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_overdue_life_goals() TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_goal_deadlines(INTEGER) TO authenticated;

-- Grant permissions on the table
GRANT ALL ON life_goals TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Enable real-time subscriptions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE life_goals;
        RAISE NOTICE 'Added life_goals to real-time publication';
    ELSE
        RAISE NOTICE 'Real-time publication not found, skipping';
    END IF;
END $$;

-- Insert sample data if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM life_goals LIMIT 1) THEN
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
        );
        RAISE NOTICE 'Inserted sample data';
    ELSE
        RAISE NOTICE 'Sample data already exists';
    END IF;
END $$;

-- Test all functions
SELECT 'Testing get_life_goals_stats()' as test_name;
SELECT * FROM get_life_goals_stats();

SELECT 'Testing get_upcoming_goal_deadlines(30)' as test_name;
SELECT * FROM get_upcoming_goal_deadlines(30);

SELECT 'Testing get_overdue_life_goals()' as test_name;
SELECT * FROM get_overdue_life_goals();

SELECT 'Testing get_life_goals_by_category(''learning'')' as test_name;
SELECT * FROM get_life_goals_by_category('learning');

-- Show final status
SELECT 'Goals system setup complete!' as status;
