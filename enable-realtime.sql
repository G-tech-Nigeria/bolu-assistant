-- Enable Real-time for Finance Tables
-- Run this in your Supabase SQL Editor

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
