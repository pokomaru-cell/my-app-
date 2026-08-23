import type { ParseResult, Transaction, TransactionType } from "@/lib/types/transaction";

const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isTransactionType(value: string): value is TransactionType {
  return value === "income" || value === "expense";
}

/**
 * フォームから受け取った文字列を検証し、取引データに変換する（into string）
 */
export function parseTransactionInput(input: {
  type: string;
  amount: string;
  description: string;
  transaction_date: string;
}): ParseResult {
  const type = input.type.trim();
  if (!isTransactionType(type)) {
    return { ok: false, error: "種別は income または expense を指定してください" };
  }

  const amountStr = input.amount.trim();
  if (!amountStr) {
    return { ok: false, error: "金額を入力してください" };
  }
  if (!AMOUNT_PATTERN.test(amountStr)) {
    return { ok: false, error: "金額は正の数値（小数点2桁まで）で入力してください" };
  }
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "金額は0より大きい値を入力してください" };
  }

  const description = input.description.trim();
  if (!description) {
    return { ok: false, error: "内容を入力してください" };
  }
  if (description.length > 200) {
    return { ok: false, error: "内容は200文字以内で入力してください" };
  }

  const transactionDate = input.transaction_date.trim();
  if (!DATE_PATTERN.test(transactionDate)) {
    return { ok: false, error: "日付は YYYY-MM-DD 形式で入力してください" };
  }

  return {
    ok: true,
    data: {
      type,
      amount,
      description,
      transaction_date: transactionDate,
    },
  };
}

/**
 * 取引データを表示用の文字列に整形する（out string）
 */
export function formatTransactionOutput(transaction: Transaction): string {
  const label = transaction.type === "income" ? "収入" : "支出";
  const sign = transaction.type === "income" ? "+" : "-";
  const formattedAmount = transaction.amount.toLocaleString("ja-JP");
  return `[${label}] ${transaction.transaction_date} ${transaction.description} ${sign}${formattedAmount}円`;
}

/**
 * 操作結果をユーザー向けメッセージ文字列に変換する（out string）
 */
export function formatActionResult(
  success: boolean,
  message: string,
): string {
  return success ? `OK: ${message}` : `ERROR: ${message}`;
}
