-- Enable Real-time for Finance Tables
-- Run this in your Supabase SQL Editor to fix the transaction refresh issue

-- Enable real-time for all finance tables
ALTER PUBLICATION supabase_realtime ADD TABLE finance_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE budgets;
ALTER PUBLICATION supabase_realtime ADD TABLE savings_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE bills;

-- Verify real-time is enabled
SELECT 
  schemaname,
  tablename,
  hasreplication
FROM pg_tables 
WHERE tablename IN ('finance_transactions', 'budgets', 'savings_goals', 'bills');

-- Check if real-time publication exists
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';

-- If the publication doesn't exist, create it
-- (This should already exist in Supabase, but just in case)
-- CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
