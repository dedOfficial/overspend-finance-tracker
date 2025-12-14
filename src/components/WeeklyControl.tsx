import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  calculateFinancialSummary,
  formatCurrency,
  getWeekDateRange,
  filterTransactionsByDateRange,
  formatDate,
  getProgressColor,
} from "../lib/financialCalculations";
import { Calendar, TrendingDown, Loader2 } from "lucide-react";
import type { TExpense, TIncome } from "../types";
import { useSettings } from "../contexts/SettingsContext/useSettings";

// TODO: create styles for the weekly control
// TODO: convert to const functional component

export function WeeklyControl() {
  const { user } = useAuth();
  const [income, setIncome] = useState<TIncome[]>([]);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incomeResult, expensesResult] = await Promise.all([
        supabase.from("income").select("*").eq("user_id", user!.id),
        supabase.from("expenses").select("*").eq("user_id", user!.id),
      ]);

      if (incomeResult.data) setIncome(incomeResult.data);
      if (expensesResult.data) setExpenses(expensesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        <p>Please configure your settings first.</p>
      </div>
    );
  }

  const summary = calculateFinancialSummary(income, expenses, settings);
  const weekRange = getWeekDateRange(settings);
  const weeklyExpenses = filterTransactionsByDateRange(
    expenses,
    weekRange.start,
    weekRange.end
  );

  const dailyExpenses: { [key: string]: number } = {};
  weeklyExpenses.forEach((expense) => {
    const date = expense.date;
    dailyExpenses[date] = (dailyExpenses[date] || 0) + Number(expense.amount);
  });

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const dailyData = [];
  for (let i = 1; i < 8; i++) {
    const date = new Date(weekRange.start);
    date.setDate(weekRange.start.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    dailyData.push({
      date: dateStr,
      dayName: getDayOfWeek(date),
      amount: dailyExpenses[dateStr] || 0,
    });
  }

  const maxDailyAmount = Math.max(...dailyData.map((d) => d.amount), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Weekly Control
        </h1>
        <p className="text-gray-600">
          {formatDate(weekRange.start)} - {formatDate(weekRange.end)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Total Spent This Week
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.weeklySpent, settings.currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {weeklyExpenses.length} transactions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Remaining Budget</h3>
          </div>
          <p
            className={`text-3xl font-bold ${
              summary.weeklyRemaining >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.weeklyRemaining, settings.currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            of {formatCurrency(summary.weeklyLimit, settings.currency)} limit
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Progress
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Weekly Budget Usage</span>
              <span className="font-medium text-gray-900">
                {summary.weeklyProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(
                  summary.weeklyProgress
                )}`}
                style={{ width: `${Math.min(100, summary.weeklyProgress)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Daily Breakdown
        </h2>
        <div className="space-y-4">
          {dailyData.map((day) => (
            <div key={day.date}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 w-12">
                    {day.dayName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDate(day.date)}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatCurrency(day.amount, settings.currency)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(day.amount / maxDailyAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Expenses
        </h2>
        {weeklyExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No expenses this week
          </p>
        ) : (
          <div className="space-y-3">
            {weeklyExpenses.slice(0, 10).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {expense.description || "No description"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(expense.date)}
                  </p>
                </div>
                <span className="font-medium text-red-600">
                  {formatCurrency(Number(expense.amount), settings.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
