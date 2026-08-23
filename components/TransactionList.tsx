import { formatTransactionOutput } from "@/lib/transactions/parser";
import type { Transaction } from "@/lib/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  error: string | null;
}

function formatAmount(type: Transaction["type"], amount: number): string {
  const formatted = amount.toLocaleString("ja-JP");
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}

export function TransactionList({ transactions, error }: TransactionListProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        取引一覧
      </h2>

      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
          <p className="text-zinc-500 dark:text-zinc-400">収入</p>
          <p className="font-semibold text-emerald-700 dark:text-emerald-300">
            {totalIncome.toLocaleString("ja-JP")}円
          </p>
        </div>
        <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950">
          <p className="text-zinc-500 dark:text-zinc-400">支出</p>
          <p className="font-semibold text-red-700 dark:text-red-300">
            {totalExpense.toLocaleString("ja-JP")}円
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">残高</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            {balance.toLocaleString("ja-JP")}円
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {error}
        </p>
      )}

      {!error && transactions.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          まだ取引がありません。上のフォームから登録してください。
        </p>
      )}

      {transactions.length > 0 && (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {transaction.description}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  {formatTransactionOutput(transaction)}
                </p>
              </div>
              <span
                className={`shrink-0 font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatAmount(transaction.type, Number(transaction.amount))}円
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
