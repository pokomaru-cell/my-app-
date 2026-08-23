import { getTransactions } from "@/app/actions/transactions";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { transactions, error } = await getTransactions();

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            家計簿
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            収入と支出を記録して、残高を確認できます。
          </p>
        </header>

        <TransactionForm />
        <TransactionList transactions={transactions} error={error} />
      </main>
    </div>
  );
}
