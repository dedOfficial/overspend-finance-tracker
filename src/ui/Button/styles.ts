import { cn } from "../../lib/cn";
import {
  BUTTON_COLORS,
  BUTTON_SIZES,
  ButtonColor,
  ButtonSize,
} from "./constants";

interface IButtonStylesProps {
  color: ButtonColor;
  size: ButtonSize;
  disabled?: boolean;
  block?: boolean;
  variant?: "contained" | "outlined" | "text";
  noChildren?: boolean;
}

export const button = ({
  color,
  size,
  disabled,
  block,
  noChildren,
  variant = "contained",
}: IButtonStylesProps) => {
  const colorStyles = BUTTON_COLORS[color][variant];
  const sizeStyles = BUTTON_SIZES[size];

  return cn(
    "inline-flex items-center justify-center font-medium rounded-lg",
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    colorStyles.base, 
    !disabled && colorStyles.hover,
    !disabled && colorStyles.active,
    disabled && colorStyles.disabled,
    noChildren ? sizeStyles.noChildrenPadding : sizeStyles.padding,
    sizeStyles.text,
    sizeStyles.gap,
    block && "w-full",
    variant === "text" && "border-0 shadow-none"
  );
};

export const textContainer = "mx-auto";

export const iconContainer = (noChildren: boolean) =>
  noChildren ? "mr-auto" : undefined;
