-- Fix Project Status Constraint
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- CHECK CURRENT CONSTRAINT
-- =============================================================================

-- Check the current constraint on dev_roadmap_projects
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_projects'::regclass 
AND contype = 'c';

-- =============================================================================
-- FIX STATUS CONSTRAINT
-- =============================================================================

-- Drop the existing constraint if it exists
ALTER TABLE dev_roadmap_projects 
DROP CONSTRAINT IF EXISTS dev_roadmap_projects_status_check;

-- Add the correct constraint
ALTER TABLE dev_roadmap_projects 
ADD CONSTRAINT dev_roadmap_projects_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- =============================================================================
-- UPDATE ANY INVALID STATUS VALUES
-- =============================================================================

-- Update any status values that don't match the constraint
UPDATE dev_roadmap_projects 
SET status = 'not-started' 
WHERE status NOT IN ('not-started', 'in-progress', 'completed');

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check the updated constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_projects'::regclass 
AND contype = 'c';

-- Show current status values
SELECT 
    status,
    COUNT(*) as count
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;

-- Show sample projects
SELECT 
    name,
    status,
    description
FROM dev_roadmap_projects 
ORDER BY created_at 
LIMIT 5;
