"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/currency";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("ALL");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    const filtered = transactions.filter((t) => new Date(t.date) >= startDate);

    // Group transactions by date
    const grouped = filtered.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      const key = format(transactionDate, "yyyy-MM-dd");
      if (!acc[key]) {
        acc[key] = {
          key,
          date: format(transactionDate, "MMM d"),
          income: 0,
          expense: 0,
        };
      }
      if (transaction.type === "INCOME") {
        acc[key].income += transaction.amount;
      } else {
        acc[key].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => a.key.localeCompare(b.key));
  }, [transactions, dateRange]);

  // Calculate totals for the selected period
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);
  const hasChartData = filteredData.some((day) => day.income > 0 || day.expense > 0);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Cashflow Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            Income and expenses grouped by transaction date.
          </p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, range]) => (
              <SelectItem key={key} value={key}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-3 mb-6 text-sm sm:grid-cols-3">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              {formatCurrency(totals.income)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              {formatCurrency(totals.expense)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(totals.income - totals.expense)}
            </p>
          </div>
        </div>
        {hasChartData ? (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), undefined]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  minPointSize={6}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  minPointSize={6}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed bg-slate-50 text-center">
            <div>
              <p className="text-lg font-semibold">No chartable transactions</p>
              <p className="text-sm text-muted-foreground">
                Add income or expenses, or switch the date range to All Time.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
