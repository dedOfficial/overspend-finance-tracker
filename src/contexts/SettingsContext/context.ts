import { createContext } from "react";
import { TUserSettings } from "../../types";

interface ISettingsContextType {
  settings: TUserSettings | null;
  loading: boolean;
  setSettings: (settings: TUserSettings) => void;
}

export const SettingsContext = createContext<ISettingsContextType | null>(null);
