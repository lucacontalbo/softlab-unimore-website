"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  BookOpen,
  FlaskConical,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, tab: "" },
  { href: "/admin/dashboard?tab=team", label: "Team", icon: Users, tab: "team" },
  { href: "/admin/dashboard?tab=news", label: "News", icon: Newspaper, tab: "news" },
  { href: "/admin/dashboard?tab=research", label: "Research", icon: FlaskConical, tab: "research" },
  { href: "/admin/dashboard?tab=publications", label: "Publications", icon: BookOpen, tab: "publications" },
  { href: "/admin/dashboard?tab=settings", label: "Site Settings", icon: Settings, tab: "settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-black text-white tracking-tight">
              SOFT<span className="text-cyan-400">LAB</span>
            </div>
            <div className="text-xs text-slate-500 -mt-0.5">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === "/admin/dashboard" && item.href === "/admin/dashboard"
            ? true
            : pathname?.includes(item.tab) && item.tab !== "";
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                isActive
                  ? "bg-cyan-600/20 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {item.label}
              {isActive && (
                <ChevronRight size={14} className="ml-auto text-cyan-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={17} />
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
        <p className="text-xs text-slate-600 mt-3 px-1">
          Logged in as Administrator
        </p>
      </div>
    </aside>
  );
}
