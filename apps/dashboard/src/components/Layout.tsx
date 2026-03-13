import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Phone,
  Webhook,
  ScrollText,
  LogOut,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/numbers", label: "Números", icon: Phone },
  { to: "/webhooks", label: "Webhooks", icon: Webhook },
  { to: "/logs", label: "Logs", icon: ScrollText },
  { to: "/docs", label: "Docs", icon: BookOpen },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      <aside
        className={cn(
          "bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold">
              ALC<span className="text-purple-400">Connect</span>
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg text-sm transition-colors",
                  collapsed ? "justify-center px-2 py-2.5" : "px-4 py-2.5",
                  isActive
                    ? "bg-purple-600/20 text-purple-300"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <div className="text-sm text-gray-400 mb-2 truncate">
              {user?.name}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title={collapsed ? "Sair" : undefined}
            className={cn(
              "gap-2 text-red-400 hover:text-red-300",
              collapsed && "w-full justify-center p-2",
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!collapsed && "Sair"}
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
