-- Fix All Status Constraints
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- FIX PHASES STATUS CONSTRAINT
-- =============================================================================

-- Drop the existing constraint if it exists
ALTER TABLE dev_roadmap_phases 
DROP CONSTRAINT IF EXISTS dev_roadmap_phases_status_check;

-- Add the correct constraint (using hyphens to match component)
ALTER TABLE dev_roadmap_phases 
ADD CONSTRAINT dev_roadmap_phases_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- Update any invalid status values
UPDATE dev_roadmap_phases 
SET status = 'not-started' 
WHERE status NOT IN ('not-started', 'in-progress', 'completed');

-- =============================================================================
-- FIX PROJECTS STATUS CONSTRAINT
-- =============================================================================

-- Drop the existing constraint if it exists
ALTER TABLE dev_roadmap_projects 
DROP CONSTRAINT IF EXISTS dev_roadmap_projects_status_check;

-- Add the correct constraint (using hyphens to match component)
ALTER TABLE dev_roadmap_projects 
ADD CONSTRAINT dev_roadmap_projects_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- Update any invalid status values
UPDATE dev_roadmap_projects 
SET status = 'not-started' 
WHERE status NOT IN ('not-started', 'in-progress', 'completed');

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check phases constraint
SELECT 
    'dev_roadmap_phases' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_phases'::regclass 
AND contype = 'c';

-- Check projects constraint
SELECT 
    'dev_roadmap_projects' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_projects'::regclass 
AND contype = 'c';

-- Show current status values for phases
SELECT 
    'Phases' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_phases 
GROUP BY status 
ORDER BY status;

-- Show current status values for projects
SELECT 
    'Projects' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;
