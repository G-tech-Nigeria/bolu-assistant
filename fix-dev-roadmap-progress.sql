-- Fix Dev Roadmap Progress and Remove Duplicates
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- CLEAN UP DUPLICATE DATA
-- =============================================================================

-- Remove duplicate phases (keep only the first occurrence)
DELETE FROM dev_roadmap_phases 
WHERE id NOT IN (
    SELECT DISTINCT ON (title) id 
    FROM dev_roadmap_phases 
    ORDER BY title, created_at
);

-- Remove duplicate topics (keep only the first occurrence)
DELETE FROM dev_roadmap_topics 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, phase_id) id 
    FROM dev_roadmap_topics 
    ORDER BY name, phase_id, created_at
);

-- Remove duplicate projects (keep only the first occurrence)
DELETE FROM dev_roadmap_projects 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, phase_id) id 
    FROM dev_roadmap_projects 
    ORDER BY name, phase_id, created_at
);

-- Remove duplicate resources (keep only the first occurrence)
DELETE FROM dev_roadmap_resources 
WHERE id NOT IN (
    SELECT DISTINCT ON (name, topic_id) id 
    FROM dev_roadmap_resources 
    ORDER BY name, topic_id, created_at
);

-- Remove duplicate achievements (keep only the first occurrence)
DELETE FROM dev_roadmap_achievements 
WHERE id NOT IN (
    SELECT DISTINCT ON (id) id 
    FROM dev_roadmap_achievements 
    ORDER BY id, created_at
);

-- =============================================================================
-- CREATE PROGRESS CALCULATION FUNCTION
-- =============================================================================

-- Create a function to calculate phase progress
CREATE OR REPLACE FUNCTION calculate_phase_progress(phase_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_items INTEGER;
    completed_items INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Count total topics and projects
    SELECT 
        COALESCE(COUNT(DISTINCT t.id), 0) + COALESCE(COUNT(DISTINCT p.id), 0)
    INTO total_items
    FROM dev_roadmap_phases ph
    LEFT JOIN dev_roadmap_topics t ON ph.id = t.phase_id
    LEFT JOIN dev_roadmap_projects p ON ph.id = p.phase_id
    WHERE ph.id = phase_uuid;
    
    -- Count completed topics and projects
    SELECT 
        COALESCE(COUNT(DISTINCT t.id), 0) + COALESCE(COUNT(DISTINCT p.id), 0)
    INTO completed_items
    FROM dev_roadmap_phases ph
    LEFT JOIN dev_roadmap_topics t ON ph.id = t.phase_id AND t.completed = true
    LEFT JOIN dev_roadmap_projects p ON ph.id = p.phase_id AND p.status = 'completed'
    WHERE ph.id = phase_uuid;
    
    -- Calculate percentage
    IF total_items = 0 THEN
        progress_percentage := 0;
    ELSE
        progress_percentage := ROUND((completed_items::DECIMAL / total_items::DECIMAL) * 100);
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- UPDATE PHASE PROGRESS
-- =============================================================================

-- Update progress for all phases
UPDATE dev_roadmap_phases 
SET progress = calculate_phase_progress(id);

-- =============================================================================
-- CREATE TRIGGER TO AUTO-UPDATE PROGRESS
-- =============================================================================

-- Create trigger function to update progress when topics/projects change
CREATE OR REPLACE FUNCTION update_phase_progress_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Update progress for the affected phase
    UPDATE dev_roadmap_phases 
    SET progress = calculate_phase_progress(NEW.phase_id)
    WHERE id = NEW.phase_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for topics
DROP TRIGGER IF EXISTS update_phase_progress_on_topic_change ON dev_roadmap_topics;
CREATE TRIGGER update_phase_progress_on_topic_change
    AFTER INSERT OR UPDATE OR DELETE ON dev_roadmap_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_phase_progress_trigger();

-- Create triggers for projects
DROP TRIGGER IF EXISTS update_phase_progress_on_project_change ON dev_roadmap_projects;
CREATE TRIGGER update_phase_progress_on_project_change
    AFTER INSERT OR UPDATE OR DELETE ON dev_roadmap_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_phase_progress_trigger();

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Show phases with their progress
SELECT 
    title,
    description,
    status,
    progress,
    (SELECT COUNT(*) FROM dev_roadmap_topics WHERE phase_id = p.id) as total_topics,
    (SELECT COUNT(*) FROM dev_roadmap_topics WHERE phase_id = p.id AND completed = true) as completed_topics,
    (SELECT COUNT(*) FROM dev_roadmap_projects WHERE phase_id = p.id) as total_projects,
    (SELECT COUNT(*) FROM dev_roadmap_projects WHERE phase_id = p.id AND status = 'completed') as completed_projects
FROM dev_roadmap_phases p
ORDER BY order_index;

-- Show data counts to verify no duplicates
SELECT 'Phases' as table_name, COUNT(*) as count FROM dev_roadmap_phases
UNION ALL
SELECT 'Topics' as table_name, COUNT(*) as count FROM dev_roadmap_topics
UNION ALL
SELECT 'Projects' as table_name, COUNT(*) as count FROM dev_roadmap_projects
UNION ALL
SELECT 'Resources' as table_name, COUNT(*) as count FROM dev_roadmap_resources
UNION ALL
SELECT 'Achievements' as table_name, COUNT(*) as count FROM dev_roadmap_achievements;
