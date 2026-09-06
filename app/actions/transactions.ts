"use server";

import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  formatActionResult,
  formatTransactionOutput,
  formDataToTransactionInput,
  parseTransactionInput,
} from "@/lib/transactions/parser";
import type { Transaction } from "@/lib/types/transaction";
import { TRANSACTION_SELECT_FIELDS } from "@/lib/types/transaction";

async function getClientOrError(): Promise<
  | {
      supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
      userId: string;
    }
  | { error: string }
> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    logger.error("Supabase client unavailable");
    return {
      error: "データベースが設定されていません。.env.local を確認してください",
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn("Unauthenticated transaction access attempt");
    return { error: "ログインが必要です" };
  }

  return { supabase, userId: user.id };
}

export async function createTransaction(formData: FormData): Promise<string> {
  logger.debug("createTransaction started");

  const parsed = parseTransactionInput(formDataToTransactionInput(formData));
  if (!parsed.ok) {
    logger.warn("Transaction input validation failed", {
      reason: parsed.error,
    });
    return formatActionResult(false, parsed.error);
  }

  const clientResult = await getClientOrError();
  if ("error" in clientResult) {
    return formatActionResult(false, clientResult.error);
  }

  const { supabase, userId } = clientResult;

  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...parsed.data, user_id: userId })
    .select(TRANSACTION_SELECT_FIELDS)
    .single();

  if (error) {
    logger.error("Failed to insert transaction", {
      code: error.code,
      message: error.message,
    });
    return formatActionResult(
      false,
      "登録に失敗しました。しばらくしてから再試行してください",
    );
  }

  const transaction = data as Transaction;
  revalidatePath("/");

  return formatActionResult(
    true,
    `登録しました — ${formatTransactionOutput(transaction)}`,
  );
}

export async function updateTransaction(
  id: string,
  formData: FormData,
): Promise<string> {
  logger.debug("updateTransaction started", { id });

  if (!id) {
    return formatActionResult(false, "更新対象が指定されていません");
  }

  const parsed = parseTransactionInput(formDataToTransactionInput(formData));
  if (!parsed.ok) {
    return formatActionResult(false, parsed.error);
  }

  const clientResult = await getClientOrError();
  if ("error" in clientResult) {
    return formatActionResult(false, clientResult.error);
  }

  const { supabase } = clientResult;

  const { data, error } = await supabase
    .from("transactions")
    .update(parsed.data)
    .eq("id", id)
    .select(TRANSACTION_SELECT_FIELDS)
    .single();

  if (error) {
    logger.error("Failed to update transaction", {
      code: error.code,
      message: error.message,
    });
    return formatActionResult(
      false,
      "更新に失敗しました。しばらくしてから再試行してください",
    );
  }

  const transaction = data as Transaction;
  revalidatePath("/");

  return formatActionResult(
    true,
    `更新しました — ${formatTransactionOutput(transaction)}`,
  );
}

export async function deleteTransaction(id: string): Promise<string> {
  logger.debug("deleteTransaction started", { id });

  if (!id) {
    return formatActionResult(false, "削除対象が指定されていません");
  }

  const clientResult = await getClientOrError();
  if ("error" in clientResult) {
    return formatActionResult(false, clientResult.error);
  }

  const { supabase } = clientResult;

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    logger.error("Failed to delete transaction", {
      code: error.code,
      message: error.message,
    });
    return formatActionResult(
      false,
      "削除に失敗しました。しばらくしてから再試行してください",
    );
  }

  revalidatePath("/");
  return formatActionResult(true, "削除しました");
}

export async function getTransactions(): Promise<{
  transactions: Transaction[];
  error: string | null;
}> {
  logger.debug("getTransactions started");

  const clientResult = await getClientOrError();
  if ("error" in clientResult) {
    return {
      transactions: [],
      error: clientResult.error,
    };
  }

  const { supabase } = clientResult;

  const { data, error } = await supabase
    .from("transactions")
    .select(TRANSACTION_SELECT_FIELDS)
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

  return {
    transactions: (data ?? []) as Transaction[],
    error: null,
  };
}
