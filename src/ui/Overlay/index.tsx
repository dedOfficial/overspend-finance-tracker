import type { FC, ReactNode } from "react";
import { overlayContainer } from "./styles";

interface IOverlayProps {
  children: ReactNode;
}

export const Overlay: FC<IOverlayProps> = ({ children }) => {
  return <div className={overlayContainer}>{children}</div>;
};
