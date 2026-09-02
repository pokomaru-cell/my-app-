-- Migration: add category, monthly_summary, update/delete policies
-- Run in Supabase SQL Editor if not applied via MCP

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'その他';

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_category_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_category_check
  CHECK (category IN ('食費', '交通費', '娯楽', '光熱費', '給料', 'その他'));

CREATE OR REPLACE VIEW monthly_summary
WITH (security_invoker = true) AS
SELECT
  date_trunc('month', transaction_date)::date AS month,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)  AS total_income,
  COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)
  - COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS net_total
FROM transactions
GROUP BY date_trunc('month', transaction_date)
ORDER BY month DESC;

DROP POLICY IF EXISTS "Allow public update" ON transactions;
DROP POLICY IF EXISTS "Allow public delete" ON transactions;

CREATE POLICY "Allow public update" ON transactions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON transactions
  FOR DELETE USING (true);
