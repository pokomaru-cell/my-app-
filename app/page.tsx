import { getTransactions } from "@/app/actions/transactions";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { MonthlySummary } from "@/components/MonthlySummary";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import {
  computeCategoryExpenses,
  computeMonthlyExpenseTrend,
  computeMonthlyTotals,
  getCurrentMonthKey,
} from "@/lib/transactions/stats";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { transactions, error } = await getTransactions();
  const monthKey = getCurrentMonthKey();
  const monthlyTotals = computeMonthlyTotals(transactions, monthKey);
  const categoryExpenses = computeCategoryExpenses(transactions, monthKey);
  const monthlyExpenseTrend = computeMonthlyExpenseTrend(transactions);

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            家計簿
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            収入と支出を記録して、月ごとの集計とカテゴリ別の支出を確認できます。
          </p>
        </header>

        <TransactionForm />
        <MonthlySummary totals={monthlyTotals} monthKey={monthKey} />

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              カテゴリ別支出（今月）
            </h2>
            <CategoryPieChart data={categoryExpenses} />
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              月ごとの支出
            </h2>
            <MonthlyBarChart data={monthlyExpenseTrend} />
          </div>
        </section>

        <TransactionList transactions={transactions} error={error} />
      </main>
    </div>
  );
}
