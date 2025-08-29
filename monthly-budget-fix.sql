-- Monthly Budget System Fix
-- Run this in your Supabase SQL Editor

-- ===== UPDATE BUDGETS TABLE =====
-- Add month tracking to budgets
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS current_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE);
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS current_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);

-- ===== NEW FUNCTION: Calculate Monthly Budget Spent =====
CREATE OR REPLACE FUNCTION calculate_monthly_budget_spent(budget_category TEXT, target_month INTEGER, target_year INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_spent DECIMAL(10,2) := 0;
BEGIN
  -- Calculate total spent for the specific month and category
  SELECT COALESCE(SUM(amount), 0) INTO total_spent
  FROM finance_transactions 
  WHERE category = budget_category 
    AND type = 'expense'
    AND EXTRACT(MONTH FROM date::DATE) = target_month
    AND EXTRACT(YEAR FROM date::DATE) = target_year;
  
  RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- ===== UPDATED FUNCTION: Update Budget Spent =====
CREATE OR REPLACE FUNCTION update_budget_spent()
RETURNS TRIGGER AS $$
DECLARE
  current_month_val INTEGER;
  current_year_val INTEGER;
  new_spent DECIMAL(10,2);
BEGIN
  -- Only process expense transactions
  IF NEW.type = 'expense' THEN
    current_month_val := EXTRACT(MONTH FROM NEW.date::DATE);
    current_year_val := EXTRACT(YEAR FROM NEW.date::DATE);
    
    -- Calculate new spent amount for this month
    new_spent := calculate_monthly_budget_spent(NEW.category, current_month_val, current_year_val);
    
    -- Update budget with new monthly spent amount
    UPDATE budgets 
    SET spent = new_spent,
        current_month = current_month_val,
        current_year = current_year_val,
        updated_at = NOW()
    WHERE category = NEW.category;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== NEW FUNCTION: Reset Monthly Budgets =====
CREATE OR REPLACE FUNCTION reset_monthly_budgets()
RETURNS VOID AS $$
DECLARE
  current_month_val INTEGER;
  current_year_val INTEGER;
  budget_record RECORD;
BEGIN
  current_month_val := EXTRACT(MONTH FROM CURRENT_DATE);
  current_year_val := EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Loop through all monthly budgets
  FOR budget_record IN 
    SELECT id, category 
    FROM budgets 
    WHERE period = 'monthly'
  LOOP
    -- Calculate spent for current month
    UPDATE budgets 
    SET spent = calculate_monthly_budget_spent(budget_record.category, current_month_val, current_year_val),
        current_month = current_month_val,
        current_year = current_year_val,
        updated_at = NOW()
    WHERE id = budget_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ===== DROP EXISTING FUNCTION BEFORE RECREATING =====
DROP FUNCTION IF EXISTS get_budget_alerts();

-- ===== UPDATED FUNCTION: Get Budget Alerts =====
CREATE OR REPLACE FUNCTION get_budget_alerts()
RETURNS TABLE (
  category TEXT,
  budget_limit DECIMAL(10,2),
  spent DECIMAL(10,2),
  percentage DECIMAL(5,2),
  month_year TEXT
) AS $$
DECLARE
  current_month_val INTEGER;
  current_year_val INTEGER; 
BEGIN
  current_month_val := EXTRACT(MONTH FROM CURRENT_DATE);
  current_year_val := EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Reset budgets to current month
  PERFORM reset_monthly_budgets();
  
  RETURN QUERY
  SELECT 
    b.category,
    b.budget_limit,
    b.spent,
    CASE 
      WHEN b.budget_limit > 0 THEN (b.spent / b.budget_limit) * 100
      ELSE 0
    END as percentage,
    TO_CHAR(DATE(current_year_val || '-' || current_month_val || '-01'), 'Month YYYY') as month_year
  FROM budgets b
  WHERE b.period = 'monthly'
    AND (b.spent / b.budget_limit) >= 0.8
  ORDER BY percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- ===== DROP EXISTING FUNCTION BEFORE RECREATING =====
DROP FUNCTION IF EXISTS get_monthly_budget_summary(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS get_monthly_budget_summary(INTEGER);
DROP FUNCTION IF EXISTS get_monthly_budget_summary();

-- ===== NEW FUNCTION: Get Monthly Budget Summary =====
CREATE OR REPLACE FUNCTION get_monthly_budget_summary(target_month INTEGER DEFAULT NULL, target_year INTEGER DEFAULT NULL)
RETURNS TABLE (
  category TEXT,
  budget_limit DECIMAL(10,2),
  spent DECIMAL(10,2),
  remaining DECIMAL(10,2),
  percentage DECIMAL(5,2),
  month_year TEXT
) AS $$
DECLARE
  month_val INTEGER;
  year_val INTEGER;
BEGIN
  -- Use current month/year if not specified
  month_val := COALESCE(target_month, EXTRACT(MONTH FROM CURRENT_DATE));
  year_val := COALESCE(target_year, EXTRACT(YEAR FROM CURRENT_DATE));
  
  RETURN QUERY
  SELECT 
    b.category,
    b.budget_limit,
    calculate_monthly_budget_spent(b.category, month_val, year_val) as spent,
    b.budget_limit - calculate_monthly_budget_spent(b.category, month_val, year_val) as remaining,
    CASE 
      WHEN b.budget_limit > 0 THEN (calculate_monthly_budget_spent(b.category, month_val, year_val) / b.budget_limit) * 100
      ELSE 0
    END as percentage,
    TO_CHAR(DATE(year_val || '-' || month_val || '-01'), 'Month YYYY') as month_year
  FROM budgets b
  WHERE b.period = 'monthly'
  ORDER BY b.category;
END;
$$ LANGUAGE plpgsql;

-- ===== UPDATE EXISTING BUDGETS =====
-- Reset all existing budgets to current month
SELECT reset_monthly_budgets();

-- ===== SAMPLE DATA UPDATE =====
-- Update sample budgets to show current month spending
UPDATE budgets 
SET spent = calculate_monthly_budget_spent(category, EXTRACT(MONTH FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE)),
    current_month = EXTRACT(MONTH FROM CURRENT_DATE),
    current_year = EXTRACT(YEAR FROM CURRENT_DATE)
WHERE period = 'monthly';
