import { InputHTMLAttributes } from "react";
import { inputContainer, inputDescription } from "./styles";

type TInputPropsBase = Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

interface IInputProps extends TInputPropsBase {
  label?: string;
  description?: string;
}

export const Input = ({
  label,
  value,
  onChange,
  description,
  ...props
}: IInputProps) => {
  return (
    <div>
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={props.name}
        >
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        className={inputContainer}
        {...props}
      />
      {description && <p className={inputDescription}>{description}</p>}
    </div>
  );
};
