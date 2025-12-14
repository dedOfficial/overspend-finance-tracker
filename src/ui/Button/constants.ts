export const BUTTON_COLORS = {
  primary: {
    contained: {
      base: "bg-blue-600 text-white",
      hover: "hover:bg-blue-700",
      active: "active:bg-blue-800",
      disabled: "disabled:bg-blue-300 disabled:cursor-not-allowed",
    },
    outlined: {
      base: "bg-transparent border border-blue-600 text-blue-600",
      hover: "hover:bg-blue-50",
      active: "active:bg-blue-100",
      disabled:
        "disabled:border-blue-300 disabled:text-blue-300 disabled:cursor-not-allowed",
    },
    text: {
      base: "bg-transparent text-blue-600",
      hover: "hover:bg-blue-50",
      active: "active:bg-blue-100",
      disabled: "disabled:text-blue-300 disabled:cursor-not-allowed",
    },
  },
  secondary: {
    contained: {
      base: "bg-gray-100 text-gray-700",
      hover: "hover:bg-gray-200",
      active: "active:bg-gray-300",
      disabled:
        "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
    },
    outlined: {
      base: "bg-transparent border border-gray-300 text-gray-700",
      hover: "hover:bg-gray-50",
      active: "active:bg-gray-100",
      disabled:
        "disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
    },
    text: {
      base: "bg-transparent text-gray-700",
      hover: "hover:bg-gray-50",
      active: "active:bg-gray-100",
      disabled: "disabled:text-gray-400 disabled:cursor-not-allowed",
    },
  },
  success: {
    contained: {
      base: "bg-green-600 text-white",
      hover: "hover:bg-green-700",
      active: "active:bg-green-800",
      disabled: "disabled:bg-green-300 disabled:cursor-not-allowed",
    },
    outlined: {
      base: "bg-transparent border border-green-600 text-green-600",
      hover: "hover:bg-green-50",
      active: "active:bg-green-100",
      disabled:
        "disabled:border-green-300 disabled:text-green-300 disabled:cursor-not-allowed",
    },
    text: {
      base: "bg-transparent text-green-600",
      hover: "hover:bg-green-50",
      active: "active:bg-green-100",
      disabled: "disabled:text-green-300 disabled:cursor-not-allowed",
    },
  },
  danger: {
    contained: {
      base: "bg-red-600 text-white",
      hover: "hover:bg-red-700",
      active: "active:bg-red-800",
      disabled: "disabled:bg-red-300 disabled:cursor-not-allowed",
    },
    outlined: {
      base: "bg-transparent border border-red-600 text-red-600",
      hover: "hover:bg-red-50",
      active: "active:bg-red-100",
      disabled:
        "disabled:border-red-300 disabled:text-red-300 disabled:cursor-not-allowed",
    },
    text: {
      base: "bg-transparent text-red-600",
      hover: "hover:bg-red-50",
      active: "active:bg-red-100",
      disabled: "disabled:text-red-300 disabled:cursor-not-allowed",
    },
  },
  warning: {
    contained: {
      base: "bg-yellow-600 text-white",
      hover: "hover:bg-yellow-700",
      active: "active:bg-yellow-800",
      disabled: "disabled:bg-yellow-300 disabled:cursor-not-allowed",
    },
    outlined: {
      base: "bg-transparent border border-yellow-600 text-yellow-600",
      hover: "hover:bg-yellow-50",
      active: "active:bg-yellow-100",
      disabled:
        "disabled:border-yellow-300 disabled:text-yellow-300 disabled:cursor-not-allowed",
    },
    text: {
      base: "bg-transparent text-yellow-600",
      hover: "hover:bg-yellow-50",
      active: "active:bg-yellow-100",
      disabled: "disabled:text-yellow-300 disabled:cursor-not-allowed",
    },
  },
} as const;

export const BUTTON_SIZES = {
  small: {
    padding: "px-3 py-1.5",
    noChildrenPadding: "p-1.5",
    text: "text-sm",
    icon: "w-4 h-4",
    gap: "gap-1.5",
  },
  medium: {
    padding: "px-4 py-2",
    noChildrenPadding: "p-2",
    text: "text-base",
    icon: "w-5 h-5",
    gap: "gap-2",
  },
  large: {
    padding: "px-6 py-3",
    noChildrenPadding: "p-3",
    text: "text-lg",
    icon: "w-6 h-6",
    gap: "gap-2.5",
  },
} as const;

export type ButtonColor = keyof typeof BUTTON_COLORS;
export type ButtonSize = keyof typeof BUTTON_SIZES;
