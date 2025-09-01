-- Complete Dev Roadmap Fix - Create Tables and Add Columns
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- CREATE ALL DEV ROADMAP TABLES (IF THEY DON'T EXIST)
-- =============================================================================

-- Development Roadmap Phases
CREATE TABLE IF NOT EXISTS dev_roadmap_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    start_date DATE,
    end_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Topics
CREATE TABLE IF NOT EXISTS dev_roadmap_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Projects
CREATE TABLE IF NOT EXISTS dev_roadmap_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Resources
CREATE TABLE IF NOT EXISTS dev_roadmap_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    type TEXT DEFAULT 'link' CHECK (type IN ('link', 'video', 'document', 'book')),
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap User Stats
CREATE TABLE IF NOT EXISTS dev_roadmap_user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total_hours NUMERIC(10,2) DEFAULT 0,
    total_leetcode_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    total_achievements_unlocked INTEGER DEFAULT 0,
    total_projects_completed INTEGER DEFAULT 0,
    total_topics_completed INTEGER DEFAULT 0,
    total_phases_completed INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Daily Logs
CREATE TABLE IF NOT EXISTS dev_roadmap_daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE SET NULL,
    project_id UUID REFERENCES dev_roadmap_projects(id) ON DELETE SET NULL,
    hours_spent NUMERIC(4,2) DEFAULT 0,
    leetcode_problems INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Achievements
CREATE TABLE IF NOT EXISTS dev_roadmap_achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    unlocked BOOLEAN DEFAULT FALSE,
    requirement TEXT,
    category TEXT DEFAULT 'general',
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Study Sessions
CREATE TABLE IF NOT EXISTS dev_roadmap_study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    topic TEXT,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =============================================================================

-- Add missing columns to dev_roadmap_phases (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dev_roadmap_phases') THEN
        ALTER TABLE dev_roadmap_phases 
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS start_date DATE,
        ADD COLUMN IF NOT EXISTS end_date DATE;
    END IF;
END $$;

-- Add missing columns to dev_roadmap_topics (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dev_roadmap_topics') THEN
        ALTER TABLE dev_roadmap_topics 
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to dev_roadmap_projects (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dev_roadmap_projects') THEN
        ALTER TABLE dev_roadmap_projects 
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to dev_roadmap_resources (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dev_roadmap_resources') THEN
        ALTER TABLE dev_roadmap_resources 
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to dev_roadmap_achievements (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'dev_roadmap_achievements') THEN
        ALTER TABLE dev_roadmap_achievements 
        ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_phases_status ON dev_roadmap_phases(status);
CREATE INDEX IF NOT EXISTS idx_phases_dates ON dev_roadmap_phases(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_topics_phase_id ON dev_roadmap_topics(phase_id);
CREATE INDEX IF NOT EXISTS idx_topics_completed ON dev_roadmap_topics(completed);
CREATE INDEX IF NOT EXISTS idx_topics_order ON dev_roadmap_topics(order_index);
CREATE INDEX IF NOT EXISTS idx_resources_topic_id ON dev_roadmap_resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_resources_completed ON dev_roadmap_resources(completed);
CREATE INDEX IF NOT EXISTS idx_resources_order ON dev_roadmap_resources(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_phase_id ON dev_roadmap_projects(phase_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON dev_roadmap_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON dev_roadmap_projects(order_index);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON dev_roadmap_daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_phase_id ON dev_roadmap_daily_logs(phase_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_topic_id ON dev_roadmap_daily_logs(topic_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_project_id ON dev_roadmap_daily_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked ON dev_roadmap_achievements(unlocked);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON dev_roadmap_achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON dev_roadmap_achievements(is_active);
CREATE INDEX IF NOT EXISTS idx_achievements_order ON dev_roadmap_achievements(order_index);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON dev_roadmap_study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed ON dev_roadmap_study_sessions(completed);

-- =============================================================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE dev_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_study_sessions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- CREATE POLICIES
-- =============================================================================

DROP POLICY IF EXISTS "Allow public access to dev_roadmap_phases" ON dev_roadmap_phases;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_topics" ON dev_roadmap_topics;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_projects" ON dev_roadmap_projects;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_resources" ON dev_roadmap_resources;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_user_stats" ON dev_roadmap_user_stats;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_daily_logs" ON dev_roadmap_daily_logs;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_achievements" ON dev_roadmap_achievements;
DROP POLICY IF EXISTS "Allow public access to dev_roadmap_study_sessions" ON dev_roadmap_study_sessions;

CREATE POLICY "Allow public access to dev_roadmap_phases" ON dev_roadmap_phases FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_topics" ON dev_roadmap_topics FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_projects" ON dev_roadmap_projects FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_resources" ON dev_roadmap_resources FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_user_stats" ON dev_roadmap_user_stats FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_daily_logs" ON dev_roadmap_daily_logs FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_achievements" ON dev_roadmap_achievements FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_study_sessions" ON dev_roadmap_study_sessions FOR ALL USING (true);

-- =============================================================================
-- CREATE TRIGGERS
-- =============================================================================

DROP TRIGGER IF EXISTS update_dev_roadmap_phases_updated_at ON dev_roadmap_phases;
DROP TRIGGER IF EXISTS update_dev_roadmap_topics_updated_at ON dev_roadmap_topics;
DROP TRIGGER IF EXISTS update_dev_roadmap_projects_updated_at ON dev_roadmap_projects;
DROP TRIGGER IF EXISTS update_dev_roadmap_resources_updated_at ON dev_roadmap_resources;
DROP TRIGGER IF EXISTS update_dev_roadmap_user_stats_updated_at ON dev_roadmap_user_stats;
DROP TRIGGER IF EXISTS update_dev_roadmap_daily_logs_updated_at ON dev_roadmap_daily_logs;
DROP TRIGGER IF EXISTS update_dev_roadmap_achievements_updated_at ON dev_roadmap_achievements;
DROP TRIGGER IF EXISTS update_dev_roadmap_study_sessions_updated_at ON dev_roadmap_study_sessions;

CREATE TRIGGER update_dev_roadmap_phases_updated_at BEFORE UPDATE ON dev_roadmap_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_topics_updated_at BEFORE UPDATE ON dev_roadmap_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_projects_updated_at BEFORE UPDATE ON dev_roadmap_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_resources_updated_at BEFORE UPDATE ON dev_roadmap_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_user_stats_updated_at BEFORE UPDATE ON dev_roadmap_user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_daily_logs_updated_at BEFORE UPDATE ON dev_roadmap_daily_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_achievements_updated_at BEFORE UPDATE ON dev_roadmap_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_study_sessions_updated_at BEFORE UPDATE ON dev_roadmap_study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INSERT DEFAULT DATA
-- =============================================================================

-- Insert default phases (only if none exist)
INSERT INTO dev_roadmap_phases (title, description, status, order_index) 
SELECT * FROM (
    VALUES 
    ('Foundation', 'Learn the basics of programming and web development', 'not_started', 1),
    ('Frontend Development', 'Master HTML, CSS, and JavaScript', 'not_started', 2),
    ('Backend Development', 'Learn server-side programming and databases', 'not_started', 3),
    ('Full Stack Development', 'Combine frontend and backend skills', 'not_started', 4),
    ('Advanced Topics', 'Explore advanced concepts and frameworks', 'not_started', 5),
    ('Job Preparation', 'Prepare for interviews and job applications', 'not_started', 6)
) AS new_phases(title, description, status, order_index)
WHERE NOT EXISTS (SELECT 1 FROM dev_roadmap_phases);

-- Insert default achievements (only if none exist)
INSERT INTO dev_roadmap_achievements (id, title, description, icon, requirement, category, points, order_index, is_active) 
SELECT * FROM (
    VALUES 
    ('first-hour', 'First Hour', 'Complete your first hour of study', '⏰', 'Study for 1 hour', 'milestone', 10, 1, true),
    ('first-day', 'First Day', 'Complete your first day of study', '📅', 'Study for 1 day', 'milestone', 50, 2, true),
    ('first-week', 'First Week', 'Complete your first week of study', '📆', 'Study for 7 days', 'milestone', 100, 3, true),
    ('first-month', 'First Month', 'Complete your first month of study', '🗓️', 'Study for 30 days', 'milestone', 500, 4, true),
    ('first-leetcode', 'First LeetCode', 'Solve your first LeetCode problem', '💻', 'Solve 1 LeetCode problem', 'coding', 25, 5, true),
    ('leetcode-10', 'LeetCode Beginner', 'Solve 10 LeetCode problems', '🎯', 'Solve 10 LeetCode problems', 'coding', 100, 6, true),
    ('leetcode-50', 'LeetCode Intermediate', 'Solve 50 LeetCode problems', '🏆', 'Solve 50 LeetCode problems', 'coding', 250, 7, true),
    ('leetcode-100', 'LeetCode Advanced', 'Solve 100 LeetCode problems', '👑', 'Solve 100 LeetCode problems', 'coding', 500, 8, true),
    ('first-project', 'First Project', 'Complete your first project', '🚀', 'Complete 1 project', 'project', 200, 9, true),
    ('project-5', 'Project Builder', 'Complete 5 projects', '🏗️', 'Complete 5 projects', 'project', 500, 10, true),
    ('project-10', 'Project Master', 'Complete 10 projects', '🎨', 'Complete 10 projects', 'project', 1000, 11, true),
    ('streak-7', 'Week Warrior', 'Maintain a 7-day study streak', '🔥', 'Study for 7 consecutive days', 'streak', 150, 12, true),
    ('streak-30', 'Month Master', 'Maintain a 30-day study streak', '🔥🔥', 'Study for 30 consecutive days', 'streak', 500, 13, true),
    ('streak-100', 'Century Club', 'Maintain a 100-day study streak', '🔥🔥🔥', 'Study for 100 consecutive days', 'streak', 1000, 14, true),
    ('hours-10', 'Dedicated Learner', 'Study for 10 hours', '📚', 'Study for 10 hours', 'time', 100, 15, true),
    ('hours-50', 'Serious Student', 'Study for 50 hours', '📖', 'Study for 50 hours', 'time', 250, 16, true),
    ('hours-100', 'Knowledge Seeker', 'Study for 100 hours', '🎓', 'Study for 100 hours', 'time', 500, 17, true),
    ('hours-500', 'Learning Legend', 'Study for 500 hours', '🧠', 'Study for 500 hours', 'time', 1000, 18, true),
    ('phase-1', 'Foundation Complete', 'Complete the Foundation phase', '🏁', 'Complete 1 phase', 'phase', 200, 19, true),
    ('phase-3', 'Halfway There', 'Complete 3 phases', '🎯', 'Complete 3 phases', 'phase', 500, 20, true),
    ('phase-6', 'Roadmap Complete', 'Complete all phases', '🏆', 'Complete all phases', 'phase', 1000, 21, true),
    ('roadmap-complete', 'Roadmap Master', 'Complete the entire development roadmap', '👑', 'Complete all phases, topics, and projects', 'milestone', 2000, 22, true),
    ('job-ready', 'Job Ready', 'Get your first developer job', '💼', 'Land your first developer job', 'milestone', 5000, 23, true),
    ('senior-developer', 'Senior Developer', 'Become a senior developer', '👑', 'Achieve senior developer status', 'milestone', 10000, 24, true)
) AS new_achievements(id, title, description, icon, requirement, category, points, order_index, is_active)
WHERE NOT EXISTS (SELECT 1 FROM dev_roadmap_achievements);

-- Initialize user stats (only if none exist)
INSERT INTO dev_roadmap_user_stats (total_hours, total_leetcode_solved, current_streak, longest_streak, total_points, total_achievements_unlocked, total_projects_completed, total_topics_completed, total_phases_completed)
SELECT 0, 0, 0, 0, 0, 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM dev_roadmap_user_stats);

-- =============================================================================
-- FINAL VERIFICATION
-- =============================================================================

-- Check all tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dev_roadmap_%'
ORDER BY table_name;

-- Show data counts
SELECT 'Phases' as table_name, COUNT(*) as count FROM dev_roadmap_phases
UNION ALL
SELECT 'Achievements' as table_name, COUNT(*) as count FROM dev_roadmap_achievements
UNION ALL
SELECT 'User Stats' as table_name, COUNT(*) as count FROM dev_roadmap_user_stats;

-- Show sample phases
SELECT title, status, order_index FROM dev_roadmap_phases ORDER BY order_index;

-- Show sample achievements
SELECT title, category, points, order_index FROM dev_roadmap_achievements ORDER BY order_index LIMIT 5;
