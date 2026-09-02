import type { ParseResult, Transaction } from "@/lib/types/transaction";
import {
  parseTransactionFormInput,
  type TransactionFormInput,
} from "@/lib/transactions/schema";

export function parseTransactionInput(
  input: TransactionFormInput,
): ParseResult {
  const parsed = parseTransactionFormInput(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message ?? "入力内容を確認してください",
    };
  }

  return { ok: true, data: parsed.data };
}

export function formatTransactionOutput(transaction: Transaction): string {
  const label = transaction.type === "income" ? "収入" : "支出";
  const sign = transaction.type === "income" ? "+" : "-";
  const formattedAmount = transaction.amount.toLocaleString("ja-JP");
  return `[${label}] ${transaction.transaction_date} ${transaction.category} ${transaction.description} ${sign}${formattedAmount}円`;
}

export function formatActionResult(
  success: boolean,
  message: string,
): string {
  return success ? `OK: ${message}` : `ERROR: ${message}`;
}

export function formDataToTransactionInput(
  formData: FormData,
): TransactionFormInput {
  return {
    type: String(formData.get("type") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    transaction_date: String(formData.get("transaction_date") ?? ""),
  };
}
