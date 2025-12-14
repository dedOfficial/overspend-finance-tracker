import { Database } from "./lib/supabase";

export type TCategory = Database["public"]["Tables"]["categories"]["Row"];

export type TUserSettings =
  Database["public"]["Tables"]["user_settings"]["Row"];

export type TExpense = Database["public"]["Tables"]["expenses"]["Row"];

export type TIncome = Database["public"]["Tables"]["income"]["Row"];
