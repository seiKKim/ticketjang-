import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Megaphone,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar - Professional Dark Theme */}
      <aside className="w-72 bg-[#1e293b] border-r border-slate-800 fixed h-full z-30 hidden md:flex flex-col shadow-2xl">
        {/* Brand Area */}
        <div className="p-8 border-b border-slate-800/50 bg-[#0f172a]">
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
          />
          <NavLink
            href="/admin/rates"
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="시세 설정"
          />

          <div className="px-4 py-2 mt-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Analytics & Support
          </div>
          <NavLink
            href="/admin/stats"
            icon={<BarChart3 className="w-5 h-5" />}
            label="매출 통계"
          />
          <NavLink
            href="/admin/cs"
            icon={<Megaphone className="w-5 h-5" />}
            label="고객센터"
          />
        </nav>

        {/* User Profile / Logout (Visual Only) */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-800/50">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <span className="font-bold text-white text-sm">MG</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Manager
              </div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium group relative overflow-hidden"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="group-hover:text-indigo-400 transition-colors">
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
