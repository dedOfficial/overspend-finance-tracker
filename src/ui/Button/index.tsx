import type { ReactNode, ButtonHTMLAttributes, ElementType } from "react";
import { type ButtonColor, type ButtonSize } from "./constants";
import { button, iconContainer, textContainer } from "./styles";
import type { LucideIcon } from "lucide-react";

type TBaseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "color" | "size" | "className"
>;

interface ButtonProps extends TBaseButtonProps {
  color?: ButtonColor;
  variant?: "contained" | "outlined" | "text";
  size?: ButtonSize;
  icon?: LucideIcon | ElementType;
  children?: ReactNode;
  block?: boolean;
}

const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
};

export const Button = ({
  color = "primary",
  variant = "contained",
  size = "medium",
  icon: Icon,
  children,
  disabled,
  block,
  ...props
}: ButtonProps) => {
  const noChildren = !children;

  return (
    <button
      className={button({
        color,
        size,
        disabled,
        block,
        variant,
        noChildren,
      })}
      disabled={disabled}
      {...props}
    >
      {Icon && (
        <div className={iconContainer(noChildren)}>
          <Icon size={ICON_SIZES[size]} />
        </div>
      )}
      {children && <span className={textContainer}>{children}</span>}
    </button>
  );
};
