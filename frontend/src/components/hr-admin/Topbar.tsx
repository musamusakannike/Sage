"use client";
import { RiBellLine, RiAddLine } from "react-icons/ri";
import Link from "next/link";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <h1 className="text-gray-900 font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-xs">Federal Republic of Nigeria · Payroll Integrity System</span>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200">
          May 2026 cycle
        </span>
        <Link href="/upload-roster">
          <button className="bg-[#0D2B1F] hover:bg-[#1a3d2b] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
            Upload Roster
            <RiAddLine className="text-sm" />
          </button>
        </Link>
        <button className="relative text-gray-400 hover:text-gray-700 transition-colors">
          <RiBellLine className="text-lg" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
