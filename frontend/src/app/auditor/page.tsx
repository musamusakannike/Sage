"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuditorSidebar from "@/components/auditor/Sidebar";
import {
  RiBellLine,
  RiSearchLine,
  RiSnowflakeLine,
  RiEyeLine,
  RiAlertLine,
} from "react-icons/ri";
import { leaderboardApi, type LeaderboardEntry } from "@/lib/api/leaderboard.api";
import { useAuthStore } from "@/lib/store/auth.store";

// Handles all Mongo ObjectId shapes: plain string, { $oid }, BSON v5 internals
function resolveId(value: unknown): string {
  if (!value) return String(Math.random());
  if (typeof value === 'string' && value !== '[object Object]') return value;
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (typeof v.$oid === 'string') return v.$oid;
    const s = (v as { toString?: () => string }).toString?.();
    if (s && s !== '[object Object]') return s;
    try {
      const m = JSON.stringify(value).match(/[a-f0-9]{24}/i);
      if (m) return m[0];
    } catch { /* ignore */ }
  }
  return String(value);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-amber-200 text-amber-700",
  "bg-orange-200 text-orange-700",
  "bg-lime-200 text-lime-700",
  "bg-purple-200 text-purple-700",
  "bg-rose-200 text-rose-700",
  "bg-teal-200 text-teal-700",
  "bg-sky-200 text-sky-700",
  "bg-violet-200 text-violet-700",
  "bg-emerald-200 text-emerald-700",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const MOCK_LOCATIONS = [
  "Mushin, Lagos", "Ikeja, Lagos", "Surulere, Lagos",
  "Victoria Island, Lagos", "Lekki, Lagos", "Yaba, Lagos",
];
const MOCK_TIMES = [
  "9:05 AM", "11:30 AM", "2:15 PM", "6:50 AM",
  "3:20 PM", "8:33 AM", "12:45 PM", "4:10 PM",
  "1:05 PM", "7:40 AM", "10:22 AM", "5:15 PM",
];
function mockLocation(id: string) {
  const h = id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return MOCK_LOCATIONS[h % MOCK_LOCATIONS.length];
}
function mockTime(id: string) {
  const h = id.split("").reduce((a: number, c: string) => a * 31 + c.charCodeAt(0), 1);
  return MOCK_TIMES[Math.abs(h) % MOCK_TIMES.length];
}
function hasLocationWarning(id: string) {
  const h = id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  return h % 3 === 0;
}

const statusBadge = (status: string) => {
  if (status === "FROZEN")
    return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span>;
  if (status === "REVIEW")
    return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Review</span>;
  if (status === "CLEAR")
    return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Clear</span>;
  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">{status}</span>;
};

const dnaColor = (score: number | null) => {
  if (score === null) return "text-gray-400 bg-gray-50 border-gray-200";
  if (score < 40) return "text-rose-500 bg-rose-50 border-rose-200";
  if (score < 65) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
};

type FilterStatus = "" | "FROZEN" | "REVIEW" | "CLEAR";
const PAGE_SIZE = 10;

