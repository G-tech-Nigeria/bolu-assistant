-- Debug script to check agenda_tasks table
-- Run this in your Supabase SQL editor

-- Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'agenda_tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check current data
SELECT 
  id,
  title,
  description,
  completed,
  date,
  priority,
  task_order,
  created_at
FROM agenda_tasks 
WHERE date = CURRENT_DATE
ORDER BY task_order, created_at;

-- Check all dates with data
SELECT 
  date,
  COUNT(*) as task_count
FROM agenda_tasks 
GROUP BY date
ORDER BY date DESC
LIMIT 10;

-- Check notifications table for agenda notifications
SELECT 
  id,
  title,
  body,
  category,
  type,
  scheduled_for,
  read,
  sent_at,
  data
FROM notifications 
WHERE category = 'agenda'
AND scheduled_for >= CURRENT_DATE
ORDER BY scheduled_for;
