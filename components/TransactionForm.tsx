"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createTransaction } from "@/app/actions/transactions";
import {
  getCategoriesForType,
  type TransactionCategory,
} from "@/lib/constants/categories";
import { getDefaultCategory } from "@/lib/transactions/schema";
import type { TransactionType } from "@/lib/types/transaction";

const initialState = "";

function todayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const fieldClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export function TransactionForm() {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState(getDefaultCategory("expense"));
  const categories = useMemo(() => getCategoriesForType(type), [type]);

  const [result, formAction, isPending] = useActionState(
    async (_prev: string, formData: FormData) => createTransaction(formData),
    initialState,
  );

  const isSuccess = result.startsWith("OK:");
  const isError = result.startsWith("ERROR:");

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    setCategory(getDefaultCategory(nextType));
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        収入・支出を入力
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">種別</span>
          <select
            name="type"
            value={type}
            onChange={(event) =>
              handleTypeChange(event.target.value as TransactionType)
            }
            required
            className={fieldClassName}
          >
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">カテゴリ</span>
          <select
            name="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as TransactionCategory)
            }
            required
            className={fieldClassName}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">金額（円）</span>
          <input
            type="text"
            name="amount"
            inputMode="decimal"
            placeholder="1500"
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">日付</span>
          <input
            type="date"
            name="transaction_date"
            defaultValue={todayString()}
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">メモ</span>
          <input
            type="text"
            name="description"
            placeholder="スーパーで買い物"
            required
            maxLength={200}
            className={fieldClassName}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "登録中…" : "登録する"}
      </button>

      {result && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            isSuccess
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : isError
                ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          }`}
        >
          {result.replace(/^(OK|ERROR):\s*/, "")}
        </p>
      )}
    </form>
  );
}
