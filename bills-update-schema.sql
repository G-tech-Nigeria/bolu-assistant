-- Add paidDate column to bills table
ALTER TABLE bills ADD COLUMN IF NOT EXISTS paid_date DATE;

-- Update existing bills to have a default paid_date if they are marked as paid
UPDATE bills SET paid_date = CURRENT_DATE WHERE status = 'paid' AND paid_date IS NULL;

-- Add index for better performance on paid_date queries
CREATE INDEX IF NOT EXISTS idx_bills_paid_date ON bills(paid_date);

-- Update the get_upcoming_bills function to exclude paid bills
CREATE OR REPLACE FUNCTION get_upcoming_bills()
RETURNS TABLE (
  id UUID,
  name TEXT,
  amount DECIMAL,
  due_date DATE,
  category TEXT,
  is_recurring BOOLEAN,
  frequency TEXT,
  status TEXT,
  notes TEXT,
  paid_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.amount,
    b.due_date,
    b.category,
    b.is_recurring,
    b.frequency,
    b.status,
    b.notes,
    b.paid_date
  FROM bills b
  WHERE b.status != 'paid'  -- Exclude paid bills
  ORDER BY b.due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Update sample data to include paid_date for some bills
UPDATE bills 
SET paid_date = '2024-01-15', status = 'paid' 
WHERE name = 'Electricity' AND status = 'pending';

-- Add a new sample paid bill
INSERT INTO bills (id, name, amount, due_date, category, is_recurring, frequency, status, notes, paid_date) 
VALUES (
  gen_random_uuid(),
  'Internet Bill',
  80,
  '2024-01-10',
  'Utilities',
  true,
  'monthly',
  'paid',
  'Monthly internet service',
  '2024-01-10'
) ON CONFLICT DO NOTHING;
