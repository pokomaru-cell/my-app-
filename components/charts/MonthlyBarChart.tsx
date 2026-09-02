"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyExpensePoint } from "@/lib/transactions/stats";

const chartConfig = {
  amount: {
    label: "支出",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface MonthlyBarChartProps {
  data: MonthlyExpensePoint[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  if (data.every((point) => point.amount === 0)) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        月ごとの支出データがありません。
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="aspect-[16/10] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tickLine={false} axisLine={false} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
