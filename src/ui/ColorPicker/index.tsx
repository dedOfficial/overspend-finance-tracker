import type { FC } from "react";
import { colorPickerButton, colorPickerContainer } from "./styles";
import { COLOR_PICKER_COLORS } from "./constants";

interface IColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker: FC<IColorPickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Color
      </label>
      <div className={colorPickerContainer}>
        {COLOR_PICKER_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={colorPickerButton(value === color)}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};
