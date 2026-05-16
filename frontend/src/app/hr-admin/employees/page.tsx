"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { employeesApi } from "@/lib/api/employees.api";
import { extractId } from "@/lib/utils";
import type { Employee, ServerEmployeeStatus } from "@/lib/types";
import { Search, Download, Eye, Snowflake } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-orange-100 text-orange-700",
  "bg-lime-100 text-lime-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function StatusBadge({ status }: { status: string }) {
  if (status === "FROZEN") return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]">Frozen</span>;
  if (status === "REVIEW") return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">Review</span>;
  if (status === "CLEAR")  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#158079] border border-[#bbf7d0]">Clear</span>;
  return <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f0f0f0] text-[#828282]">Pending</span>;
}

function DnaBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[12px] text-[#828282]">—</span>;
  const cls = score < 40 ? "text-[#b91c1c] bg-[#fee2e2] border-[#fecaca]"
    : score < 65 ? "text-[#b45309] bg-[#fef3c7] border-[#fde68a]"
    : "text-[#158079] bg-[#dcfce7] border-[#bbf7d0]";
  return <span className={`text-[12px] font-bold px-2 py-0.5 rounded-lg border ${cls}`}>{score}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
type FilterStatus = "" | ServerEmployeeStatus;

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<FilterStatus>("");
  const [loading, setLoading]     = useState(true);

  // per-status counts for the tab badges
  const [counts, setCounts] = useState({ all: 0, frozen: 0, review: 0, clear: 0 });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeesApi.list({
        status: filter || undefined,
        search: search || undefined,
        page,
        limit: PAGE_SIZE,
      });
      const { data, total } = res.data.data;
      setEmployees(data.map(e => ({ ...e, _id: extractId(e._id) })));
      setTotal(total);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  // counts for all tabs (run once on mount and whenever search changes)
  const fetchCounts = useCallback(async () => {
    try {
      const [all, frozen, review, clear] = await Promise.all([
        employeesApi.list({ search: search || undefined, limit: 1 }),
        employeesApi.list({ status: "FROZEN", search: search || undefined, limit: 1 }),
        employeesApi.list({ status: "REVIEW", search: search || undefined, limit: 1 }),
        employeesApi.list({ status: "CLEAR",  search: search || undefined, limit: 1 }),
      ]);
      setCounts({
        all:    all.data.data.total,
        frozen: frozen.data.data.total,
        review: review.data.data.total,
        clear:  clear.data.data.total,
      });
    } catch { /* ignore */ }
  }, [search]);

  useEffect(() => { fetch(); },        [fetch]);
  useEffect(() => { fetchCounts(); },  [fetchCounts]);

  // reset to page 1 when filter/search changes
  useEffect(() => { setPage(1); }, [filter, search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tabs: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All",    value: "",        count: counts.all    },
    { label: "Frozen", value: "FROZEN",  count: counts.frozen },
    { label: "Review", value: "REVIEW",  count: counts.review },
    { label: "Clear",  value: "CLEAR",   count: counts.clear  },
  ];

  return (
    <div className="flex min-h-screen bg-[#f0f2f6]">
      <Sidebar />
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <Topbar title="Employees" />
        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-[#f0f0f0] overflow-hidden flex flex-col">

            {/* Header */}
            <div className="px-5 py-4 border-b border-[#f0f0f0] flex items-center justify-between gap-3 flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 border border-[#ededed] rounded-full px-3 py-2 w-[200px]">
                <Search className="w-4 h-4 text-[#828282] shrink-0" strokeWidth={2} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search employees…"
                  className="text-[13px] bg-transparent outline-none text-[#1e1e1e] w-full placeholder-[#828282]"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Filter tabs */}
                <div className="flex items-center gap-1">
                  {tabs.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setFilter(t.value)}
                      className={`text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        filter === t.value
                          ? "bg-[#1e1e1e] text-white"
                          : "text-[#4e4e4e] hover:bg-[#f0f2f6]"
                      }`}
                    >
                      {t.label} ({t.count})
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 text-[12px] text-[#4e4e4e] hover:text-[#1e1e1e] border border-[#e0e3dc] hover:bg-[#f0f2f6] px-3 py-1.5 rounded-lg transition-colors font-medium">
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f0f0f0] bg-[#f8f8f8]">
                  <th className="w-10 px-5 py-3"><input type="checkbox" className="rounded border-[#dfe1e6]" /></th>
                  <th className="text-left text-[11px] text-[#828282] font-semibold uppercase tracking-wide py-3 pr-4">Employee</th>
                  <th className="text-left text-[11px] text-[#828282] font-semibold uppercase tracking-wide py-3 pr-4">DNA Score</th>
                  <th className="text-left text-[11px] text-[#828282] font-semibold uppercase tracking-wide py-3 pr-4">Status</th>
                  <th className="text-left text-[11px] text-[#828282] font-semibold uppercase tracking-wide py-3 pr-4">Account</th>
                  <th className="text-left text-[11px] text-[#828282] font-semibold uppercase tracking-wide py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#828282] text-[14px]">Loading employees…</td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[#828282] text-[14px]">No employees found.</td>
                  </tr>
                ) : employees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="border-b border-[#f0f0f0] hover:bg-[#f8f8f8] transition-colors cursor-pointer"
                    onClick={() => router.push(`/hr-admin/employees/${emp._id}`)}
                  >
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-[#dfe1e6]" />
                    </td>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${avatarColor(emp.name)}`}>
                          {getInitials(emp.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[#1e1e1e] text-[13px] font-medium leading-tight truncate">{emp.name}</p>
                          <p className="text-[#828282] text-[11px] leading-tight truncate">{emp._id.slice(-8).toUpperCase()} · {emp.roleTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4"><DnaBadge score={emp.dnaScore} /></td>
                    <td className="py-3.5 pr-4"><StatusBadge status={emp.status} /></td>
                    <td className="py-3.5 pr-4">
                      <span className="text-[#828282] text-[13px] font-mono">
                        {emp.accountNumber ? `**** ${emp.accountNumber.slice(-4)}` : "—"}
                      </span>
                    </td>
                    <td className="py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {emp.status === "FROZEN" && (
                          <button
                            onClick={() => employeesApi.freeze(emp._id)}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca] hover:bg-[#fecaca] transition-colors"
                          >
                            <Snowflake className="w-3 h-3" /> Freeze
                          </button>
                        )}
                        {emp.status === "REVIEW" && (
                          <button
                            onClick={() => employeesApi.hold(emp._id)}
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#f0f0f0] text-[#4e4e4e] border border-[#e0e3dc] hover:bg-[#e0e3dc] transition-colors"
                          >
                            Hold
                          </button>
                        )}
                        <Link href={`/hr-admin/employees/${emp._id}`} onClick={e => e.stopPropagation()}>
                          <button className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] text-white hover:bg-[#3a6e57] transition-colors">
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-[#f0f0f0]">
              <p className="text-[#828282] text-[12px]">
                {loading ? "Loading…" : `Showing ${((page - 1) * PAGE_SIZE) + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total} employees`}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="text-[12px] text-[#4e4e4e] hover:text-[#1e1e1e] px-3 py-1.5 border border-[#e0e3dc] rounded-lg hover:bg-[#f0f2f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="flex items-center px-3 text-[12px] text-[#4e4e4e]">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="text-[12px] text-[#4e4e4e] hover:text-[#1e1e1e] px-3 py-1.5 border border-[#e0e3dc] rounded-lg hover:bg-[#f0f2f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
