-- Fix All Dev Roadmap Schema Issues
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- FIX STUDY SESSIONS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_study_sessions
ALTER TABLE dev_roadmap_study_sessions 
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'focus',
ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES dev_roadmap_projects(id) ON DELETE SET NULL;

-- Update existing sessions to have start_time if they don't have it
UPDATE dev_roadmap_study_sessions 
SET start_time = created_at 
WHERE start_time IS NULL;

-- Update existing sessions to have end_time if they don't have it
UPDATE dev_roadmap_study_sessions 
SET end_time = created_at + (duration_minutes || ' minutes')::interval
WHERE end_time IS NULL AND duration_minutes > 0;

-- =============================================================================
-- FIX DAILY LOGS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_daily_logs
ALTER TABLE dev_roadmap_daily_logs 
ADD COLUMN IF NOT EXISTS activities TEXT,
ADD COLUMN IF NOT EXISTS key_takeaway TEXT,
ADD COLUMN IF NOT EXISTS reading_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS project_work_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leetcode_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS networking_minutes INTEGER DEFAULT 0;

-- =============================================================================
-- FIX PHASES TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_phases
ALTER TABLE dev_roadmap_phases 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS weeks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leetcode_target INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leetcode_completed INTEGER DEFAULT 0;

-- Update existing phases to use title (only if name exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_phases' AND column_name = 'name') THEN
        UPDATE dev_roadmap_phases 
        SET title = name 
        WHERE title IS NULL;
    END IF;
END $$;

-- Make title NOT NULL after populating it
ALTER TABLE dev_roadmap_phases 
ALTER COLUMN title SET NOT NULL;

-- Drop the name column since we're using title (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_phases' AND column_name = 'name') THEN
        ALTER TABLE dev_roadmap_phases DROP COLUMN name;
    END IF;
END $$;

-- =============================================================================
-- FIX PROJECTS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_projects
ALTER TABLE dev_roadmap_projects 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS live_url TEXT,
ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE;

-- Update existing projects to use title as name (only if title exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_projects' AND column_name = 'title') THEN
        UPDATE dev_roadmap_projects 
        SET name = title 
        WHERE name IS NULL;
    END IF;
END $$;

-- Make name NOT NULL after populating it
ALTER TABLE dev_roadmap_projects 
ALTER COLUMN name SET NOT NULL;

-- Drop the title column since we're using name (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_projects' AND column_name = 'title') THEN
        ALTER TABLE dev_roadmap_projects DROP COLUMN title;
    END IF;
END $$;

-- =============================================================================
-- FIX TOPICS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_topics
ALTER TABLE dev_roadmap_topics 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing topics to use title as name (only if title exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_topics' AND column_name = 'title') THEN
        UPDATE dev_roadmap_topics 
        SET name = title 
        WHERE name IS NULL;
    END IF;
END $$;

-- Make name NOT NULL after populating it
ALTER TABLE dev_roadmap_topics 
ALTER COLUMN name SET NOT NULL;

-- Drop the title column since we're using name (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_topics' AND column_name = 'title') THEN
        ALTER TABLE dev_roadmap_topics DROP COLUMN title;
    END IF;
END $$;

-- =============================================================================
-- FIX RESOURCES TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_resources
ALTER TABLE dev_roadmap_resources 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing resources to use title as name (only if title exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_resources' AND column_name = 'title') THEN
        UPDATE dev_roadmap_resources 
        SET name = title 
        WHERE name IS NULL;
    END IF;
END $$;

-- Make name NOT NULL after populating it
ALTER TABLE dev_roadmap_resources 
ALTER COLUMN name SET NOT NULL;

-- Drop the title column since we're using name (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'dev_roadmap_resources' AND column_name = 'title') THEN
        ALTER TABLE dev_roadmap_resources DROP COLUMN title;
    END IF;
END $$;

-- =============================================================================
-- FIX ACHIEVEMENTS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_achievements
ALTER TABLE dev_roadmap_achievements 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS unlocked_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_achievement TEXT;

-- Update existing achievements to use id as title if title is null
UPDATE dev_roadmap_achievements 
SET title = id 
WHERE title IS NULL;

-- Make title NOT NULL after populating it
ALTER TABLE dev_roadmap_achievements 
ALTER COLUMN title SET NOT NULL;

-- =============================================================================
-- ADD SAMPLE TECHNOLOGIES TO PROJECTS
-- =============================================================================

-- Update projects with sample technologies
UPDATE dev_roadmap_projects 
SET technologies = ARRAY['JavaScript', 'HTML', 'CSS']
WHERE name = 'Calculator App';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['JavaScript', 'Node.js']
WHERE name = 'Todo List';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['JavaScript', 'HTML', 'CSS']
WHERE name = 'Number Guessing Game';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Git', 'Markdown']
WHERE name = 'Git Portfolio';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['HTML', 'CSS', 'JavaScript']
WHERE name = 'Personal Portfolio Website';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'JavaScript', 'API']
WHERE name = 'Weather App';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'JavaScript', 'CSS']
WHERE name = 'E-commerce Frontend';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'JavaScript', 'WebSocket']
WHERE name = 'Social Media Dashboard';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Node.js', 'Express', 'PostgreSQL']
WHERE name = 'REST API for Blog';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['JWT', 'Node.js', 'Express']
WHERE name = 'User Authentication System';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Node.js', 'Express', 'Multer']
WHERE name = 'File Upload Service';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['SQL', 'PostgreSQL', 'Node.js']
WHERE name = 'Database Management System';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'Node.js', 'PostgreSQL']
WHERE name = 'Full Stack Blog Platform';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'Node.js', 'Stripe']
WHERE name = 'E-commerce Platform';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'Node.js', 'WebSocket']
WHERE name = 'Task Management App';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'Node.js', 'Socket.io']
WHERE name = 'Real-time Chat Application';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Docker', 'Kubernetes', 'Microservices']
WHERE name = 'Microservices Architecture';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Python', 'TensorFlow', 'FastAPI']
WHERE name = 'Machine Learning API';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['AWS', 'Docker', 'CI/CD']
WHERE name = 'Cloud-Native Application';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React Native', 'JavaScript']
WHERE name = 'Mobile App';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['React', 'Node.js', 'Portfolio']
WHERE name = 'Technical Portfolio';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Git', 'Open Source', 'GitHub']
WHERE name = 'Open Source Contribution';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Interview Prep', 'LeetCode']
WHERE name = 'Mock Interview Practice';

