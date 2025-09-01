-- Complete Constraint Fix
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- REMOVE ALL EXISTING CONSTRAINTS
-- =============================================================================

-- Remove all check constraints from phases
ALTER TABLE dev_roadmap_phases 
DROP CONSTRAINT IF EXISTS dev_roadmap_phases_status_check;

-- Remove all check constraints from projects
ALTER TABLE dev_roadmap_projects 
DROP CONSTRAINT IF EXISTS dev_roadmap_projects_status_check;

-- =============================================================================
-- CLEAN UP ALL DATA
-- =============================================================================

-- Update all phases to have valid status
UPDATE dev_roadmap_phases 
SET status = 'not-started' 
WHERE status IS NULL OR status NOT IN ('not-started', 'in-progress', 'completed');

-- Update all projects to have valid status
UPDATE dev_roadmap_projects 
SET status = 'not-started' 
WHERE status IS NULL OR status NOT IN ('not-started', 'in-progress', 'completed');

-- =============================================================================
-- RECREATE CONSTRAINTS
-- =============================================================================

-- Add constraint to phases
ALTER TABLE dev_roadmap_phases 
ADD CONSTRAINT dev_roadmap_phases_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- Add constraint to projects
ALTER TABLE dev_roadmap_projects 
ADD CONSTRAINT dev_roadmap_projects_status_check 
CHECK (status IN ('not-started', 'in-progress', 'completed'));

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Verify constraints were created
SELECT 
    'dev_roadmap_phases' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_phases'::regclass 
AND contype = 'c'

UNION ALL

SELECT 
    'dev_roadmap_projects' as table_name,
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_projects'::regclass 
AND contype = 'c';

-- Test inserting valid data
INSERT INTO dev_roadmap_phases (title, description, status, order_index) 
VALUES ('Test Phase', 'Test Description', 'not-started', 999)
ON CONFLICT DO NOTHING;

-- Clean up test data
DELETE FROM dev_roadmap_phases WHERE title = 'Test Phase';

-- Show final status counts
SELECT 
    'Phases' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_phases 
GROUP BY status 
ORDER BY status

UNION ALL

SELECT 
    'Projects' as table_type,
    status,
    COUNT(*) as count
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;
