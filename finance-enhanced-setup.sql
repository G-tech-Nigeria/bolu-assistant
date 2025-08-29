-- Enhanced Finance Tables Setup
-- Run this in your Supabase SQL Editor

-- ===== BUDGETS TABLE =====
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  budget_limit DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) DEFAULT 0,
  period TEXT DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SAVINGS GOALS TABLE =====
CREATE TABLE IF NOT EXISTS savings_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  target_date DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== BILLS TABLE =====
CREATE TABLE IF NOT EXISTS bills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  category TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly', 'once')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_savings_goals_category ON savings_goals(category);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_category ON bills(category);

-- ===== RLS POLICIES =====
-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;

-- Budgets policies
CREATE POLICY "Enable read access for all users" ON budgets FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON budgets FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON budgets FOR DELETE USING (true);

-- Savings goals policies
CREATE POLICY "Enable read access for all users" ON savings_goals FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON savings_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON savings_goals FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON savings_goals FOR DELETE USING (true);

-- Bills policies
CREATE POLICY "Enable read access for all users" ON bills FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON bills FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON bills FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON bills FOR DELETE USING (true);

-- ===== SAMPLE DATA =====
-- Sample budgets
INSERT INTO budgets (category, budget_limit, spent, period) VALUES
('Food', 500.00, 320.00, 'monthly'),
('Transport', 200.00, 150.00, 'monthly'),
('Entertainment', 300.00, 280.00, 'monthly'),
('Shopping', 400.00, 250.00, 'monthly'),
('Bills', 800.00, 750.00, 'monthly')
ON CONFLICT DO NOTHING;

-- Sample savings goals
INSERT INTO savings_goals (name, target_amount, current_amount, target_date, category) VALUES
('Emergency Fund', 10000.00, 6500.00, '2024-12-31', 'Emergency'),
('Vacation Fund', 5000.00, 1200.00, '2024-06-30', 'Travel'),
('New Car Fund', 15000.00, 3000.00, '2025-03-31', 'Transport'),
('House Deposit', 50000.00, 15000.00, '2026-12-31', 'Housing')
ON CONFLICT DO NOTHING;

-- Sample bills
INSERT INTO bills (name, amount, due_date, category, is_recurring, frequency, status) VALUES
('Rent', 1200.00, '2024-01-01', 'Housing', true, 'monthly', 'pending'),
('Electricity', 150.00, '2024-01-15', 'Utilities', true, 'monthly', 'pending'),
('Car Insurance', 800.00, '2024-03-01', 'Insurance', true, 'yearly', 'pending'),
('Internet', 80.00, '2024-01-20', 'Utilities', true, 'monthly', 'pending'),
('Phone Bill', 45.00, '2024-01-25', 'Utilities', true, 'monthly', 'pending'),
('Gym Membership', 60.00, '2024-01-10', 'Health', true, 'monthly', 'pending'),
('Netflix', 15.99, '2024-01-30', 'Entertainment', true, 'monthly', 'pending')
ON CONFLICT DO NOTHING;

-- ===== FUNCTIONS =====
-- Function to update budget spent amount based on transactions
CREATE OR REPLACE FUNCTION update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
  -- Update budget spent when a transaction is added/updated
  IF NEW.type = 'expense' THEN
    UPDATE budgets 
    SET spent = spent + NEW.amount,
        updated_at = NOW()
    WHERE category = NEW.category;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update budget spent
CREATE TRIGGER update_budget_on_transaction
  AFTER INSERT OR UPDATE ON finance_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_spent();

-- Function to get budget alerts
CREATE OR REPLACE FUNCTION get_budget_alerts()
RETURNS TABLE (
  category TEXT,
  budget_limit DECIMAL(10,2),
  spent DECIMAL(10,2),
  percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.category,
    b.budget_limit,
    b.spent,
    (b.spent / b.budget_limit) * 100 as percentage
  FROM budgets b
  WHERE (b.spent / b.budget_limit) >= 0.8
  ORDER BY percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming bills
CREATE OR REPLACE FUNCTION get_upcoming_bills(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  id UUID,
  name TEXT,
  amount DECIMAL(10,2),
  due_date DATE,
  category TEXT,
  days_until_due INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.amount,
    b.due_date,
    b.category,
    b.due_date - CURRENT_DATE as days_until_due
  FROM bills b
  WHERE b.status = 'pending'
    AND b.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + days_ahead
  ORDER BY b.due_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get savings progress
CREATE OR REPLACE FUNCTION get_savings_progress()
RETURNS TABLE (
  total_goals DECIMAL(10,2),
  total_current DECIMAL(10,2),
  overall_progress DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(target_amount), 0) as total_goals,
    COALESCE(SUM(current_amount), 0) as total_current,
    CASE 
      WHEN SUM(target_amount) > 0 THEN (SUM(current_amount) / SUM(target_amount)) * 100
      ELSE 0
    END as overall_progress
  FROM savings_goals;
END;
$$ LANGUAGE plpgsql;
