"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiBarChart2Line,
  RiFileList3Line,
  RiDownloadCloud2Line,
  RiFileTextLine,
  RiSettingsLine,
  RiLogoutBoxLine,
  RiBuilding2Line,
  RiCalendarLine,
} from "react-icons/ri";
import { PiLeafFill } from "react-icons/pi";
import { usersApi } from "@/lib/api/users.api";
import { useAuthStore } from "@/lib/store/auth.store";
import type { UserProfile } from "@/lib/types";

const navItems = [
  { href: "/auditor",           label: "Risk Leaderboard",  icon: RiBarChart2Line,     badge: "26", badgeStyle: "green" },
  { href: "/auditor/cases",     label: "Active Cases",      icon: RiFileList3Line,     badge: "5",  badgeStyle: "red"   },
  { href: "/auditor/reports",   label: "Exported Reports",  icon: RiDownloadCloud2Line                                  },
  { href: "/auditor/audit-log", label: "Audit Log",         icon: RiFileTextLine                                        },
  { href: "/auditor/settings",  label: "Settings",          icon: RiSettingsLine                                        },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function AuditorSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const logout   = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    usersApi.getMe()
      .then((res) => setProfile(res.data.data))
      .catch(() => {/* ignore */});
  }, []);

  const displayName = profile?.name ?? "Auditor";
  const orgName     = profile?.orgName ?? "Clouds Tech";
  const initials    = getInitials(displayName);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
            <div className="w-7 h-7 bg-emerald-700 rounded flex items-center justify-center shrink-0">
              <RiBuilding2Line className="text-emerald-300 text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold leading-tight truncate">{orgName}</p>
              <p className="text-emerald-400 text-[10px] truncate">Payroll Integrity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Cycle */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="bg-[#1a3d2b] rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-emerald-700 rounded flex items-center justify-center shrink-0">
              <RiCalendarLine className="text-emerald-300 text-xs" />
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
        <p className="text-white/30 text-[9px] uppercase tracking-widest px-2 mb-2">Auditor Tools</p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge, badgeStyle }) => {
            const active =
              pathname === href ||
              (href !== "/auditor" && pathname.startsWith(href));
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
                  <Icon className={`text-base shrink-0 ${active ? "text-emerald-300" : "text-white/40 group-hover:text-white/70"}`} />
                  <span className="flex-1 text-sm">{label}</span>
                  {badge && (
                    <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                      badgeStyle === "green"
                        ? "bg-emerald-600/40 text-emerald-300 border border-emerald-600/50"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
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
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{displayName}</p>
            <p className="text-white/40 text-[10px]">Auditor · {orgName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/70 transition-colors"
            title="Logout"
          >
            <RiLogoutBoxLine className="text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}
