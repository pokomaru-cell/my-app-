import type { TransactionCategory } from "@/lib/constants/categories";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: TransactionCategory;
  transaction_date: string;
  created_at: string;
}

export interface ParsedTransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  category: TransactionCategory;
  transaction_date: string;
}

export type ParseResult =
  | { ok: true; data: ParsedTransactionInput }
  | { ok: false; error: string };

export const TRANSACTION_SELECT_FIELDS =
  "id, type, amount, description, category, transaction_date, created_at" as const;
