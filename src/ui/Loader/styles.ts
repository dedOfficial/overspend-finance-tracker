import { cn } from "../../lib/cn";

export const loaderContainer = (fullWidth: boolean) =>
  cn("flex items-center justify-center", fullWidth && "min-w-full min-h-full");

export const loaderIcon = "w-8 h-8 text-blue-600 animate-spin";
