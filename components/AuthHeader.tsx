import { signOut, getCurrentUser } from "@/app/actions/auth";

export async function AuthHeader() {
  const { email } = await getCurrentUser();

  if (!email) {
    return null;
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
          {email}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            ログアウト
          </button>
        </form>
      </div>
    </header>
  );
}
