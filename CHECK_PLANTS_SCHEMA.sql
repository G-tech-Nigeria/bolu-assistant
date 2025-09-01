-- Check Current Plants Table Structure
-- Run this first to see what columns exist

-- Check the current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'plants' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if the table exists and has any data
SELECT COUNT(*) as total_plants FROM plants;

-- Show sample data if any exists
SELECT * FROM plants LIMIT 3;
