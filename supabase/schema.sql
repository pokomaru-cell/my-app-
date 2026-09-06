-- 家計簿: 収入・支出テーブル

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'その他'
    CHECK (category IN ('食費', '交通費', '娯楽', '光熱費', '給料', 'その他')),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);

-- 日ごとの収入・支出・合計ビュー
CREATE OR REPLACE VIEW daily_summary
WITH (security_invoker = true) AS
SELECT
  transaction_date AS date,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)  AS total_income,
  COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0)
  - COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS net_total
FROM transactions
GROUP BY transaction_date
ORDER BY transaction_date DESC;

-- 月ごとの収入・支出・合計ビュー
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

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);
