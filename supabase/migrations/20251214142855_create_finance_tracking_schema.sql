/*
  # Personal Finance Tracking App - Database Schema

  ## Overview
  Complete database schema for personal finance tracking application with categories,
  income/expense tracking, and user settings.

  ## New Tables
  
  ### `user_profiles`
  Stores user profile information and preferences
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `categories`
  Defines income and expense categories with budget limits
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `name` (text) - Category name (e.g., "Groceries", "Salary")
  - `type` (text) - Either "income" or "expense"
  - `budget_limit` (numeric) - Monthly budget limit for this category
  - `color` (text) - Hex color for UI display
  - `icon` (text) - Icon name for UI display
  - `is_active` (boolean) - Whether category is currently active
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `income`
  Records all income transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `category_id` (uuid, references categories)
  - `amount` (numeric) - Income amount
  - `date` (date) - Transaction date
  - `description` (text) - Optional description
  - `notes` (text) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `expenses`
  Records all expense transactions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `category_id` (uuid, references categories)
  - `amount` (numeric) - Expense amount
  - `date` (date) - Transaction date
  - `description` (text) - Optional description
  - `notes` (text) - Additional notes
  - `is_recurring` (boolean) - Whether this is a recurring expense
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_settings`
  Stores user-specific application settings
  - `id` (uuid, primary key)
  - `user_id` (uuid, unique, references user_profiles)
  - `currency` (text) - Currency code (USD, EUR, etc.)
  - `monthly_income_target` (numeric) - Target monthly income
  - `monthly_expense_limit` (numeric) - Maximum monthly expenses
  - `weekly_expense_limit` (numeric) - Maximum weekly expenses
  - `daily_budget_mode` (text) - "fixed" or "calculated"
  - `fixed_daily_budget` (numeric) - Fixed daily budget if mode is "fixed"
  - `risk_threshold_low` (numeric) - Low risk threshold percentage
  - `risk_threshold_medium` (numeric) - Medium risk threshold percentage
  - `risk_threshold_high` (numeric) - High risk threshold percentage
  - `start_of_month` (integer) - Day of month to start calculations (1-31)
  - `start_of_week` (integer) - Day of week to start (0=Sunday, 1=Monday, etc.)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Policies for SELECT, INSERT, UPDATE, DELETE operations
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  budget_limit numeric DEFAULT 0,
  color text DEFAULT '#6366f1',
  icon text DEFAULT 'circle',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name, type)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own income"
  ON income FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own income"
  ON income FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own income"
  ON income FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own income"
  ON income FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text DEFAULT '',
  notes text DEFAULT '',
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  currency text DEFAULT 'USD',
  monthly_income_target numeric DEFAULT 0,
  monthly_expense_limit numeric DEFAULT 0,
  weekly_expense_limit numeric DEFAULT 0,
  daily_budget_mode text DEFAULT 'calculated' CHECK (daily_budget_mode IN ('fixed', 'calculated')),
  fixed_daily_budget numeric DEFAULT 0,
  risk_threshold_low numeric DEFAULT 50,
  risk_threshold_medium numeric DEFAULT 75,
  risk_threshold_high numeric DEFAULT 90,
  start_of_month integer DEFAULT 1 CHECK (start_of_month BETWEEN 1 AND 31),
  start_of_week integer DEFAULT 1 CHECK (start_of_week BETWEEN 0 AND 6),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_category_id ON income(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_income_updated_at
  BEFORE UPDATE ON income
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();