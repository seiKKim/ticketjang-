"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Megaphone,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e293b] border-b border-slate-700 flex items-center justify-between px-4 z-40">
        <h1 className="text-lg font-black text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          ADMIN
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#1e293b] border-r border-slate-800 z-50 shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex md:flex-col
        `}
      >
        {/* Brand Area */}
        <div className="p-8 border-b border-slate-800/50 bg-[#0f172a] hidden md:block">
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Settings className="w-5 h-5 text-white" />
            </div>
            TICKETJANG
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 mt-1 ml-1">
              ADMIN
            </span>
          </h1>
        </div>

        {/* Mobile Brand Area (Inside Drawer) */}
        <div className="p-6 border-b border-slate-800/50 bg-[#0f172a] md:hidden flex justify-between items-center">
          <span className="text-xl font-black text-white">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Management
          </div>
          <NavLink
            href="/admin/transactions"
            icon={<Receipt className="w-5 h-5" />}
            label="거래 관리"
            badge="Live"
            closeMenu={() => setIsOpen(false)}
          />
          <NavLink
            href="/admin/rates"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="시세 설정"
            closeMenu={() => setIsOpen(false)}
          />

          <div className="px-4 py-2 mt-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Analytics & Support
          </div>
          <NavLink
            href="/admin/stats"
            icon={<BarChart3 className="w-5 h-5" />}
            label="매출 통계"
            closeMenu={() => setIsOpen(false)}
          />
          <NavLink
            href="/admin/cs"
            icon={<Megaphone className="w-5 h-5" />}
            label="고객센터"
            closeMenu={() => setIsOpen(false)}
          />
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <span className="font-bold text-white text-sm">MG</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Manager
              </div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  href,
  icon,
  label,
  badge,
  closeMenu,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  closeMenu?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium group relative overflow-hidden
        ${
          isActive
            ? "text-white bg-indigo-600 shadow-lg shadow-indigo-900/20"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      {isActive && (
        <div className="absolute inset-y-0 left-0 w-1 bg-white/20 rounded-r" />
      )}
      <span
        className={
          isActive
            ? "text-white"
            : "group-hover:text-indigo-400 transition-colors"
        }
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 animate-pulse">
          {badge}
        </span>
      )}
    </Link>
  );
}
