import { InputHTMLAttributes } from "react";
import { checkboxContainer, checkboxInput, checkboxLabel } from "./styles";

type TCheckboxPropsBase = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "value" | "onChange"
>;

interface ICheckboxProps extends TCheckboxPropsBase {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Checkbox = ({
  label,
  value,
  onChange,
  ...props
}: ICheckboxProps) => {
  return (
    <div className={checkboxContainer}>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className={checkboxInput}
        {...props}
      />
      {label && (
        <label className={checkboxLabel} htmlFor={props.name}>
          {label}
        </label>
      )}
    </div>
  );
};
