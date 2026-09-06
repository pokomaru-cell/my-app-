"use client";

import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";

const initialState = "";

const fieldClassName =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export function LoginForm() {
  const [signInMessage, signInAction, isSigningIn] = useActionState(
    async (_prev: string, formData: FormData) => signIn(formData),
    initialState,
  );
  const [signUpMessage, signUpAction, isSigningUp] = useActionState(
    async (_prev: string, formData: FormData) => signUp(formData),
    initialState,
  );

  return (
    <div className="grid gap-8">
      <form action={signInAction} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          ログイン
        </h2>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            メールアドレス
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            パスワード
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            minLength={8}
            className={fieldClassName}
          />
        </label>

        <button
          type="submit"
          disabled={isSigningIn}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isSigningIn ? "ログイン中…" : "ログイン"}
        </button>

        {signInMessage && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {signInMessage}
          </p>
        )}
      </form>

      <form action={signUpAction} className="flex flex-col gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          新規登録
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          初めての方はこちらからアカウントを作成してください。
        </p>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            メールアドレス
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            パスワード
          </span>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={fieldClassName}
          />
        </label>

        <button
          type="submit"
          disabled={isSigningUp}
          className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          {isSigningUp ? "登録中…" : "アカウントを作成"}
        </button>

        {signUpMessage && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {signUpMessage}
          </p>
        )}
      </form>
    </div>
  );
}
