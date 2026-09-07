"use client";

import { useMemo, useState, useTransition } from "react";
import {
  deleteTransaction,
  updateTransaction,
} from "@/app/actions/transactions";
import { getCategoriesForType, type TransactionCategory } from "@/lib/constants/categories";
import { formatTransactionDescription } from "@/lib/transactions/parser";
import { getDefaultCategory } from "@/lib/transactions/schema";
import type { Transaction, TransactionType } from "@/lib/types/transaction";

interface TransactionRowProps {
  transaction: Transaction;
}

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

function formatAmount(type: Transaction["type"], amount: number): string {
  const formatted = amount.toLocaleString("ja-JP");
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [category, setCategory] = useState(transaction.category);
  const categories = useMemo(() => getCategoriesForType(type), [type]);

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType);
    if (!getCategoriesForType(nextType).includes(category)) {
      setCategory(getDefaultCategory(nextType));
    }
  }

  function handleUpdate(formData: FormData) {
    startTransition(async () => {
      const result = await updateTransaction(transaction.id, formData);
      setMessage(result.replace(/^(OK|ERROR):\s*/, ""));
      if (result.startsWith("OK:")) {
        setIsEditing(false);
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("この取引を削除しますか？")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteTransaction(transaction.id);
      setMessage(result.replace(/^(OK|ERROR):\s*/, ""));
    });
  }

  if (isEditing) {
    return (
      <li className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
        <form action={handleUpdate} className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">種別</span>
            <select
              name="type"
              value={type}
              onChange={(event) =>
                handleTypeChange(event.target.value as TransactionType)
              }
              className={fieldClassName}
            >
              <option value="expense">支出</option>
              <option value="income">収入</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">カテゴリ</span>
            <select
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as TransactionCategory)
              }
              className={fieldClassName}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">金額</span>
            <input
              type="text"
              name="amount"
              defaultValue={String(transaction.amount)}
              className={fieldClassName}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">日付</span>
            <input
              type="date"
              name="transaction_date"
              defaultValue={transaction.transaction_date}
              className={fieldClassName}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="text-zinc-600 dark:text-zinc-400">メモ（任意）</span>
            <input
              type="text"
              name="description"
              defaultValue={transaction.description}
              maxLength={200}
              className={fieldClassName}
            />
          </label>

          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600"
            >
              キャンセル
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 py-3 text-sm">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {transaction.category}
          </span>
          <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
            {formatTransactionDescription(transaction.description)}
          </p>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          {transaction.transaction_date}
        </p>
        {message && <p className="mt-1 text-xs text-zinc-500">{message}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`font-semibold ${
            transaction.type === "income"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatAmount(transaction.type, Number(transaction.amount))}円
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
          className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-600"
        >
          編集
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400"
        >
          削除
        </button>
      </div>
    </li>
  );
}
