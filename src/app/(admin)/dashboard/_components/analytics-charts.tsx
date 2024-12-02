"use client";

import { formatPrice } from "@/lib/format";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface AnalyticsChartsProps {
  data: {
    name: string;
    total: number;
  }[];
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${formatPrice(value)}`}
          />
          <Bar dataKey="total" fill="" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
