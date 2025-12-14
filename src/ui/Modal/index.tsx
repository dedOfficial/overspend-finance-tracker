import type { FC, ReactNode } from "react";
import { Overlay } from "../Overlay";
import { Button } from "../Button";
import { X } from "lucide-react";
import { modalContainer, modalHeader, modalTitle } from "./styles";
import { ButtonColor, ButtonSize } from "../Button/constants";

type ModalSize = "small" | "medium" | "large";

interface IModalProps {
  title: string;
  onClose: () => void;
  children?: ReactNode;
  size?: ModalSize;
  actions?: {
    submit: {
      text: string;
      type?: "button" | "submit";
      color?: ButtonColor;
      size?: ButtonSize;
      onClick?: (e?: React.FormEvent) => void;
    };
    cancel: {
      text: string;
      color?: ButtonColor;
      size?: ButtonSize;
      onClick?: () => void;
    };
  };
}
export const Modal: FC<IModalProps> = ({
  title,
  onClose,
  children,
  actions,
  size = "medium",
}) => {
  const isForm = actions?.submit?.type === "submit";

  return (
    <Overlay>
      <div className={modalContainer}>
        <div className={modalHeader}>
          <h2 className={modalTitle}>{title}</h2>
          <Button onClick={onClose} color="secondary" size="small" icon={X} />
        </div>

        <form onSubmit={isForm ? actions.submit.onClick : undefined}>
          {children}

          {actions && (
            <div className="flex gap-3 pt-4">
              {actions.cancel && (
                <Button
                  type="button"
                  color={actions.cancel.color || "secondary"}
                  size={actions.cancel.size || size}
                  block
                  onClick={actions.cancel.onClick || onClose}
                >
                  {actions.cancel.text || "Cancel"}
                </Button>
              )}
              {actions.submit && (
                <Button
                  type={actions.submit.type}
                  color={actions.submit.color}
                  size={actions.submit.size || size}
                  block
                  onClick={isForm ? undefined : actions.submit.onClick}
                >
                  {actions.submit.text || "OK"}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </Overlay>
  );
};
