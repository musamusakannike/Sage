"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDashboardLine, RiUploadCloud2Line, RiGroupLine, RiSettingsLine, RiLogoutBoxLine } from "react-icons/ri";
import { PiLeafFill } from "react-icons/pi";

const navItems = [
  { href: "/hr-admin/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { href: "/hr-admin/upload-roster", label: "Upload Roster", icon: RiUploadCloud2Line },
  { href: "/hr-admin/employees", label: "Employees", icon: RiGroupLine, badge: "5 Frozen" },
  { href: "/hr-admin/settings", label: "Settings", icon: RiSettingsLine },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[210px] min-h-screen bg-[#0D2B1F] flex flex-col fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-400 rounded-md flex items-center justify-center">
            <PiLeafFill className="text-[#0D2B1F] text-sm" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Sage</span>
        </div>
      </div>

      {/* Org */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="bg-[#1a3d2b] rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-700 rounded flex items-center justify-center flex-shrink-0">
              <RiGroupLine className="text-emerald-300 text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold leading-tight truncate">Lagos State Government</p>
              <p className="text-emerald-400 text-[10px] truncate">Ministry of Finance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Cycle */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="bg-[#1a3d2b] rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-700 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-300 text-[10px]">📅</span>
            </div>
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-wide">Active cycle</p>
              <p className="text-white text-xs font-semibold">May 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-white/30 text-[9px] uppercase tracking-widest px-2 mb-2">Main</p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group ${
                    active
                      ? "bg-emerald-700/60 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`text-base flex-shrink-0 ${active ? "text-emerald-300" : "text-white/40 group-hover:text-white/70"}`} />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full px-1.5 py-0.5 font-medium">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Amara Okon</p>
            <p className="text-white/40 text-[10px]">HR Manager · Payroll</p>
          </div>
          <button className="text-white/30 hover:text-white/70 transition-colors">
            <RiLogoutBoxLine className="text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}