UPDATE dev_roadmap_projects 
SET technologies = ARRAY['Career Planning', 'Documentation']
WHERE name = 'Career Development Plan';

-- =============================================================================
-- UPDATE ACHIEVEMENT TITLES
-- =============================================================================

-- Update achievement titles to be more descriptive
UPDATE dev_roadmap_achievements 
SET title = 'First Hour of Study'
WHERE id = 'first-hour';

UPDATE dev_roadmap_achievements 
SET title = 'First Day of Study'
WHERE id = 'first-day';

UPDATE dev_roadmap_achievements 
SET title = 'First Week of Study'
WHERE id = 'first-week';

UPDATE dev_roadmap_achievements 
SET title = 'First Month of Study'
WHERE id = 'first-month';

UPDATE dev_roadmap_achievements 
SET title = 'First LeetCode Problem'
WHERE id = 'first-leetcode';

UPDATE dev_roadmap_achievements 
SET title = 'LeetCode Beginner (10 Problems)'
WHERE id = 'leetcode-10';

UPDATE dev_roadmap_achievements 
SET title = 'LeetCode Intermediate (50 Problems)'
WHERE id = 'leetcode-50';

UPDATE dev_roadmap_achievements 
SET title = 'LeetCode Advanced (100 Problems)'
WHERE id = 'leetcode-100';

UPDATE dev_roadmap_achievements 
SET title = 'First Project Completed'
WHERE id = 'first-project';

UPDATE dev_roadmap_achievements 
SET title = 'Project Builder (5 Projects)'
WHERE id = 'project-5';

UPDATE dev_roadmap_achievements 
SET title = 'Project Master (10 Projects)'
WHERE id = 'project-10';

UPDATE dev_roadmap_achievements 
SET title = 'Week Warrior (7-Day Streak)'
WHERE id = 'streak-7';

UPDATE dev_roadmap_achievements 
SET title = 'Month Master (30-Day Streak)'
WHERE id = 'streak-30';

UPDATE dev_roadmap_achievements 
SET title = 'Century Club (100-Day Streak)'
WHERE id = 'streak-100';

UPDATE dev_roadmap_achievements 
SET title = 'Dedicated Learner (10 Hours)'
WHERE id = 'hours-10';

UPDATE dev_roadmap_achievements 
SET title = 'Serious Student (50 Hours)'
WHERE id = 'hours-50';

UPDATE dev_roadmap_achievements 
SET title = 'Knowledge Seeker (100 Hours)'
WHERE id = 'hours-100';

UPDATE dev_roadmap_achievements 
SET title = 'Learning Legend (500 Hours)'
WHERE id = 'hours-500';

UPDATE dev_roadmap_achievements 
SET title = 'Foundation Phase Complete'
WHERE id = 'phase-1';

UPDATE dev_roadmap_achievements 
SET title = 'Halfway There (3 Phases)'
WHERE id = 'phase-3';

UPDATE dev_roadmap_achievements 
SET title = 'Roadmap Complete (All Phases)'
WHERE id = 'phase-6';

UPDATE dev_roadmap_achievements 
SET title = 'Roadmap Master'
WHERE id = 'roadmap-complete';

UPDATE dev_roadmap_achievements 
SET title = 'Job Ready'
WHERE id = 'job-ready';

UPDATE dev_roadmap_achievements 
SET title = 'Senior Developer'
WHERE id = 'senior-developer';

-- =============================================================================
-- CREATE INDEXES FOR STUDY SESSIONS
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON dev_roadmap_study_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_end_time ON dev_roadmap_study_sessions(end_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_phase_id ON dev_roadmap_study_sessions(phase_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic_id ON dev_roadmap_study_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_project_id ON dev_roadmap_study_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_mode ON dev_roadmap_study_sessions(mode);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check the updated schema for study sessions
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_study_sessions'
ORDER BY ordinal_position;

-- Check the updated schema for daily logs
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_daily_logs'
ORDER BY ordinal_position;

-- Show sample study sessions
SELECT 
    id,
    date,
    start_time,
    end_time,
    duration_minutes,
    mode,
    completed,
    topic
FROM dev_roadmap_study_sessions 
ORDER BY created_at DESC 
LIMIT 5;

-- Show sample projects with technologies
SELECT 
    name,
    description,
    status,
    technologies
FROM dev_roadmap_projects 
ORDER BY order_index 
LIMIT 5;
