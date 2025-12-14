import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";
import { Loader } from "../../ui/Loader";
import { Input } from "../../ui/Input";
import { Checkbox } from "../../ui/Checkbox";
import { Select } from "../../ui/Select";
import { ColorPicker } from "../../ui/ColorPicker";
import { COLOR_PICKER_COLORS } from "../../ui/ColorPicker/constants";
import type { TCategory } from "../../types";
import { CategoryCard } from "./CategoryCard";

const initialFormData = {
  name: "",
  type: "expense" as "income" | "expense",
  budget_limit: "",
  color: COLOR_PICKER_COLORS[0],
  is_active: true,
};

// TODO: create styles for the categories view

export const CategoriesView = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(
    null
  );

  const [formData, setFormData] = useState(initialFormData);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user!.id)
        .order("name");

      if (error) throw error;

      if (data) setCategories(data);
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
        name: formData.name,
        type: formData.type,
        budget_limit: parseFloat(formData.budget_limit) || 0,
        color: formData.color,
        is_active: formData.is_active,
      };

      if (editingCategory) {
        await supabase
          .from("categories")
          .update(data)
          .eq("id", editingCategory.id);
      } else {
        await supabase.from("categories").insert(data);
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData(initialFormData);
      loadData();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditingCategory(null);
  };

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      budget_limit: category.budget_limit.toString(),
      color: category.color,
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await supabase.from("categories").delete().eq("id", id);
      loadData();
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  if (loading) {
    return <Loader fullWidth />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">
            Manage your income and expense categories
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setFormData(initialFormData);
            setShowModal(true);
          }}
          color="primary"
          size="medium"
          icon={Plus}
        >
          Add Category
        </Button>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Income Categories ({incomeCategories.length})
          </h2>
          {incomeCategories.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              No income categories yet. Create one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomeCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Expense Categories ({expenseCategories.length})
          </h2>
          {expenseCategories.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              No expense categories yet. Create one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenseCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editingCategory ? "Edit Category" : "Add Category"}
          onClose={handleCloseModal}
          actions={{
            submit: {
              text: editingCategory ? "Update" : "Add",
              color: "primary",
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
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Groceries, Salary"
              required
            />

            <Select
              label="Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "income" | "expense",
                })
              }
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
              required
            />

            <Input
              label="Budget Limit (Monthly)"
              type="number"
              step="0.01"
              value={formData.budget_limit}
              onChange={(e) =>
                setFormData({ ...formData, budget_limit: e.target.value })
              }
              placeholder="0.00"
            />

            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />

            <Checkbox
              label="Active"
              value={formData.is_active}
              onChange={(value) =>
                setFormData({ ...formData, is_active: value })
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
