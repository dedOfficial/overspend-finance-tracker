import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  calculateFinancialSummary,
  formatCurrency,
  getRiskColor,
  getProgressColor,
} from "../../lib/financialCalculations";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Calendar,
  AlertCircle,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../ui/Button";
import type { TIncome } from "../../types";
import type { TExpense } from "../../types";
import { useSettings } from "../../contexts/SettingsContext/useSettings";
import { StatCard } from "./StatCard";
import { Loader } from "../../ui/Loader";

// TODO: create styles for the dashboard

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<TIncome[]>([]);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const { settings } = useSettings();

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [incomeResult, expensesResult] = await Promise.all([
        supabase
          .from("income")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
      ]);

      if (incomeResult.data) setIncome(incomeResult.data);
      if (expensesResult.data) setExpenses(expensesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  if (loading) {
    return <Loader fullWidth />;
  }

  if (!settings) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        <p className="mb-2">Please configure your settings first.</p>
        <Button
          onClick={() => navigate("/settings")}
          color="warning"
          size="medium"
          icon={Settings}
        >
          Go to Settings
        </Button>
      </div>
    );
  }

  const summary = calculateFinancialSummary(income, expenses, settings);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Your financial overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={TrendingUp}
          label="Total Income"
          value={formatCurrency(summary.totalIncome, settings.currency)}
          subValue="This month"
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          icon={TrendingDown}
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses, settings.currency)}
          subValue="This month"
          colorClass="bg-red-100 text-red-600"
        />
        <StatCard
          icon={Wallet}
          label="Current Balance"
          value={formatCurrency(summary.balance, settings.currency)}
          subValue={summary.balance >= 0 ? "Available" : "Overspent"}
          colorClass={
            summary.balance >= 0
              ? "bg-blue-100 text-blue-600"
              : "bg-red-100 text-red-600"
          }
        />
        <StatCard
          icon={PiggyBank}
          label="Daily Budget"
          value={formatCurrency(summary.dailyBudget, settings.currency)}
          subValue="Per day remaining"
          colorClass="bg-indigo-100 text-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Status
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(summary.weeklySpent, settings.currency)} /{" "}
                  {formatCurrency(summary.weeklyLimit, settings.currency)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(
                    summary.weeklyProgress
                  )}`}
                  style={{ width: `${Math.min(100, summary.weeklyProgress)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {formatCurrency(summary.weeklyRemaining, settings.currency)}{" "}
                remaining
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Status
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(summary.monthlySpent, settings.currency)} /{" "}
                  {formatCurrency(summary.monthlyLimit, settings.currency)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getProgressColor(
                    summary.monthlyProgress
                  )}`}
                  style={{
                    width: `${Math.min(100, summary.monthlyProgress)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {formatCurrency(summary.monthlyRemaining, settings.currency)}{" "}
                remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`rounded-xl border p-6 ${getRiskColor(summary.riskLevel)}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Risk Level</h2>
          </div>
          <p className="text-3xl font-bold mb-2 capitalize">
            {summary.riskLevel}
          </p>
          <p className="text-sm">
            You've spent {summary.riskPercentage.toFixed(1)}% of your monthly
            limit
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Runway</h2>
          </div>
          {summary.daysUntilZero !== null ? (
            <>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {summary.daysUntilZero} days
              </p>
              <p className="text-sm text-gray-600">
                Until funds reach zero at current spending rate
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Not enough data to calculate
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
