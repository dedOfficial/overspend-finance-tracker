import { SelectHTMLAttributes } from "react";
import { selectInput, selectLabel } from "./styles";

type TSelectPropsBase = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "className" | "options"
>;
interface ISelectProps extends TSelectPropsBase {
  label?: string;
  options: { label: string; value: string | number }[];
}

export const Select = ({
  label,
  value,
  onChange,
  options,
  ...props
}: ISelectProps) => {
  return (
    <div>
      {label && (
        <label className={selectLabel} htmlFor={props.name}>
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={selectInput}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
