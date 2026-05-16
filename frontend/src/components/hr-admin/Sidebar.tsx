"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Landmark,
  Calendar,
  LayoutGrid,
  FileSpreadsheet,
  UsersRound,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { usersApi } from "@/lib/api/users.api";
import type { UserProfile } from "@/lib/types";

const navItems = [
  { href: "/hr-admin/dashboard",     label: "Dashboard",     Icon: LayoutGrid     },
  { href: "/hr-admin/upload-roster", label: "Upload Roster", Icon: FileSpreadsheet },
  { href: "/hr-admin/employees",     label: "Employees",     Icon: UsersRound      },
  { href: "/hr-admin/settings",      label: "Settings",      Icon: Settings        },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function roleLabel(role: string) {
  if (role === "hr_admin") return "HR Admin · Payroll";
  if (role === "auditor")  return "Auditor";
  return "Employee";
}

export default function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const logout    = useAuthStore(s => s.logout);
  const authUser  = useAuthStore(s => s.user);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    usersApi.getMe()
      .then(res => setProfile(res.data.data))
      .catch(() => null);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = profile?.name ?? authUser?.email ?? "—";
  const orgName     = profile?.orgName ?? "Your Organisation";
  const initials    = profile?.name ? getInitials(profile.name) : "—";
  const role        = profile?.role ?? authUser?.role ?? "";

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
            <p className="font-bold text-[11px] text-white leading-tight truncate">{orgName}</p>
            <p className="font-normal text-[10px] text-white/70 leading-tight">Payroll Integrity System</p>
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
            <p className="font-normal text-[10px] text-white/70 leading-tight">May 2026</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-3 px-3 overflow-hidden">
        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest shrink-0">Main</p>
        <ul className="flex flex-col gap-2 w-full">
          {navItems.map(({ href, label, Icon }) => {
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="flex gap-2 items-center p-3 border-t border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-bold">{initials}</span>
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <p className="font-medium text-[12px] text-white leading-tight truncate">{displayName}</p>
          <p className="font-normal text-[#afdfca] text-[10px] leading-tight">{roleLabel(role)}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex gap-1 items-center justify-center shrink-0 hover:opacity-75 transition-opacity"
          title="Log out"
        >
          <span className="font-medium text-[#afdfca] text-[12px]">Logout</span>
          <LogOut className="w-4 h-4 text-[#afdfca]" strokeWidth={2} />
        </button>
      </div>

    </aside>
  );
}
