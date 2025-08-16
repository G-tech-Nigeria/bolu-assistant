-- Add task_order column to agenda_tasks table
-- This migration adds a task_order column to maintain the original chronological order of tasks

-- Add the task_order column
ALTER TABLE agenda_tasks 
ADD COLUMN IF NOT EXISTS task_order INTEGER DEFAULT 0;

-- Create an index on task_order for better performance
CREATE INDEX IF NOT EXISTS idx_agenda_tasks_order 
ON agenda_tasks(date, task_order);

-- Update existing tasks to have a default order based on creation time
-- This ensures existing data has some order
UPDATE agenda_tasks 
SET task_order = EXTRACT(EPOCH FROM (created_at - '1970-01-01'::timestamp))::integer
WHERE task_order = 0;

-- Add a comment to document the column
COMMENT ON COLUMN agenda_tasks.task_order IS 'Order of tasks to maintain chronological sequence';
