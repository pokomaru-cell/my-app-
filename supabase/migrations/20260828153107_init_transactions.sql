-- 家計簿: 収入・支出テーブル
-- Mirrors supabase/schema.sql so the local Supabase stack seeds this table automatically.

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (transaction_date DESC);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read" ON transactions;
CREATE POLICY "Allow public read" ON transactions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON transactions;
CREATE POLICY "Allow public insert" ON transactions
  FOR INSERT WITH CHECK (true);
