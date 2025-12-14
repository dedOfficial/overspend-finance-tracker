import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency, formatDate } from "../lib/financialCalculations";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { useSettings } from "../contexts/SettingsContext/useSettings";
import type { TCategory, TIncome } from "../types";

const initialFormData = {
  amount: "",
  date: new Date().toISOString().split("T")[0],
  category_id: "",
  description: "",
  notes: "",
};

// TODO: create styles for the income view
// TODO: create a table ui component

export const IncomeView = () => {
  const { user } = useAuth();
  const [income, setIncome] = useState<TIncome[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<TIncome | null>(null);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [incomeResult, categoriesResult] = await Promise.all([
        supabase
          .from("income")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .eq("user_id", user!.id)
          .eq("type", "income")
          .eq("is_active", true),
      ]);

      if (incomeResult.data) setIncome(incomeResult.data);
      if (categoriesResult.data) setCategories(categoriesResult.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      };

      if (editingIncome) {
        await supabase.from("income").update(data).eq("id", editingIncome.id);
      } else {
        await supabase.from("income").insert(data);
      }

      setShowModal(false);
      setEditingIncome(null);
      setFormData(initialFormData);
      loadData();
    } catch (error) {
      console.error("Error saving income:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingIncome(null);
  };

  const handleEdit = (incomeItem: TIncome) => {
    setEditingIncome(incomeItem);
    setFormData({
      amount: incomeItem.amount.toString(),
      date: incomeItem.date,
      category_id: incomeItem.category_id || "",
      description: incomeItem.description,
      notes: incomeItem.notes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    // TODO: add a confirmation modal instead of using confirm
    if (confirm("Are you sure you want to delete this income entry?")) {
      await supabase.from("income").delete().eq("id", id);
      loadData();
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const totalIncome = income.reduce(
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Income</h1>
          <p className="text-gray-600">
            Total: {formatCurrency(totalIncome, settings?.currency || "USD")}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingIncome(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          color="success"
          size="medium"
          icon={Plus}
        >
          Add Income
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
              {income.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No income entries yet. Add your first one!
                  </td>
                </tr>
              ) : (
                income.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">
                          {item.description || "No description"}
                        </p>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">
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
          title={editingIncome ? "Edit Income" : "Add Income"}
          onClose={handleCloseModal}
          actions={{
            submit: {
              text: editingIncome ? "Update" : "Add",
              color: "success",
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
              placeholder="e.g., Monthly salary"
            />

            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
