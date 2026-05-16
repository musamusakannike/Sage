"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Landmark,
  Calendar,
  LayoutGrid,
  FileSpreadsheet,
  UsersRound,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/hr-admin/dashboard", label: "Dashboard", Icon: LayoutGrid },
  { href: "/hr-admin/upload-roster", label: "Upload Roster", Icon: FileSpreadsheet },
  { href: "/hr-admin/employees", label: "Employees", Icon: UsersRound, badge: "5 Frozen" },
  { href: "/hr-admin/settings", label: "Settings", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] h-screen bg-[#003f2e] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo & Org */}
      <div className="flex flex-col gap-4 pb-4 pt-6 px-3 border-b border-white/20 shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-6 shrink-0" style={{ height: "23.871px" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M5 3L12 7L19 3" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7V17" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
              <path d="M5 3V13L12 17L19 13V3" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="rgba(74,222,128,0.15)" />
            </svg>
          </div>
          <span className="text-white font-bold text-[20px] tracking-[-0.6px]">Sage</span>
        </div>
        <div className="bg-[#3a6e57] flex gap-2 h-[46px] items-center p-2 rounded-xl w-full shrink-0">
          <div className="bg-white/30 flex items-center p-2 rounded-lg shrink-0">
            <Landmark className="w-[14px] h-[14px] text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="font-bold text-[11px] text-white leading-tight truncate">Lagos State Government</p>
            <p className="font-normal text-[10px] text-white leading-tight">Ministry of Finance</p>
          </div>
        </div>
      </div>

      {/* Active Cycle */}
      <div className="flex flex-col items-start px-3 py-4 shrink-0">
        <div className="bg-white/10 flex gap-2 h-[46px] items-center p-2 rounded-xl w-full">
          <div className="bg-white/30 flex items-center p-2 rounded-lg shrink-0">
            <Calendar className="w-[14px] h-[14px] text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 min-w-0">
            <p className="font-bold text-[11px] text-white leading-tight">Active cycle</p>
            <p className="font-normal text-[10px] text-white leading-tight">May 2026</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-3 px-3 overflow-hidden">
        <p className="text-white text-[10px] font-normal shrink-0">MAIN</p>
        <ul className="flex flex-col gap-2 w-full">
          {navItems.map(({ href, label, Icon, badge }) => {
            const active = pathname === href || (href !== "/hr-admin/dashboard" && pathname.startsWith(href));
            return (
              <li key={href} className="w-full shrink-0">
                <Link
                  href={href}
                  className={`flex gap-1 h-[34px] items-center px-3 py-2 rounded-full text-[11px] font-medium transition-all ${
                    active
                      ? "bg-[#3a6e57] text-white border-l border-white"
                      : "text-[#afdfca] hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                  <span className="flex-1 min-w-0">{label}</span>
                  {badge && (
                    <span className="text-[10px] bg-white text-[#3a6e57] rounded-full px-[5px] py-0.5 font-medium whitespace-nowrap">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="flex gap-2 items-center p-3 border-t border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
          <span className="text-[#003f2e] text-xs font-bold">AO</span>
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <p className="font-medium text-[12px] text-white leading-tight">Amara Okon</p>
          <p className="font-normal text-[#afdfca] text-[10px] leading-tight">HR Manager · Payroll</p>
        </div>
        <button className="flex gap-1 items-center justify-center shrink-0">
          <span className="font-medium text-[#afdfca] text-[12px]">Logout</span>
          <LogOut className="w-4 h-4 text-[#afdfca]" strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
