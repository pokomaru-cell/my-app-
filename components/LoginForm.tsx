"use client";

import { useActionState } from "react";
import { signIn, signUp } from "@/app/actions/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { PasswordInput } from "@/components/PasswordInput";

const initialState = "";

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

interface LoginFormProps {
  authErrorMessage?: string | null;
}

export function LoginForm({ authErrorMessage }: LoginFormProps) {
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
      {authErrorMessage && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {authErrorMessage}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <GoogleSignInButton />
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          またはメールアドレスで続行
        </p>
      </div>

      <form action={signInAction} className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          ログイン
        </h2>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="sign-in-email">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            メールアドレス
          </span>
          <input
            id="sign-in-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="sign-in-password">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            パスワード
          </span>
          <PasswordInput
            id="sign-in-password"
            name="password"
            autoComplete="current-password"
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

      <form
        action={signUpAction}
        className="flex flex-col gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800"
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          新規登録
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          初めての方はこちらからアカウントを作成してください。
        </p>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="sign-up-email">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            メールアドレス
          </span>
          <input
            id="sign-up-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className={fieldClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm" htmlFor="sign-up-password">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            パスワード
          </span>
          <PasswordInput
            id="sign-up-password"
            name="password"
            autoComplete="new-password"
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
