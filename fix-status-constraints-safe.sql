-- Fix Status Constraints Safely
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- CHECK CURRENT STATUS VALUES
-- =============================================================================

-- Check current status values in phases
SELECT 
    'Phases' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_phases 
GROUP BY status 
ORDER BY status;

-- Check current status values in projects
SELECT 
    'Projects' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;

-- =============================================================================
-- UPDATE EXISTING DATA FIRST
-- =============================================================================

-- Update phases with invalid status values
UPDATE dev_roadmap_phases 
SET status = 'not-started' 
WHERE status IS NULL OR status NOT IN ('not-started', 'in-progress', 'completed');

-- Update projects with invalid status values
UPDATE dev_roadmap_projects 
SET status = 'not-started' 
WHERE status IS NULL OR status NOT IN ('not-started', 'in-progress', 'completed');

-- =============================================================================
-- NOW APPLY CONSTRAINTS
-- =============================================================================

-- Drop existing constraints
ALTER TABLE dev_roadmap_phases 
DROP CONSTRAINT IF EXISTS dev_roadmap_phases_status_check;

ALTER TABLE dev_roadmap_projects 
DROP CONSTRAINT IF EXISTS dev_roadmap_projects_status_check;

-- Add correct constraints
ALTER TABLE dev_roadmap_phases 
ADD CONSTRAINT dev_roadmap_phases_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

ALTER TABLE dev_roadmap_projects 
ADD CONSTRAINT dev_roadmap_projects_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Verify phases constraint
SELECT 
    'dev_roadmap_phases' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_phases'::regclass 
AND contype = 'c';

-- Verify projects constraint
SELECT 
    'dev_roadmap_projects' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_projects'::regclass 
AND contype = 'c';

-- Show final status values for phases
SELECT 
    'Phases' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_phases 
GROUP BY status 
ORDER BY status;

-- Show final status values for projects
SELECT 
    'Projects' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;

-- Show sample phases
SELECT 
    title,
    status,
    description
FROM dev_roadmap_phases 
ORDER BY order_index 
LIMIT 5;

-- Show sample projects
SELECT 
    name,
    status,
    description
FROM dev_roadmap_projects 
ORDER BY order_index 
LIMIT 5;
