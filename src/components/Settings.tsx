import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Save } from "lucide-react";
import { Button } from "../ui/Button";
import { useSettings } from "../contexts/SettingsContext/useSettings";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Loader } from "../ui/Loader";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "BRL",
];

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

// TODO: create styles for the settings view

export const SettingsView = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { settings, setSettings } = useSettings();

  const [formData, setFormData] = useState({
    currency: "USD",
    monthly_income_target: "0",
    monthly_expense_limit: "0",
    weekly_expense_limit: "0",
    daily_budget_mode: "calculated" as "fixed" | "calculated",
    fixed_daily_budget: "0",
    risk_threshold_low: "50",
    risk_threshold_medium: "75",
    risk_threshold_high: "90",
    start_of_month: "1",
    start_of_week: "1",
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (data) {
        setSettings(data);
        setFormData({
          currency: data.currency,
          monthly_income_target: data.monthly_income_target.toString(),
          monthly_expense_limit: data.monthly_expense_limit.toString(),
          weekly_expense_limit: data.weekly_expense_limit.toString(),
          daily_budget_mode: data.daily_budget_mode,
          fixed_daily_budget: data.fixed_daily_budget.toString(),
          risk_threshold_low: data.risk_threshold_low.toString(),
          risk_threshold_medium: data.risk_threshold_medium.toString(),
          risk_threshold_high: data.risk_threshold_high.toString(),
          start_of_month: data.start_of_month.toString(),
          start_of_week: data.start_of_week.toString(),
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const data = {
        user_id: user!.id,
        currency: formData.currency,
        monthly_income_target: parseFloat(formData.monthly_income_target),
        monthly_expense_limit: parseFloat(formData.monthly_expense_limit),
        weekly_expense_limit: parseFloat(formData.weekly_expense_limit),
        daily_budget_mode: formData.daily_budget_mode,
        fixed_daily_budget: parseFloat(formData.fixed_daily_budget),
        risk_threshold_low: parseFloat(formData.risk_threshold_low),
        risk_threshold_medium: parseFloat(formData.risk_threshold_medium),
        risk_threshold_high: parseFloat(formData.risk_threshold_high),
        start_of_month: parseInt(formData.start_of_month),
        start_of_week: parseInt(formData.start_of_week),
      };

      if (settings) {
        await supabase.from("user_settings").update(data).eq("id", settings.id);
      } else {
        await supabase.from("user_settings").insert(data);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Configure your finance tracking preferences
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            General Settings
          </h2>
          <div className="space-y-4">
            <Select
              label="Currency"
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              options={CURRENCIES.map((currency) => ({
                label: currency,
                value: currency,
              }))}
            />

            <Input
              label="Start of Month (Day)"
              type="number"
              step="1"
              min="1"
              max="31"
              value={formData.start_of_month}
              onChange={(e) =>
                setFormData({ ...formData, start_of_month: e.target.value })
              }
              description="Day of the month when your budget period starts"
            />

            <Select
              label="Start of Week"
              value={formData.start_of_week}
              onChange={(e) =>
                setFormData({ ...formData, start_of_week: e.target.value })
              }
              options={DAYS_OF_WEEK.map((day) => ({
                label: day.label,
                value: day.value,
              }))}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Targets
          </h2>
          <div className="space-y-4">
            <Input
              label="Monthly Income Target"
              type="number"
              step="0.01"
              value={formData.monthly_income_target}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthly_income_target: e.target.value,
                })
              }
            />

            <Input
              label="Monthly Expense Limit"
              type="number"
              step="0.01"
              value={formData.monthly_expense_limit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthly_expense_limit: e.target.value,
                })
              }
            />

            <Input
              label="Weekly Expense Limit"
              type="number"
              step="0.01"
              value={formData.weekly_expense_limit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weekly_expense_limit: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Budget
          </h2>
          <div className="space-y-4">
            <Select
              label="Budget Mode"
              value={formData.daily_budget_mode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  daily_budget_mode: e.target.value as "fixed" | "calculated",
                })
              }
              options={[
                {
                  label: "Calculated (Based on remaining balance)",
                  value: "calculated",
                },
                { label: "Fixed Amount", value: "fixed" },
              ]}
            />

            {formData.daily_budget_mode === "fixed" && (
              <Input
                label="Fixed Daily Budget"
                type="number"
                step="0.01"
                value={formData.fixed_daily_budget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fixed_daily_budget: e.target.value,
                  })
                }
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Risk Thresholds
          </h2>
          <div className="space-y-4">
            <Input
              label="Low Risk (%)"
              type="number"
              min="0"
              max="100"
              value={formData.risk_threshold_low}
              onChange={(e) =>
                setFormData({ ...formData, risk_threshold_low: e.target.value })
              }
            />

            <Input
              label="Medium Risk (%)"
              type="number"
              min="0"
              max="100"
              value={formData.risk_threshold_medium}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  risk_threshold_medium: e.target.value,
                })
              }
            />

            <Input
              label="High Risk (%)"
              type="number"
              min="0"
              max="100"
              value={formData.risk_threshold_high}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  risk_threshold_high: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            color="primary"
            size="large"
            icon={saving ? Loader : Save}
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};
