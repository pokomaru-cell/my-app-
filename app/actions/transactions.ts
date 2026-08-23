"use server";

import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  formatActionResult,
  formatTransactionOutput,
  parseTransactionInput,
} from "@/lib/transactions/parser";
import type { Transaction } from "@/lib/types/transaction";

export async function createTransaction(formData: FormData): Promise<string> {
  logger.debug("createTransaction started");

  const rawInput = {
    type: String(formData.get("type") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    description: String(formData.get("description") ?? ""),
    transaction_date: String(formData.get("transaction_date") ?? ""),
  };

  logger.debug("Parsing transaction input", {
    type: rawInput.type,
    amountLength: rawInput.amount.length,
    descriptionLength: rawInput.description.length,
    hasDate: rawInput.transaction_date.length > 0,
  });

  const parsed = parseTransactionInput(rawInput);
  if (!parsed.ok) {
    logger.warn("Transaction input validation failed", {
      reason: parsed.error,
    });
    return formatActionResult(false, parsed.error);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    logger.error("Supabase client unavailable");
    return formatActionResult(
      false,
      "データベースが設定されていません。.env.local を確認してください",
    );
  }

  logger.debug("Inserting transaction into database", {
    type: parsed.data.type,
    transaction_date: parsed.data.transaction_date,
  });

  const { data, error } = await supabase
    .from("transactions")
    .insert(parsed.data)
    .select("id, type, amount, description, transaction_date, created_at")
    .single();

  if (error) {
    logger.error("Failed to insert transaction", {
      code: error.code,
      message: error.message,
    });
    return formatActionResult(false, "登録に失敗しました。しばらくしてから再試行してください");
  }

  const transaction = data as Transaction;
  logger.debug("Transaction created successfully", { id: transaction.id });

  revalidatePath("/");

  const output = formatTransactionOutput(transaction);
  return formatActionResult(true, `登録しました — ${output}`);
}

export async function getTransactions(): Promise<{
  transactions: Transaction[];
  error: string | null;
}> {
  logger.debug("getTransactions started");

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    logger.error("Supabase client unavailable for fetch");
    return {
      transactions: [],
      error: "データベースが設定されていません",
    };
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, description, transaction_date, created_at")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch transactions", {
      code: error.code,
      message: error.message,
    });
    return {
      transactions: [],
      error: "取引一覧の取得に失敗しました",
    };
  }

  logger.debug("Transactions fetched", { count: data?.length ?? 0 });

  return {
    transactions: (data ?? []) as Transaction[],
    error: null,
  };
}
