import { Database } from './supabase';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];
type Income = Database['public']['Tables']['income']['Row'];
type Expense = Database['public']['Tables']['expenses']['Row'];

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savings: number;
  dailyBudget: number;
  daysUntilZero: number | null;
  weeklySpent: number;
  weeklyLimit: number;
  weeklyRemaining: number;
  weeklyProgress: number;
  monthlySpent: number;
  monthlyLimit: number;
  monthlyRemaining: number;
  monthlyProgress: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskPercentage: number;
}

export function getMonthDateRange(settings: UserSettings, referenceDate: Date = new Date()): { start: Date; end: Date } {
  const startDay = settings.start_of_month;
  const current = new Date(referenceDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  const day = current.getDate();

  let startDate: Date;
  if (day >= startDay) {
    startDate = new Date(year, month, startDay);
  } else {
    startDate = new Date(year, month - 1, startDay);
  }

  const endMonth = startDate.getMonth() + 1;
  const endYear = startDate.getFullYear();
  const endDate = new Date(endYear, endMonth, startDay - 1, 23, 59, 59, 999);

  return { start: startDate, end: endDate };
}

export function getWeekDateRange(settings: UserSettings, referenceDate: Date = new Date()): { start: Date; end: Date } {
  const current = new Date(referenceDate);
  const currentDay = current.getDay();
  const startOfWeekDay = settings.start_of_week;

  const daysFromStart = (currentDay - startOfWeekDay + 7) % 7;

  const startDate = new Date(current);
  startDate.setDate(current.getDate() - daysFromStart);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { start: startDate, end: endDate };
}

export function filterTransactionsByDateRange(
  transactions: (Income | Expense)[],
  start: Date,
  end: Date
): (Income | Expense)[] {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
}

export function calculateTotalAmount(transactions: (Income | Expense)[]): number {
  return transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
}

export function calculateDailyBudget(
  balance: number,
  settings: UserSettings,
  referenceDate: Date = new Date()
): number {
  if (settings.daily_budget_mode === 'fixed') {
    return Number(settings.fixed_daily_budget);
  }

  const monthRange = getMonthDateRange(settings, referenceDate);
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(monthRange.end);
  endDate.setHours(0, 0, 0, 0);

  const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return balance > 0 ? balance / daysRemaining : 0;
}

export function calculateDaysUntilZero(
  balance: number,
  expenses: Expense[],
  referenceDate: Date = new Date()
): number | null {
  if (balance <= 0) return 0;

  const last30Days = new Date(referenceDate);
  last30Days.setDate(last30Days.getDate() - 30);

  const recentExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= last30Days && expenseDate <= referenceDate;
  });

  if (recentExpenses.length === 0) return null;

  const totalRecentExpenses = calculateTotalAmount(recentExpenses);
  const averageDailyExpense = totalRecentExpenses / 30;

  if (averageDailyExpense === 0) return null;

  return Math.floor(balance / averageDailyExpense);
}

export function calculateRiskLevel(
  spent: number,
  limit: number,
  settings: UserSettings
): { level: 'low' | 'medium' | 'high' | 'critical'; percentage: number } {
  if (limit === 0) {
    return { level: 'low', percentage: 0 };
  }

  const percentage = (spent / limit) * 100;

  let level: 'low' | 'medium' | 'high' | 'critical';
  if (percentage >= 100) {
    level = 'critical';
  } else if (percentage >= settings.risk_threshold_high) {
    level = 'high';
  } else if (percentage >= settings.risk_threshold_medium) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return { level, percentage };
}

export function calculateFinancialSummary(
  income: Income[],
  expenses: Expense[],
  settings: UserSettings,
  referenceDate: Date = new Date()
): FinancialSummary {
  const monthRange = getMonthDateRange(settings, referenceDate);
  const weekRange = getWeekDateRange(settings, referenceDate);

  const monthlyIncome = filterTransactionsByDateRange(income, monthRange.start, monthRange.end);
  const monthlyExpenses = filterTransactionsByDateRange(expenses, monthRange.start, monthRange.end);
  const weeklyExpenses = filterTransactionsByDateRange(expenses, weekRange.start, weekRange.end);

  const totalIncome = calculateTotalAmount(monthlyIncome);
  const totalExpenses = calculateTotalAmount(monthlyExpenses);
  const balance = totalIncome - totalExpenses;

  const monthlySpent = totalExpenses;
  const monthlyLimit = Number(settings.monthly_expense_limit);
  const monthlyRemaining = Math.max(0, monthlyLimit - monthlySpent);
  const monthlyProgress = monthlyLimit > 0 ? Math.min(100, (monthlySpent / monthlyLimit) * 100) : 0;

  const weeklySpent = calculateTotalAmount(weeklyExpenses);
  const weeklyLimit = Number(settings.weekly_expense_limit);
  const weeklyRemaining = Math.max(0, weeklyLimit - weeklySpent);
  const weeklyProgress = weeklyLimit > 0 ? Math.min(100, (weeklySpent / weeklyLimit) * 100) : 0;

  const dailyBudget = calculateDailyBudget(balance, settings, referenceDate);
  const daysUntilZero = calculateDaysUntilZero(balance, expenses, referenceDate);

  const monthlyRisk = calculateRiskLevel(monthlySpent, monthlyLimit, settings);

  const monthlyIncomeTarget = Number(settings.monthly_income_target);
  const savings = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    balance,
    savings,
    dailyBudget,
    daysUntilZero,
    weeklySpent,
    weeklyLimit,
    weeklyRemaining,
    weeklyProgress,
    monthlySpent,
    monthlyLimit,
    monthlyRemaining,
    monthlyProgress,
    riskLevel: monthlyRisk.level,
    riskPercentage: monthlyRisk.percentage,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRiskColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage < 50) return 'bg-green-500';
  if (percentage < 75) return 'bg-yellow-500';
  if (percentage < 90) return 'bg-orange-500';
  return 'bg-red-500';
}
