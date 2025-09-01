-- Fix Dev Roadmap Missing Columns
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =============================================================================

-- Add missing columns to dev_roadmap_phases
ALTER TABLE dev_roadmap_phases 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add missing columns to dev_roadmap_topics
ALTER TABLE dev_roadmap_topics 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add missing columns to dev_roadmap_projects
ALTER TABLE dev_roadmap_projects 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add missing columns to dev_roadmap_resources
ALTER TABLE dev_roadmap_resources 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Add missing columns to dev_roadmap_achievements
ALTER TABLE dev_roadmap_achievements 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- =============================================================================
-- VERIFY COLUMNS EXIST
-- =============================================================================

-- Check phases table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_phases' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check achievements table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_achievements' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================================================
-- UPDATE EXISTING DATA WITH ORDER INDEX
-- =============================================================================

-- Update phases with order_index if they don't have it
UPDATE dev_roadmap_phases 
SET order_index = CASE 
    WHEN title = 'Foundation' THEN 1
    WHEN title = 'Frontend Development' THEN 2
    WHEN title = 'Backend Development' THEN 3
    WHEN title = 'Full Stack Development' THEN 4
    WHEN title = 'Advanced Topics' THEN 5
    WHEN title = 'Job Preparation' THEN 6
    ELSE 0
END
WHERE order_index = 0 OR order_index IS NULL;

-- Update achievements with order_index if they don't have it
UPDATE dev_roadmap_achievements 
SET order_index = CASE 
    WHEN id = 'first-hour' THEN 1
    WHEN id = 'first-day' THEN 2
    WHEN id = 'first-week' THEN 3
    WHEN id = 'first-month' THEN 4
    WHEN id = 'first-leetcode' THEN 5
    WHEN id = 'leetcode-10' THEN 6
    WHEN id = 'leetcode-50' THEN 7
    WHEN id = 'leetcode-100' THEN 8
    WHEN id = 'first-project' THEN 9
    WHEN id = 'project-5' THEN 10
    WHEN id = 'project-10' THEN 11
    WHEN id = 'streak-7' THEN 12
    WHEN id = 'streak-30' THEN 13
    WHEN id = 'streak-100' THEN 14
    WHEN id = 'hours-10' THEN 15
    WHEN id = 'hours-50' THEN 16
    WHEN id = 'hours-100' THEN 17
    WHEN id = 'hours-500' THEN 18
    WHEN id = 'phase-1' THEN 19
    WHEN id = 'phase-3' THEN 20
    WHEN id = 'phase-6' THEN 21
    WHEN id = 'roadmap-complete' THEN 22
    WHEN id = 'job-ready' THEN 23
    WHEN id = 'senior-developer' THEN 24
    ELSE 0
END
WHERE order_index = 0 OR order_index IS NULL;

-- =============================================================================
-- INSERT MISSING DATA IF TABLES ARE EMPTY
-- =============================================================================

-- Insert default phases if table is empty
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

-- Insert default achievements if table is empty
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

-- Initialize user stats if table is empty
INSERT INTO dev_roadmap_user_stats (total_hours, total_leetcode_solved, current_streak, longest_streak, total_points, total_achievements_unlocked, total_projects_completed, total_topics_completed, total_phases_completed)
SELECT 0, 0, 0, 0, 0, 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM dev_roadmap_user_stats);

-- =============================================================================
-- FINAL VERIFICATION
-- =============================================================================

-- Show current data counts
SELECT 'Phases' as table_name, COUNT(*) as count FROM dev_roadmap_phases
UNION ALL
SELECT 'Achievements' as table_name, COUNT(*) as count FROM dev_roadmap_achievements
UNION ALL
SELECT 'User Stats' as table_name, COUNT(*) as count FROM dev_roadmap_user_stats;

-- Show sample phases
SELECT title, status, order_index FROM dev_roadmap_phases ORDER BY order_index;

-- Show sample achievements
SELECT title, category, points, order_index FROM dev_roadmap_achievements ORDER BY order_index LIMIT 5;
