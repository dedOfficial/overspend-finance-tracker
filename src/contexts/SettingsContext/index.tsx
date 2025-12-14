import { type FC, type ReactNode, useEffect, useState } from "react";
import { TUserSettings } from "../../types";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../AuthContext";
import { SettingsContext } from "./context";

interface ISettingsContextProviderProps {
  children: ReactNode;
}

export const SettingsContextProvider: FC<ISettingsContextProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TUserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;

      if (data) setSettings(data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
