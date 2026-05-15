"use client";
import AuditorSidebar from "@/components/auditor/Sidebar";
import Link from "next/link";
import {
  RiBellLine,
  RiSearchLine,
  RiSnowflakeLine,
  RiEyeLine,
  RiAlertLine,
} from "react-icons/ri";

const employees = [
  { initials: "LA", color: "bg-amber-200 text-amber-700",   name: "Liam Anderson",  id: "LAG-00198", role: "Records Officer",       dna: 28, status: "Frozen", location: "Mushin, Lagos", warn: true,  checkin: "2:15 PM"  },
  { initials: "MA", color: "bg-orange-200 text-orange-700", name: "Maya Thompson",  id: "LAG-00199", role: "Data Analyst",           dna: 28, status: "Frozen", location: "Mushin, Lagos", warn: true,  checkin: "9:05 AM"  },
  { initials: "KA", color: "bg-lime-200 text-lime-700",     name: "Kevin Adams",    id: "LAG-00200", role: "Project Manager",        dna: 28, status: "Frozen", location: "Mushin, Lagos", warn: true,  checkin: "11:30 PM" },
  { initials: "JA", color: "bg-purple-200 text-purple-700", name: "Jessica Allen",  id: "LAG-00201", role: "UX Designer",            dna: 52, status: "Review", location: "Mushin, Lagos", warn: true,  checkin: "6:50 AM"  },
  { initials: "RA", color: "bg-rose-200 text-rose-700",     name: "Ravi Kumar",     id: "LAG-00202", role: "Software Engineer",      dna: 67, status: "Review", location: "Ikeja, Lagos",  warn: false, checkin: "3:20 PM"  },
  { initials: "NA", color: "bg-teal-200 text-teal-700",     name: "Nina Patel",     id: "LAG-00203", role: "Marketing Specialist",   dna: 28, status: "Frozen", location: "Ikeja, Lagos",  warn: false, checkin: "8:33 AM"  },
  { initials: "SA", color: "bg-sky-200 text-sky-700",       name: "Samuel Lee",     id: "LAG-00204", role: "Sales Associate",        dna: 82, status: "Clear",  location: "Ikeja, Lagos",  warn: false, checkin: "12:45 PM" },
  { initials: "TA", color: "bg-violet-200 text-violet-700", name: "Tina Chen",      id: "LAG-00205", role: "Customer Support",       dna: 82, status: "Clear",  location: "Ikeja, Lagos",  warn: false, checkin: "4:10 PM"  },
  { initials: "PA", color: "bg-emerald-200 text-emerald-700", name: "Peter Brown",  id: "LAG-00206", role: "Financial Analyst",      dna: 82, status: "Clear",  location: "Ikeja, Lagos",  warn: false, checkin: "1:05 AM"  },
];

const statusBadge = (status: string) => {
  if (status === "Frozen")
    return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span>;
  if (status === "Review")
    return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Review</span>;
  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Clear</span>;
};

const dnaColor = (score: number) => {
  if (score < 40) return "text-rose-500 bg-rose-50 border-rose-200";
  if (score < 65) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
};

const filters = [
  { label: "All", count: 433, active: true },
  { label: "Frozen", count: 214 },
  { label: "Review", count: 56 },
  { label: "Clear", count: 90 },
];

const statCards = [
  { label: "Total Employees", value: "47", sub: "May 2026 payroll cycle", valueColor: "text-gray-900", bar: "bg-emerald-500" },
  { label: "Frozen",          value: "3",  sub: "Payment auto-blocked",   valueColor: "text-rose-500",  bar: "bg-rose-500"    },
  { label: "Under Review",    value: "8",  sub: "Awaiting manual decision",valueColor: "text-amber-600", bar: "bg-amber-400"   },
  { label: "Cleared",         value: "47", sub: "Payment released",        valueColor: "text-emerald-600", bar: "bg-emerald-500" },
];

export default function RiskLeaderboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuditorSidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-gray-900 font-semibold text-base">Risk Leaderboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">Federal Republic of Nigeria · Payroll Integrity System</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200">
              May 2026 cycle
            </span>
            <button className="relative text-gray-400 hover:text-gray-700 transition-colors">
              <RiBellLine className="text-lg" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map(({ label, value, sub, valueColor, bar }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm overflow-hidden">
                <p className="text-gray-400 text-xs font-medium mb-2">{label}</p>
                <p className={`text-3xl font-bold mb-1 ${valueColor}`}>{value}</p>
                <p className="text-gray-400 text-xs mb-3">{sub}</p>
                <div className="h-0.5 rounded-full bg-gray-100 -mx-5 -mb-5">
                  <div className={`h-full ${bar} rounded-full`} style={{ width: "100%" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-gray-800 font-semibold text-sm">All Employees – Sorted by Risk</h2>
              <div className="flex items-center gap-2">
                {filters.map(({ label, count, active }) => (
                  <button
                    key={label}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      active
                        ? "bg-[#0D2B1F] text-white"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {active ? `All(${count})` : `${label}(${count})`}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 ml-2">
                  <RiSearchLine className="text-gray-400 text-sm" />
                  <input
                    placeholder="Search employees"
                    className="text-xs bg-transparent outline-none text-gray-600 w-32 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="w-10 px-5 py-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Employee</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">DNA Score</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Status</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Verified Location</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Check-in time</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full ${emp.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                          {emp.initials}
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm font-medium leading-tight">{emp.name}</p>
                          <p className="text-gray-400 text-[11px]">{emp.id} · {emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${dnaColor(emp.dna)}`}>{emp.dna}</span>
                    </td>
                    <td className="py-3.5 pr-4">{statusBadge(emp.status)}</td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        {emp.warn && <RiAlertLine className="text-amber-500 text-sm flex-shrink-0" />}
                        <span className={`text-sm ${emp.warn ? "text-amber-700 font-medium" : "text-gray-600"}`}>
                          {emp.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-gray-600 text-sm">{emp.checkin}</span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        {emp.status !== "Clear" && (
                          <>
                            {emp.warn ? (
                              <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors">
                                <RiSnowflakeLine className="text-xs" /> Freeze
                              </button>
                            ) : (
                              <button className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                                Hold
                              </button>
                            )}
                          </>
                        )}
                        <Link href={`/auditor/cases/${emp.id}`}>
                          <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#0D2B1F] text-white hover:bg-emerald-900 transition-colors">
                            <RiEyeLine className="text-xs" /> View
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Page</span>
                <select className="border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-700 bg-white focus:outline-none">
                  <option>1</option><option>2</option><option>3</option>
                </select>
                <span>of 10</span>
              </div>
              <p className="text-gray-400 text-xs">Showing 7 of 58 employees · Sorted by DNA Score ascending</p>
              <div className="flex gap-2">
                <button className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Previous</button>
                <button className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
