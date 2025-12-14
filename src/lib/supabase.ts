import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          budget_limit: number;
          color: string;
          icon: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: 'income' | 'expense';
          budget_limit?: number;
          color?: string;
          icon?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'income' | 'expense';
          budget_limit?: number;
          color?: string;
          icon?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      income: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount: number;
          date: string;
          description: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          date?: string;
          description?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          date?: string;
          description?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount: number;
          date: string;
          description: string;
          notes: string;
          is_recurring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: number;
          date?: string;
          description?: string;
          notes?: string;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: number;
          date?: string;
          description?: string;
          notes?: string;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          monthly_income_target: number;
          monthly_expense_limit: number;
          weekly_expense_limit: number;
          daily_budget_mode: 'fixed' | 'calculated';
          fixed_daily_budget: number;
          risk_threshold_low: number;
          risk_threshold_medium: number;
          risk_threshold_high: number;
          start_of_month: number;
          start_of_week: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          currency?: string;
          monthly_income_target?: number;
          monthly_expense_limit?: number;
          weekly_expense_limit?: number;
          daily_budget_mode?: 'fixed' | 'calculated';
          fixed_daily_budget?: number;
          risk_threshold_low?: number;
          risk_threshold_medium?: number;
          risk_threshold_high?: number;
          start_of_month?: number;
          start_of_week?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          currency?: string;
          monthly_income_target?: number;
          monthly_expense_limit?: number;
          weekly_expense_limit?: number;
          daily_budget_mode?: 'fixed' | 'calculated';
          fixed_daily_budget?: number;
          risk_threshold_low?: number;
          risk_threshold_medium?: number;
          risk_threshold_high?: number;
          start_of_month?: number;
          start_of_week?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
