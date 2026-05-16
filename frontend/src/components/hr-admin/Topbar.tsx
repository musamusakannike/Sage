"use client";
import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api/users.api";
import type { UserProfile } from "@/lib/types";

export default function Topbar({ title }: { title: string }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await usersApi.getMe();
        setUserProfile(res.data.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const orgName = userProfile?.orgName || "Organization";

  return (
    <header className="h-[55px] bg-white flex items-center gap-3 px-6 sticky top-0 z-30 w-full">
      <h1 className="font-bold text-[#1e1e1e] text-[16px] flex-1 min-w-0">{title}</h1>
      <div className="flex items-center gap-[7px] shrink-0">
        <span className="text-[#4e4e4e] text-[12px] font-normal whitespace-nowrap">
          {orgName} · Payroll Integrity System
        </span>
        <button className="bg-[#f4f4f4] border border-[#f0f0f0] text-[#4e4e4e] text-[12px] font-medium h-[36px] px-[10px] py-2 rounded-[8px] whitespace-nowrap">
          May 2026 cycle
        </button>
        <Link href="/hr-admin/upload-roster">
          <button className="bg-[#3a6e57] hover:bg-[#2d5745] text-white text-[12px] font-medium px-[10px] py-2 rounded-[8px] flex items-center gap-1.5 transition-colors whitespace-nowrap">
            Upload Roster
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        </Link>
        <button className="relative bg-[#f4f4f4] border border-[#f0f0f0] p-[4px] rounded-[8px] w-[31px] h-[31px] flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-[#4e4e4e]" strokeWidth={2} />
          <span className="absolute top-[3.5px] right-[3.5px] w-2 h-2 bg-[#b91c1c] rounded-full" />
        </button>
      </div>
    </header>
  );
}
