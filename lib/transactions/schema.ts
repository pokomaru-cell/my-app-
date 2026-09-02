import { z } from "zod";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSACTION_CATEGORIES,
} from "@/lib/constants/categories";
import type { TransactionType } from "@/lib/types/transaction";

const categorySchema = z.enum(TRANSACTION_CATEGORIES);

const rawTransactionFields = {
  type: z.enum(["income", "expense"], {
    error: "種別は income または expense を指定してください",
  }),
  amount: z
    .string()
    .trim()
    .min(1, "金額を入力してください")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "金額は正の数値（小数点2桁まで）で入力してください",
    )
    .transform(Number)
    .refine((value) => Number.isFinite(value) && value > 0, {
      message: "金額は0より大きい値を入力してください",
    }),
  description: z
    .string()
    .trim()
    .min(1, "メモを入力してください")
    .max(200, "メモは200文字以内で入力してください"),
  category: categorySchema,
  transaction_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD 形式で入力してください"),
};

export const transactionInputSchema = z
  .object(rawTransactionFields)
  .superRefine((data, ctx) => {
    const allowed =
      data.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!allowed.includes(data.category)) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "種別に合ったカテゴリを選択してください",
      });
    }
  });

export const transactionFormSchema = z.object({
  type: z.string(),
  amount: z.string(),
  description: z.string(),
  category: z.string(),
  transaction_date: z.string(),
});

export type TransactionFormInput = z.infer<typeof transactionFormSchema>;

export function parseTransactionFormInput(
  input: TransactionFormInput,
): z.ZodSafeParseResult<z.infer<typeof transactionInputSchema>> {
  return transactionInputSchema.safeParse(input);
}

export function getDefaultCategory(type: TransactionType): z.infer<typeof categorySchema> {
  return type === "income" ? "給料" : "食費";
}
