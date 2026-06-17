"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Lightbulb,
  ListChecks,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

const COLORS = [
  "#2563eb",
  "#db2777",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#0891b2",
  "#ef4444",
];

export function DashboardOverview({ accounts, transactions }) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((account) => account.isDefault)?.id || accounts[0]?.id
  );
  const [activeView, setActiveView] = useState("insights");

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const accountTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.accountId === selectedAccountId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, selectedAccountId]
  );

  const availableMonths = useMemo(() => {
    const monthMap = new Map();
    accountTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          key,
          label: format(new Date(date.getFullYear(), date.getMonth(), 1), "MMMM yyyy"),
          timestamp: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
        });
      }
    });

    return Array.from(monthMap.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [accountTransactions]);

  const currentMonthKey = format(new Date(), "yyyy-MM");
  const defaultMonth =
    availableMonths.find((month) => month.key === currentMonthKey)?.key ||
    availableMonths[0]?.key ||
    currentMonthKey;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const monthKey = availableMonths.some((month) => month.key === selectedMonth)
    ? selectedMonth
    : defaultMonth;

  const monthlyTransactions = accountTransactions.filter((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return key === monthKey;
  });

  const monthlyIncome = monthlyTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthlyExpense = monthlyTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const netCashflow = monthlyIncome - monthlyExpense;

  const expensesByCategory = monthlyTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ name: category, value: amount }))
    .sort((a, b) => b.value - a.value);

  const topCategory = pieChartData[0] || null;
  const biggestTransaction = monthlyTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .sort((a, b) => b.amount - a.amount)[0];
  const monthLabel =
    availableMonths.find((month) => month.key === monthKey)?.label ||
    format(new Date(), "MMMM yyyy");
  const averageExpense =
    monthlyTransactions.filter((transaction) => transaction.type === "EXPENSE").length > 0
      ? monthlyExpense /
        monthlyTransactions.filter((transaction) => transaction.type === "EXPENSE").length
      : 0;

  const insights = [
    topCategory
      ? `Your largest category in ${monthLabel} is ${topCategory.name} at ${formatCurrency(
          topCategory.value
        )}.`
      : `No expense categories are recorded for ${monthLabel}.`,
    biggestTransaction
      ? `Largest single spend: ${biggestTransaction.description || "Untitled"} for ${formatCurrency(
          biggestTransaction.amount
        )}.`
      : "No single expense has been logged for this month.",
    netCashflow >= 0
      ? `Positive cashflow of ${formatCurrency(netCashflow)}. You can move a portion to savings.`
      : `Cashflow is negative by ${formatCurrency(Math.abs(netCashflow))}. Review discretionary spends first.`,
  ];

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/50 shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-200/70 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Monthly Money Hub</CardTitle>
            <p className="text-sm text-muted-foreground">
              Switch months, view insights, and audit transactions for {selectedAccount?.name || "your account"}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-full bg-white sm:w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={monthKey} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full bg-white sm:w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.length > 0 ? (
                  availableMonths.map((month) => (
                    <SelectItem key={month.key} value={month.key}>
                      {month.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={currentMonthKey}>
                    {format(new Date(), "MMMM yyyy")}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard icon={TrendingUp} label="Income" value={formatCurrency(monthlyIncome)} tone="text-emerald-600" />
            <MetricCard icon={TrendingDown} label="Expenses" value={formatCurrency(monthlyExpense)} tone="text-rose-600" />
            <MetricCard
              icon={Target}
              label="Net Cashflow"
              value={formatCurrency(netCashflow)}
              tone={netCashflow >= 0 ? "text-emerald-600" : "text-rose-600"}
            />
            <MetricCard
              icon={CalendarDays}
              label="Avg Expense"
              value={formatCurrency(averageExpense)}
              detail={`${monthlyTransactions.length} transactions`}
              tone="text-blue-600"
            />
          </div>

          <div className="flex w-full rounded-lg border border-slate-200 bg-white p-1 sm:w-fit">
            <ViewButton active={activeView === "insights"} onClick={() => setActiveView("insights")} icon={Lightbulb}>
              Monthly Insights
            </ViewButton>
            <ViewButton active={activeView === "transactions"} onClick={() => setActiveView("transactions")} icon={ListChecks}>
              Transactions
            </ViewButton>
          </div>

          {activeView === "insights" ? (
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
                  <p className="text-sm text-muted-foreground">{monthLabel}</p>
                </CardHeader>
                <CardContent className="p-0 pb-5">
                  {pieChartData.length === 0 ? (
                    <EmptyState title="No expenses to visualize" description="Add an expense or choose another month." />
                  ) : (
                    <div className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={54}
                            outerRadius={104}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: "hsl(var(--popover))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "var(--radius)",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Actionable Insights</CardTitle>
                  <p className="text-sm text-muted-foreground">Quick read before you spend again.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={insight} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase text-slate-500">Insight {index + 1}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{insight}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Transactions in {monthLabel}</CardTitle>
                <p className="text-sm text-muted-foreground">Sorted from newest to oldest.</p>
              </CardHeader>
              <CardContent className="max-h-[420px] overflow-auto">
                {monthlyTransactions.length === 0 ? (
                  <EmptyState title="No transactions this month" description="Choose another month or add a transaction." />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {monthlyTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between gap-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {transaction.description || "Untitled Transaction"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "PP")} · {transaction.category}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "flex shrink-0 items-center text-sm font-bold",
                            transaction.type === "EXPENSE" ? "text-rose-600" : "text-emerald-600"
                          )}
                        >
                          {transaction.type === "EXPENSE" ? (
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                          )}
                          {formatCurrency(
                            transaction.type === "EXPENSE" ? -transaction.amount : transaction.amount,
                            { signed: true }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ViewButton({ active, onClick, icon: Icon, children }) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={cn("flex-1 rounded-md sm:flex-none", active && "shadow-sm")}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Button>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-xl bg-slate-100 p-2.5">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
          <p className={`truncate text-lg font-bold ${tone}`}>{value}</p>
          {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-center">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
