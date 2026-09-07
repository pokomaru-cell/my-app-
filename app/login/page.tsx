import { LoginForm } from "@/components/LoginForm";

function getAuthErrorMessage(error: string | undefined): string | null {
  if (error === "auth") {
    return "Googleログインに失敗しました。もう一度お試しください。";
  }
  if (error === "config") {
    return "認証設定を確認してください。";
  }
  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authErrorMessage = getAuthErrorMessage(params.error);

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            家計簿にログイン
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Google アカウントまたはメールアドレスでログインできます。
          </p>
        </header>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <LoginForm authErrorMessage={authErrorMessage} />
        </div>
      </main>
    </div>
  );
}
