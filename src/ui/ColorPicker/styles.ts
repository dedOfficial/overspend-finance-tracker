export const colorPickerContainer = "grid grid-cols-8 gap-2";

export const colorPickerButton = (selected: boolean) =>
  `w-10 h-10 rounded-lg transition-all ${
    selected ? "ring-2 ring-offset-2 scale-110" : ""
  }`;
