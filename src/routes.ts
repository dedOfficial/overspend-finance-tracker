import { CategoriesView } from "./components/Categories";
import { Dashboard } from "./components/Dashboard";
import { ExpensesView } from "./components/Expenses";
import { IncomeView } from "./components/Income";
import { MonthlyControl } from "./components/MonthlyControl";
import { SettingsView } from "./components/Settings";
import { WeeklyControl } from "./components/WeeklyControl";

export const routes = [
  {
    path: "/",
    element: Dashboard,
  },
  {
    path: "/dashboard",
    element: Dashboard,
  },
  {
    path: "/income",
    element: IncomeView,
  },
  {
    path: "/expenses",
    element: ExpensesView,
  },
  {
    path: "/categories",
    element: CategoriesView,
  },
  {
    path: "/monthly",
    element: MonthlyControl,
  },
  {
    path: "/weekly",
    element: WeeklyControl,
  },
  {
    path: "/settings",
    element: SettingsView,
  },
];
