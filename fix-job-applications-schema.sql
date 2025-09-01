-- Fix Job Applications Table Schema
-- Run this in your Supabase SQL Editor

-- First, let's check the current schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns to match the expected schema
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS job_description TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS salary_range TEXT,
ADD COLUMN IF NOT EXISTS employment_type TEXT,
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'applied',
ADD COLUMN IF NOT EXISTS application_date DATE,
ADD COLUMN IF NOT EXISTS application_url TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS interview_dates JSONB,
ADD COLUMN IF NOT EXISTS documents_submitted JSONB,
ADD COLUMN IF NOT EXISTS follow_up_date DATE,
ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 3;

-- Update existing data to populate new columns
UPDATE job_applications 
SET 
    company_name = company,
    job_title = position,
    application_status = status,
    application_date = applied_date,
    priority_level = CASE 
        WHEN priority = 'high' THEN 1
        WHEN priority = 'medium' THEN 3
        WHEN priority = 'low' THEN 5
        ELSE 3
    END
WHERE company_name IS NULL;

-- Drop old columns after migration
ALTER TABLE job_applications 
DROP COLUMN IF EXISTS company,
DROP COLUMN IF EXISTS position,
DROP COLUMN IF EXISTS status,
DROP COLUMN IF EXISTS applied_date,
DROP COLUMN IF EXISTS priority;

-- Update indexes to use new column names
DROP INDEX IF EXISTS idx_job_applications_date;
DROP INDEX IF EXISTS idx_job_applications_company;
DROP INDEX IF EXISTS idx_job_applications_priority;
DROP INDEX IF EXISTS idx_job_applications_status;

CREATE INDEX IF NOT EXISTS idx_job_applications_date ON job_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_job_applications_company ON job_applications(company_name);
CREATE INDEX IF NOT EXISTS idx_job_applications_priority ON job_applications(priority_level);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);

-- Verify the updated schema
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data
SELECT 
    company_name,
    job_title,
    application_status,
    application_date,
    priority_level
FROM job_applications 
LIMIT 5;
