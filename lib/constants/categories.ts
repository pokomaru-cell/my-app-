export const TRANSACTION_CATEGORIES = [
  "食費",
  "交通費",
  "娯楽",
  "光熱費",
  "給料",
  "その他",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export const INCOME_CATEGORIES: TransactionCategory[] = ["給料", "その他"];
export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "食費",
  "交通費",
  "娯楽",
  "光熱費",
  "その他",
];

export function getCategoriesForType(
  type: "income" | "expense",
): TransactionCategory[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
