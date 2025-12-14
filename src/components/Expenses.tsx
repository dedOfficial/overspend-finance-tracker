import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatDate } from "../lib/financialCalculations";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Loader } from "../ui/Loader";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { useSettings } from "../contexts/SettingsContext/useSettings";
import type { TCategory, TExpense } from "../types";

const initialFormData = {
  amount: "",
  date: new Date().toISOString().split("T")[0],
  category_id: "",
  description: "",
  notes: "",
  is_recurring: false,
};

// TODO: create styles for the expenses view
// TODO: create a table ui component

export const ExpensesView = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TExpense | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesResult, categoriesResult] = await Promise.all([
        supabase
          .from("expenses")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .eq("user_id", user!.id)
          .eq("type", "expense")
          .eq("is_active", true),
      ]);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      const data = {
        user_id: user!.id,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category_id: formData.category_id || null,
        description: formData.description,
        notes: formData.notes,
        is_recurring: formData.is_recurring,
      };

      if (editingExpense) {
        await supabase
          .from("expenses")
          .update(data)
          .eq("id", editingExpense.id);
      } else {
        await supabase.from("expenses").insert(data);
      }

      setShowModal(false);
      setEditingExpense(null);
      setFormData(initialFormData);
      loadData();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingExpense(null);
  };

  const handleEdit = (expense: TExpense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      date: expense.date,
      category_id: expense.category_id || "",
      description: expense.description,
      notes: expense.notes,
      is_recurring: expense.is_recurring,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    // TODO: add a confirmation modal instead of using confirm
    if (confirm("Are you sure you want to delete this expense entry?")) {
      await supabase.from("expenses").delete().eq("id", id);
      loadData();
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  if (loading) {
    return <Loader fullWidth />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
          <p className="text-gray-600">
            Total: {formatCurrency(totalExpenses, settings?.currency || "USD")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingExpense(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          color="danger"
          size="medium"
          icon={Plus}
        >
          Add Expense
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No expense entries yet. Add your first one!
                  </td>
                </tr>
              ) : (
                expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {item.description || "No description"}
                          </p>
                          {item.is_recurring && (
                            <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                              Recurring
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-gray-500 text-xs mt-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {getCategoryName(item.category_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                      {formatCurrency(
                        Number(item.amount),
                        settings?.currency || "USD"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Button
                        onClick={() => handleEdit(item)}
                        color="primary"
                        size="small"
                        variant="text"
                        icon={Edit2}
                      />
                      <Button
                        onClick={() => handleDelete(item.id)}
                        color="danger"
                        size="small"
                        variant="text"
                        icon={Trash2}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal
          title={editingExpense ? "Edit Expense" : "Add Expense"}
          onClose={handleCloseModal}
          actions={{
            submit: {
              text: editingExpense ? "Update" : "Add",
              color: "danger",
              type: "submit",
              onClick: handleSubmit,
            },
            cancel: {
              text: "Cancel",
            },
          }}
        >
          <div className="space-y-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Select
              label="Category"
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              options={[
                { label: "Uncategorized", value: "" },
                ...categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                })),
              ]}
            />

            <Input
              label="Description"
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Grocery shopping"
            />

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes..."
            />

            <Checkbox
              label="Recurring expense"
              value={formData.is_recurring}
              onChange={(value) =>
                setFormData({ ...formData, is_recurring: value })
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
