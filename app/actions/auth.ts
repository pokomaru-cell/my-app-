"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseAuthCredentials } from "@/lib/auth/schema";
import { logger } from "@/lib/logger";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function credentialsFromFormData(formData: FormData): {
  email: string;
  password: string;
} {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

async function getSupabaseOrError(): Promise<
  | { supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>> }
  | { error: string }
> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      error: "認証が設定されていません。.env.local を確認してください",
    };
  }

  return { supabase };
}

export async function signIn(formData: FormData): Promise<string> {
  const parsed = parseAuthCredentials(credentialsFromFormData(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "入力内容を確認してください";
  }

  const clientResult = await getSupabaseOrError();
  if ("error" in clientResult) {
    return clientResult.error;
  }

  const { supabase } = clientResult;
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    logger.warn("Sign in failed", { message: error.message });
    return "ログインに失敗しました。メールアドレスとパスワードを確認してください";
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(formData: FormData): Promise<string> {
  const parsed = parseAuthCredentials(credentialsFromFormData(formData));
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "入力内容を確認してください";
  }

  const clientResult = await getSupabaseOrError();
  if ("error" in clientResult) {
    return clientResult.error;
  }

  const { supabase } = clientResult;
  const { data, error } = await supabase.auth.signUp(parsed.data);

  if (error) {
    logger.warn("Sign up failed", { message: error.message });
    return "登録に失敗しました。入力内容を確認してください";
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return "確認メールを送信しました。メール内のリンクから登録を完了してください";
}

export async function signOut(): Promise<void> {
  const clientResult = await getSupabaseOrError();
  if ("error" in clientResult) {
    redirect("/login");
  }

  const { supabase } = clientResult;
  const { error } = await supabase.auth.signOut();

  if (error) {
    logger.error("Sign out failed", { message: error.message });
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getCurrentUser(): Promise<{
  email: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { email: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { email: user?.email ?? null };
}
