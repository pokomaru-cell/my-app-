export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
}

export interface ParsedTransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
}

export type ParseResult =
  | { ok: true; data: ParsedTransactionInput }
  | { ok: false; error: string };
