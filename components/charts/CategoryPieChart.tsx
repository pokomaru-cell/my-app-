"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { CategoryExpense } from "@/lib/transactions/stats";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface CategoryPieChartProps {
  data: CategoryExpense[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        今月の支出データがありません。
      </p>
    );
  }

  const chartConfig = data.reduce<ChartConfig>((config, item, index) => {
    config[item.category] = {
      label: item.category,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
    return config;
  }, {});

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((item, index) => (
            <Cell
              key={item.category}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
