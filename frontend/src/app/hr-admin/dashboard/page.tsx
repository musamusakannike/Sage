"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import {
  RiCheckboxCircleLine,
  RiTimeLine,
  RiErrorWarningLine,
  RiSearchLine,
  RiMessageLine,
  RiAddLine,
  RiEditLine,
  RiMessage2Line,
} from "react-icons/ri";

const employees = [
  { initials: "LA", color: "bg-amber-200 text-amber-700", name: "Liam Anderson", id: "LAG-00198", role: "Records Officer", dna: 28, status: "Frozen" },
  { initials: "MA", color: "bg-orange-200 text-orange-700", name: "Maya Thompson", id: "LAG-00199", role: "Data Analyst", dna: 28, status: "Frozen" },
  { initials: "KA", color: "bg-lime-200 text-lime-700", name: "Kevin Adams", id: "LAG-00200", role: "Project Manager", dna: 28, status: "Frozen" },
  { initials: "JA", color: "bg-purple-200 text-purple-700", name: "Jessica Allen", id: "LAG-00201", role: "UX Designer", dna: 52, status: "Review" },
  { initials: "RA", color: "bg-rose-200 text-rose-700", name: "Ravi Kumar", id: "LAG-00202", role: "Software Engineer", dna: 67, status: "Review" },
  { initials: "NA", color: "bg-teal-200 text-teal-700", name: "Nina Patel", id: "LAG-00203", role: "Marketing Specialist", dna: 28, status: "Frozen" },
  { initials: "SA", color: "bg-sky-200 text-sky-700", name: "Samuel Lee", id: "LAG-00204", role: "Sales Associate", dna: 82, status: "Clear" },
  { initials: "TA", color: "bg-violet-200 text-violet-700", name: "Tina Chen", id: "LAG-00205", role: "Customer Support", dna: 82, status: "Clear" },
  { initials: "PA", color: "bg-emerald-200 text-emerald-700", name: "Peter Brown", id: "LAG-00206", role: "Financial Analyst", dna: 82, status: "Clear" },
];

const statusBadge = (status: string) => {
  if (status === "Frozen") return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span>;
  if (status === "Review") return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Review</span>;
  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Clear</span>;
};

const dnaColor = (score: number) => {
  if (score < 40) return "text-rose-500 bg-rose-50";
  if (score < 65) return "text-amber-600 bg-amber-50";
  return "text-emerald-600 bg-emerald-50";
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        <Topbar title="Dashboard" />
        <main className="flex-1 p-6 space-y-5">

          {/* Hero Banner */}
          <div className="bg-[#0D2B1F] rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D2B1F] via-[#0D2B1F] to-emerald-900/40 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-emerald-400 text-xs font-medium mb-1 uppercase tracking-wider">Next Payroll Disbursement</p>
              <h2 className="text-white text-2xl font-bold mb-1">May 2026 Salary Cycle</h2>
              <p className="text-white/50 text-sm mb-3">Scheduled for 25 May 2026 — via Squad Disburse</p>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Active · 47 employees verified
              </span>
            </div>
            <div className="relative z-10 flex items-center gap-3">
              {[{ val: "05", label: "Days" }, { val: "14", label: "Hours" }, { val: "22", label: "Minutes" }].map(({ val, label }, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="bg-white/10 border border-white/10 rounded-xl w-16 h-16 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold tabular-nums">{val}</span>
                  </div>
                  <span className="text-white/40 text-[10px] mt-1 uppercase tracking-wide">{label}</span>
                  {i < 2 && <span className="absolute text-white/40 text-2xl font-light" style={{ marginLeft: "68px", marginTop: "-22px" }}>:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Employees", value: "90", color: "text-gray-900", border: "border-b-emerald-500" },
              { label: "Verified & Cleared", value: "47", color: "text-emerald-600", border: "border-b-emerald-500" },
              { label: "Pending Review", value: "8", color: "text-amber-500", border: "border-b-amber-400" },
              { label: "Frozen — Action Needed", value: "3", color: "text-rose-500", border: "border-b-rose-500" },
            ].map(({ label, value, color, border }) => (
              <div key={label} className={`bg-white rounded-xl p-5 border border-gray-100 border-b-2 ${border} shadow-sm`}>
                <p className="text-gray-400 text-xs font-medium mb-2">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* SMS Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RiMessageLine className="text-emerald-600 text-lg flex-shrink-0" />
              <div>
                <p className="text-emerald-800 text-sm font-semibold">Verification SMS invites scheduled for 24 May 2026, 09:00 AM</p>
                <p className="text-emerald-600 text-xs">58 unique links will be sent to employees — 24 hours before payday</p>
              </div>
            </div>
            <button className="bg-[#0D2B1F] hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Preview Invites
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-[1fr_280px] gap-5">
            {/* Employee Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-gray-800 font-semibold text-sm">Employees — May 2026</h3>
                <div className="flex items-center gap-2">
                  {[
                    { label: "All (433)", active: true },
                    { label: "Frozen (214)" },
                    { label: "Review (56)" },
                    { label: "Clear (90)" },
                  ].map(({ label, active }) => (
                    <button
                      key={label}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        active
                          ? "bg-[#0D2B1F] text-white"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 ml-2">
                    <RiSearchLine className="text-gray-400 text-sm" />
                    <input placeholder="Search" className="text-xs bg-transparent outline-none text-gray-600 w-28 placeholder-gray-400" />
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="w-10 px-5 py-3"><input type="checkbox" className="rounded border-gray-300" /></th>
                    <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Employee</th>
                    <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">DNA Score</th>
                    <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                            {emp.initials}
                          </div>
                          <div>
                            <p className="text-gray-800 text-sm font-medium leading-tight">{emp.name}</p>
                            <p className="text-gray-400 text-[11px]">{emp.id} · {emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${dnaColor(emp.dna)}`}>{emp.dna}</span>
                      </td>
                      <td className="py-3">{statusBadge(emp.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100">
                <p className="text-gray-400 text-xs">Showing 7 of 58 employees · Sorted by DNA Score ascending</p>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Previous</button>
                  <button className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* Payroll Summary Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold text-sm mb-4">Payroll Summary</h3>
                <div className="mb-4">
                  <p className="text-gray-400 text-[11px] uppercase tracking-wide mb-0.5">Total disbursement</p>
                  <p className="text-gray-900 text-2xl font-bold">₦16,850,000</p>
                  <p className="text-gray-400 text-xs">across 55 cleared employees</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5 mb-4">
                  <p className="text-rose-600 text-xs font-medium">₦770,000 frozen — 3 employees pending resolution</p>
                </div>
                <div className="space-y-3">
                  {[
                    { count: 47, label: "Cleared for payment", sub: "Release automatically on 25 May", color: "text-emerald-600", bg: "bg-emerald-100" },
                    { count: 8, label: "Awaiting manual review", sub: "You must approve before payday", color: "text-amber-600", bg: "bg-amber-100" },
                    { count: 3, label: "Auto-frozen by AI", sub: "Auditor notified · Under investigation", color: "text-rose-500", bg: "bg-rose-100" },
                  ].map(({ count, label, sub, color, bg }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className={`${bg} ${color} w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                        {count}
                      </div>
                      <div>
                        <p className="text-gray-700 text-xs font-semibold">{label}</p>
                        <p className="text-gray-400 text-[10px]">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <button className="w-full bg-[#0D2B1F] hover:bg-emerald-900 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  Upload New Roster <RiAddLine />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors">
                  Edit Payroll Schedule <RiEditLine />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors">
                  Resend SMS Invites <RiMessage2Line />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
