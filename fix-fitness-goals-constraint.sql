-- Fix Fitness Goals Unique Constraint
-- Run this in your Supabase SQL Editor

-- Add unique constraint for upsert operations
ALTER TABLE fitness_goals 
ADD CONSTRAINT fitness_goals_goal_type_period_user_id_unique 
UNIQUE (goal_type, period, user_id);

-- Verify the constraint was added
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'fitness_goals' 
AND constraint_type = 'UNIQUE';
