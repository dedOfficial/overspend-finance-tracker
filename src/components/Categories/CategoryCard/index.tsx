import { Circle, Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "../../../lib/financialCalculations";
import { Button } from "../../../ui/Button";
import type { FC } from "react";
import type { TCategory } from "../../../types";
import { useSettings } from "../../../contexts/SettingsContext/useSettings";

interface ICategoryCardProps {
  category: TCategory;
  onEdit: (category: TCategory) => void;
  onDelete: (categoryId: string) => void;
}

// TODO: create styles for the category card

export const CategoryCard: FC<ICategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const { settings } = useSettings();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category.color + "20" }}
          >
            <Circle
              className="w-5 h-5"
              style={{ color: category.color }}
              fill={category.color}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{category.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(category)}
            color="primary"
            size="small"
            icon={Edit2}
            variant="outlined"
          />
          <Button
            onClick={() => onDelete(category.id)}
            color="danger"
            size="small"
            variant="outlined"
            icon={Trash2}
          />
        </div>
      </div>
      {category.budget_limit > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Budget:{" "}
            <span className="font-medium text-gray-900">
              {formatCurrency(
                category.budget_limit,
                settings?.currency || "USD"
              )}
            </span>
          </p>
        </div>
      )}
      {!category.is_active && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
            Inactive
          </span>
        </div>
      )}
    </div>
  );
};
