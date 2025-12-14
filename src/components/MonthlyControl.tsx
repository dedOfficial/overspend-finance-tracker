import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import {
  calculateFinancialSummary,
  formatCurrency,
  getMonthDateRange,
  filterTransactionsByDateRange,
  formatDate,
  getProgressColor,
  getRiskColor,
} from "../lib/financialCalculations";
import { TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext/useSettings";
import type { TCategory, TExpense, TIncome } from "../types";

// TODO: create styles for the monthly control
// TODO: convert to const functional component

export function MonthlyControl() {
  const { user } = useAuth();
  const [income, setIncome] = useState<TIncome[]>([]);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incomeResult, expensesResult, categoriesResult] =
        await Promise.all([
          supabase.from("income").select("*").eq("user_id", user!.id),
          supabase.from("expenses").select("*").eq("user_id", user!.id),
          supabase.from("categories").select("*").eq("user_id", user!.id),
        ]);

      if (incomeResult.data) setIncome(incomeResult.data);
      if (expensesResult.data) setExpenses(expensesResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
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
  const monthRange = getMonthDateRange(settings);
  const monthlyIncome = filterTransactionsByDateRange(
    income,
    monthRange.start,
    monthRange.end
  );
  const monthlyExpenses = filterTransactionsByDateRange(
    expenses,
    monthRange.start,
    monthRange.end
  );

  const expensesByCategory = categories
    .filter((c) => c.type === "expense")
    .map((category) => {
      const categoryExpenses = monthlyExpenses.filter(
        (e) => e.category_id === category.id
      );
      const total = categoryExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      const percentage =
        category.budget_limit > 0 ? (total / category.budget_limit) * 100 : 0;

      return {
        category,
        total,
        percentage,
        remaining: Math.max(0, category.budget_limit - total),
      };
    })
    .filter((item) => item.total > 0 || item.category.budget_limit > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Monthly Control
        </h1>
        <p className="text-gray-600">
          {formatDate(monthRange.start)} - {formatDate(monthRange.end)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Income</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalIncome, settings.currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {monthlyIncome.length} transactions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalExpenses, settings.currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {monthlyExpenses.length} transactions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Net Balance</h3>
          </div>
          <p
            className={`text-2xl font-bold ${
              summary.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(summary.balance, settings.currency)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {summary.balance >= 0 ? "Surplus" : "Deficit"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Overview
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Monthly Expense Limit</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(summary.monthlySpent, settings.currency)} /{" "}
                {formatCurrency(summary.monthlyLimit, settings.currency)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getProgressColor(
                  summary.monthlyProgress
                )}`}
                style={{ width: `${Math.min(100, summary.monthlyProgress)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {formatCurrency(summary.monthlyRemaining, settings.currency)}{" "}
              remaining
            </p>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl border p-6 ${getRiskColor(summary.riskLevel)}`}
      >
        <h2 className="text-lg font-semibold mb-2">Risk Assessment</h2>
        <p className="text-2xl font-bold mb-2 capitalize">
          {summary.riskLevel} Risk
        </p>
        <p className="text-sm">
          You have spent {summary.riskPercentage.toFixed(1)}% of your monthly
          expense limit.
          {summary.riskLevel === "critical" &&
            " Consider reducing spending immediately."}
          {summary.riskLevel === "high" && " Monitor your spending closely."}
          {summary.riskLevel === "medium" && " Keep an eye on your expenses."}
          {summary.riskLevel === "low" &&
            " Your spending is well within limits."}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Expenses by Category
        </h2>
        {expensesByCategory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No expense data for this month
          </p>
        ) : (
          <div className="space-y-4">
            {expensesByCategory.map((item) => (
              <div key={item.category.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {item.category.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(item.total, settings.currency)}
                    {item.category.budget_limit > 0 && (
                      <span className="text-gray-400">
                        {" "}
                        /{" "}
                        {formatCurrency(
                          item.category.budget_limit,
                          settings.currency
                        )}
                      </span>
                    )}
                  </span>
                </div>
                {item.category.budget_limit > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(
                        item.percentage
                      )}`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
