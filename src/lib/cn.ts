export const cn = (
  ...classes: (string | boolean | undefined | null | number)[]
) => {
  return classes.filter(Boolean).join(" ");
};
