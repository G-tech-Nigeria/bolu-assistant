-- Fix Dev Roadmap Schema Mismatch
-- Run this in your Supabase SQL Editor

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
-- FIX DAILY LOGS TABLE SCHEMA
-- =============================================================================

-- Add missing columns to dev_roadmap_daily_logs
ALTER TABLE dev_roadmap_daily_logs 
ADD COLUMN IF NOT EXISTS hours_spent NUMERIC(4,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS leetcode_problems INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS key_takeaway TEXT;

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
-- VERIFICATION
-- =============================================================================

-- Check the updated schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_projects'
ORDER BY ordinal_position;

-- Show sample projects with technologies
SELECT 
    name,
    description,
    status,
    technologies
FROM dev_roadmap_projects 
ORDER BY order_index 
LIMIT 5;
