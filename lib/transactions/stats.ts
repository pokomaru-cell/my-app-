import type { TransactionCategory } from "@/lib/constants/categories";
import type { Transaction } from "@/lib/types/transaction";

export interface MonthlyTotals {
  income: number;
  expense: number;
  net: number;
}

export interface CategoryExpense {
  category: TransactionCategory;
  amount: number;
}

export interface MonthlyExpensePoint {
  month: string;
  label: string;
  amount: number;
}

export function getCurrentMonthKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  return `${year}年${Number(month)}月`;
}

export function isInMonth(transactionDate: string, monthKey: string): boolean {
  return transactionDate.startsWith(monthKey);
}

export function computeMonthlyTotals(
  transactions: Transaction[],
  monthKey: string,
): MonthlyTotals {
  const filtered = transactions.filter((transaction) =>
    isInMonth(transaction.transaction_date, monthKey),
  );

  const income = filtered
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const expense = filtered
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return {
    income,
    expense,
    net: income - expense,
  };
}

export function computeCategoryExpenses(
  transactions: Transaction[],
  monthKey: string,
): CategoryExpense[] {
  const totals = new Map<TransactionCategory, number>();

  for (const transaction of transactions) {
    if (
      transaction.type !== "expense" ||
      !isInMonth(transaction.transaction_date, monthKey)
    ) {
      continue;
    }

    const current = totals.get(transaction.category) ?? 0;
    totals.set(transaction.category, current + Number(transaction.amount));
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeMonthlyExpenseTrend(
  transactions: Transaction[],
  monthCount = 6,
  referenceDate = new Date(),
): MonthlyExpensePoint[] {
  const points: MonthlyExpensePoint[] = [];

  for (let index = monthCount - 1; index >= 0; index -= 1) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - index,
      1,
    );
    const monthKey = getCurrentMonthKey(date);
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          isInMonth(transaction.transaction_date, monthKey),
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    points.push({
      month: monthKey,
      label: formatMonthLabel(monthKey),
      amount,
    });
  }

  return points;
}
