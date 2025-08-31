-- Fix notifications table schema to handle sent_at properly

-- Check current table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- Update sent_at column to allow NULL temporarily (if needed)
ALTER TABLE notifications 
ALTER COLUMN sent_at DROP NOT NULL;

-- Add default value for sent_at
ALTER TABLE notifications 
ALTER COLUMN sent_at SET DEFAULT NOW();

-- Make sent_at NOT NULL again with default
ALTER TABLE notifications 
ALTER COLUMN sent_at SET NOT NULL;

-- Update any existing notifications with NULL sent_at
UPDATE notifications 
SET sent_at = COALESCE(sent_at, created_at, NOW())
WHERE sent_at IS NULL;

-- Verify the fix
SELECT 
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN sent_at IS NULL THEN 1 END) as null_sent_at,
    COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as valid_sent_at
FROM notifications;
