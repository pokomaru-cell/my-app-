import { TransactionRow } from "@/components/TransactionRow";
import type { Transaction } from "@/lib/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  error: string | null;
}

export function TransactionList({ transactions, error }: TransactionListProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        家計簿一覧
      </h2>

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
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </ul>
      )}
    </section>
  );
}
