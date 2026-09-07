-- Allow empty memo (description) while keeping max length

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_description_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_description_check
  CHECK (char_length(description) <= 200);
