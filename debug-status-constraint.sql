-- Debug Status Constraint Issue
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- CHECK CURRENT CONSTRAINT DEFINITION
-- =============================================================================

-- Check the exact constraint definition
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'dev_roadmap_phases'::regclass 
AND contype = 'c';

-- =============================================================================
-- CHECK CURRENT DATA
-- =============================================================================

-- Show all current status values in phases
SELECT 
    status,
    COUNT(*) as count,
    string_agg(title, ', ') as sample_titles
FROM dev_roadmap_phases 
GROUP BY status 
ORDER BY status;

-- Show all current status values in projects
SELECT 
    status,
    COUNT(*) as count,
    string_agg(name, ', ') as sample_names
FROM dev_roadmap_projects 
GROUP BY status 
ORDER BY status;

-- =============================================================================
-- TEST CONSTRAINT MANUALLY
-- =============================================================================

-- Test if 'not-started' is accepted by the constraint
SELECT 
    'not-started' as test_value,
    'not-started' IN ('not-started', 'in-progress', 'completed') as is_valid;

-- Test if 'in-progress' is accepted by the constraint
SELECT 
    'in-progress' as test_value,
    'in-progress' IN ('not-started', 'in-progress', 'completed') as is_valid;

-- Test if 'completed' is accepted by the constraint
SELECT 
    'completed' as test_value,
    'completed' IN ('not-started', 'in-progress', 'completed') as is_valid;

-- =============================================================================
-- SHOW TABLE STRUCTURE
-- =============================================================================

-- Show the phases table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_phases'
ORDER BY ordinal_position;

-- Show the projects table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_projects'
ORDER BY ordinal_position;
