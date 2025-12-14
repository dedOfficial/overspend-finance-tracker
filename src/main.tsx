import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App.tsx";
import "./index.css";
import { SettingsContextProvider } from "./contexts/SettingsContext/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SettingsContextProvider>
        <Router>
          <App />
        </Router>
      </SettingsContextProvider>
    </AuthProvider>
  </StrictMode>
);
