import type { FC, TextareaHTMLAttributes } from "react";
import { textareaInput, textareaLabel } from "./styles";

type TTextareaPropsBase = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
>;
interface ITextareaProps extends TTextareaPropsBase {
  label?: string;
}
export const Textarea: FC<ITextareaProps> = ({
  label,
  value,
  onChange,
  rows = 3,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className={textareaLabel} htmlFor={props.name}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        className={textareaInput}
        rows={rows}
        {...props}
      />
    </div>
  );
};
