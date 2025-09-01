-- Add a test task that will trigger notifications in the next few minutes
-- Run this in your Supabase SQL editor

-- First, let's add a test task for 2 minutes from now
INSERT INTO agenda_tasks (
  title,
  description,
  completed,
  date,
  priority,
  task_order
) VALUES (
  'Test Task - Due Soon',
  '5:30pm', -- This will trigger notification at 5:25pm
  false,
  CURRENT_DATE,
  'high',
  999
);

-- Check what we just added
SELECT 
  id,
  title,
  description,
  completed,
  date,
  task_order
FROM agenda_tasks 
WHERE title = 'Test Task - Due Soon'
AND date = CURRENT_DATE;
