import { type FC, type ReactNode, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  FolderOpen,
  Calendar,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";

interface ILayoutProps {
  children: ReactNode;
}

// TODO: create styles for the layout

export const Layout: FC<ILayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      path: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { id: "income", path: "/income", label: "Income", icon: TrendingUp },
    {
      id: "expenses",
      path: "/expenses",
      label: "Expenses",
      icon: TrendingDown,
    },
    {
      id: "categories",
      path: "/categories",
      label: "Categories",
      icon: FolderOpen,
    },
    {
      id: "monthly",
      path: "/monthly",
      label: "Monthly Control",
      icon: Calendar,
    },
    {
      id: "weekly",
      path: "/weekly",
      label: "Weekly Control",
      icon: CalendarDays,
    },
    { id: "settings", path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">OverSpend</h1>
              </div>
            </div>
            <Button
              onClick={() => setSidebarOpen(false)}
              color="secondary"
              size="small"
              variant="text"
              icon={X}
            />
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              color="danger"
              size="medium"
              variant="text"
              block
              icon={LogOut}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 lg:hidden">
          <Button
            onClick={() => setSidebarOpen(true)}
            color="secondary"
            size="small"
            icon={Menu}
            variant="text"
          />
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};