export default function RiskLeaderboardPage() {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);

  const [allEmployees, setAllEmployees] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState<FilterStatus>("");
  const [page, setPage]                 = useState(1);
  const [freezing, setFreezing]         = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leaderboardApi.list();
      const raw = res.data.data ?? (res.data as unknown as LeaderboardEntry[]);
      const entries = Array.isArray(raw) ? raw : [];
      // Normalise _id to a plain string at fetch time so every downstream
      // operation (key, href, comparison) always receives a real string.
      setAllEmployees(entries.map((e) => ({ ...e, _id: resolveId(e._id) })));
    } catch {
      setAllEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);
  useEffect(() => { setPage(1); }, [filter, search]);

  const filtered = allEmployees.filter((e) => {
    const matchStatus = filter === "" || e.status === filter;
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.roleTitle.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = {
    all:    allEmployees.length,
    frozen: allEmployees.filter((e) => e.status === "FROZEN").length,
    review: allEmployees.filter((e) => e.status === "REVIEW").length,
    clear:  allEmployees.filter((e) => e.status === "CLEAR").length,
  };

  const statCards = [
    { label: "Total Employees", value: String(counts.all),    sub: "May 2026 payroll cycle",    valueColor: "text-gray-900",    bar: "bg-emerald-500" },
    { label: "Frozen",          value: String(counts.frozen), sub: "Payment auto-blocked",      valueColor: "text-rose-500",    bar: "bg-rose-500"    },
    { label: "Under Review",    value: String(counts.review), sub: "Awaiting manual decision",  valueColor: "text-amber-600",   bar: "bg-amber-400"   },
    { label: "Cleared",         value: String(counts.clear),  sub: "Payment released",          valueColor: "text-emerald-600", bar: "bg-emerald-500" },
  ];

  const filterTabs: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All",    value: "",       count: counts.all    },
    { label: "Frozen", value: "FROZEN", count: counts.frozen },
    { label: "Review", value: "REVIEW", count: counts.review },
    { label: "Clear",  value: "CLEAR",  count: counts.clear  },
  ];

  const handleFreeze = async (emp: LeaderboardEntry) => {
    if (freezing) return;
    setFreezing(emp._id);
    try {
      await leaderboardApi.freeze(emp._id);
      setAllEmployees((prev) =>
        prev.map((e) => e._id === emp._id ? { ...e, status: "FROZEN" } : e),
      );
    } catch { /* silently ignore for hackathon demo */ }
    finally { setFreezing(null); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuditorSidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-gray-900 font-semibold text-base">Risk Leaderboard</h1>
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-gray-500 text-xs font-medium">{user.email}</span>
            )}
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
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-gray-800 font-semibold text-sm">All Employees – Sorted by Risk</h2>
              <div className="flex items-center gap-2">
                {filterTabs.map(({ label, value, count }) => (
                  <button
                    key={value || "all"}
                    onClick={() => setFilter(value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      filter === value
                        ? "bg-[#0D2B1F] text-white"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {label}({count})
                  </button>
                ))}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 ml-2">
                  <RiSearchLine className="text-gray-400 text-sm" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search employees"
                    className="text-xs bg-transparent outline-none text-gray-600 w-32 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="w-10 px-5 py-3"><input type="checkbox" className="rounded border-gray-300" /></th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Employee</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">DNA Score</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Status</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Verified Location</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3 pr-4">Check-in time</th>
                  <th className="text-left text-[11px] text-gray-400 font-semibold uppercase tracking-wide py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400 text-sm">Loading employees…</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400 text-sm">No employees found.</td></tr>
                ) : paginated.map((emp) => {
                  const id   = emp._id; // already a plain string from fetch normalisation
                  const warn = hasLocationWarning(id);
                  return (
                    <tr key={id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-full ${avatarColor(emp.name)} flex items-center justify-center text-xs font-bold shrink-0`}>
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <p className="text-gray-800 text-sm font-medium leading-tight">{emp.name}</p>
                            <p className="text-gray-400 text-[11px]">{id.slice(-8).toUpperCase()} · {emp.roleTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        {emp.dnaScore !== null ? (
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg border ${dnaColor(emp.dnaScore)}`}>
                            {emp.dnaScore}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">{statusBadge(emp.status)}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-1.5">
                          {warn && <RiAlertLine className="text-amber-500 text-sm shrink-0" />}
                          <span className={`text-sm ${warn ? "text-amber-700 font-medium" : "text-gray-600"}`}>
                            {mockLocation(id)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="text-gray-600 text-sm">{mockTime(id)}</span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          {emp.status !== "FROZEN" && emp.status !== "CLEAR" && (
                            <button
                              onClick={() => handleFreeze(emp)}
                              disabled={!!freezing}
                              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <RiSnowflakeLine className="text-xs" />
                              {freezing === id ? "Freezing…" : "Freeze"}
                            </button>
                          )}
                          {emp.status === "REVIEW" && (
                            <button className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                              Hold
                            </button>
                          )}
                          <button
                            onClick={() => router.push(`/auditor/cases/${id}`)}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#0D2B1F] text-white hover:bg-emerald-900 transition-colors"
                          >
                            <RiEyeLine className="text-xs" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
              <p className="text-gray-400 text-xs">
                {loading
                  ? "Loading…"
                  : `Showing ${Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} employees · Sorted by DNA Score ascending`
                }
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="flex items-center px-3 text-xs text-gray-500">{page} / {totalPages}</span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
