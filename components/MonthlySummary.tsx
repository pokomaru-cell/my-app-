import type { MonthlyTotals } from "@/lib/transactions/stats";
import { formatMonthLabel, getCurrentMonthKey } from "@/lib/transactions/stats";

interface MonthlySummaryProps {
  totals: MonthlyTotals;
  monthKey?: string;
}

export function MonthlySummary({
  totals,
  monthKey = getCurrentMonthKey(),
}: MonthlySummaryProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        月ごとの集計（{formatMonthLabel(monthKey)}）
      </h2>

      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-950">
          <p className="text-zinc-500 dark:text-zinc-400">今月の収入</p>
          <p className="font-semibold text-emerald-700 dark:text-emerald-300">
            {totals.income.toLocaleString("ja-JP")}円
          </p>
        </div>
        <div className="rounded-lg bg-red-50 px-3 py-2 dark:bg-red-950">
          <p className="text-zinc-500 dark:text-zinc-400">今月の支出</p>
          <p className="font-semibold text-red-700 dark:text-red-300">
            {totals.expense.toLocaleString("ja-JP")}円
          </p>
        </div>
        <div className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">差額</p>
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">
            {totals.net.toLocaleString("ja-JP")}円
          </p>
        </div>
      </div>
    </section>
  );
}
