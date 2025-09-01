-- Final Study Sessions Fix
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- ENSURE STUDY SESSIONS TABLE HAS ALL REQUIRED FIELDS
-- =============================================================================

-- Add any missing columns to dev_roadmap_study_sessions
ALTER TABLE dev_roadmap_study_sessions 
ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'focus',
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES dev_roadmap_projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS topic TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing sessions to have proper date if missing
UPDATE dev_roadmap_study_sessions 
SET date = created_at::date 
WHERE date IS NULL;

-- Update existing sessions to have start_time if missing
UPDATE dev_roadmap_study_sessions 
SET start_time = created_at 
WHERE start_time IS NULL;

-- Update existing sessions to have end_time if missing
UPDATE dev_roadmap_study_sessions 
SET end_time = created_at + (duration_minutes || ' minutes')::interval
WHERE end_time IS NULL AND duration_minutes > 0;

-- =============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON dev_roadmap_study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_start_time ON dev_roadmap_study_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_end_time ON dev_roadmap_study_sessions(end_time);
CREATE INDEX IF NOT EXISTS idx_study_sessions_phase_id ON dev_roadmap_study_sessions(phase_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic_id ON dev_roadmap_study_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_project_id ON dev_roadmap_study_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_mode ON dev_roadmap_study_sessions(mode);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed ON dev_roadmap_study_sessions(completed);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Check the final schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'dev_roadmap_study_sessions'
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
