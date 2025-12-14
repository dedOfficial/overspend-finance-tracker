import { Loader2 } from "lucide-react";
import { loaderContainer, loaderIcon } from "./styles";

interface ILoaderProps {
  fullWidth?: boolean;
}

export const Loader = ({ fullWidth = false }: ILoaderProps) => {
  return (
    <div className={loaderContainer(fullWidth)}>
      <Loader2 className={loaderIcon} />
    </div>
  );
};
