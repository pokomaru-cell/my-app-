import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .max(72, "パスワードは72文字以内で入力してください"),
});

export type AuthCredentialsInput = z.infer<typeof authCredentialsSchema>;

export function parseAuthCredentials(
  input: AuthCredentialsInput,
): z.ZodSafeParseResult<AuthCredentialsInput> {
  return authCredentialsSchema.safeParse(input);
}
