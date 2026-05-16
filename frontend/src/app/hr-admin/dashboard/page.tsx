"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import { useRouter } from "next/navigation";
import { Search, Plus, Mail, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api/users.api";
import { employeesApi } from "@/lib/api/employees.api";
import { payrollApi } from "@/lib/api/payroll.api";
import type { Employee, UserProfile, PayrollSchedule } from "@/lib/types";

interface DashboardStats {
  totalEmployees: number;
  cleared: number;
  review: number;
  frozen: number;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  if (status === "FROZEN") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fee2e2] text-[#b91c1c] whitespace-nowrap">Frozen</span>;
  if (status === "REVIEW") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fef3c7] text-[#b45309] whitespace-nowrap">Review</span>;
  if (status === "CLEAR") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#dcfce7] text-[#158079] whitespace-nowrap">Clear</span>;
  return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#e5e7eb] text-[#6b7280] whitespace-nowrap">Pending</span>;
}

function DnaBadge({ score }: { score: number }) {
  const cls = score < 40
    ? "text-[#b91c1c] bg-[#fee2e2]"
    : score < 65
    ? "text-[#b45309] bg-[#fef3c7]"
    : "text-[#158079] bg-[#dcfce7]";
  return <span className={`text-[12px] font-medium px-[5px] py-0.5 rounded-full whitespace-nowrap ${cls}`}>{score}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    cleared: 0,
    review: 0,
    frozen: 0,
  });
  const [payrollSchedule, setPayrollSchedule] = useState<PayrollSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, employeesRes] = await Promise.all([
          usersApi.getMe(),
          employeesApi.list({ limit: 100 }),
        ]);

        setUserProfile(userRes.data.data);

        const employeeData = employeesRes.data.data.data;
        setEmployees(employeeData);

        const totalEmployees = employeesRes.data.data.total;
        setStats({
          totalEmployees,
          cleared: employeeData.filter(e => e.status === "CLEAR").length,
          review:  employeeData.filter(e => e.status === "REVIEW").length,
          frozen:  employeeData.filter(e => e.status === "FROZEN").length,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }

      // Payroll schedule is optional — don't let it crash the dashboard
      try {
        const payrollRes = await payrollApi.getSchedule();
        setPayrollSchedule(payrollRes.data.data);
      } catch {
        // schedule will be created on first visit after orgId is valid
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f0f2f6]">
        <Sidebar />
        <div className="ml-[250px] flex-1 flex flex-col min-w-0">
          <Topbar title="Dashboard" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p className="text-[#828282] text-[14px]">Loading dashboard...</p>
          </main>
        </div>
      </div>
    );
  }

  const orgName = userProfile?.orgName || "Organization";
  const verifiedCount = stats.cleared;
  const pendingCount = stats.totalEmployees - stats.cleared;

  return (
    <div className="flex min-h-screen bg-[#f0f2f6]">
      <Sidebar />
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <Topbar title="Dashboard" />
        <main className="flex-1 p-6 flex flex-col gap-6">

          {/* Hero Banner */}
          <div className="bg-[#0f172a] rounded-xl p-6 flex items-center gap-2 shrink-0">
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <p className="text-white text-[14px] font-normal">Next Payroll Disbursement</p>
              <div className="flex flex-col gap-1">
                <p className="text-white text-[22px] font-bold leading-tight">May 2026 Salary Cycle</p>
                <p className="text-white text-[14px] font-normal">Scheduled for 25 May 2026 — via Squad Disburse</p>
              </div>
              <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#158079] text-[12px] font-medium px-[6px] py-1 rounded-full self-start">
                <span className="w-1.5 h-1.5 bg-[#158079] rounded-full shrink-0" />
                Active · {verifiedCount} employees verified
              </span>
            </div>
            <div className="flex items-center gap-px shrink-0">
              {[{ val: "05", label: "Days" }, { val: "14", label: "Hours" }, { val: "22", label: "Minutes" }].map(({ val, label }, i) => (
                <div key={label} className="flex items-center">
                  <div className="bg-white/10 rounded-lg w-[80px] p-3 flex flex-col items-center gap-1">
                    <span className="text-white text-[32px] font-semibold leading-none tabular-nums">{val}</span>
                    <span className="text-[#828282] text-[14px] font-medium">{label}</span>
                  </div>
                  {i < 2 && <span className="text-white text-[32px] font-semibold px-px">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2 shrink-0">
            {[
              { label: "Total Employees",      value: String(stats.totalEmployees), color: "text-[#3a6e57]", bar: "bg-[#158079]" },
              { label: "Verified & Cleared",   value: String(stats.cleared), color: "text-[#158079]", bar: "bg-[#158079]" },
              { label: "Pending Review",        value: String(stats.review),  color: "text-[#b45309]", bar: "bg-[#b45309]" },
              { label: "Frozen - Action Needed", value: String(stats.frozen), color: "text-[#b91c1c]", bar: "bg-[#b91c1c]" },
            ].map(({ label, value, color, bar }) => (
              <div key={label} className="relative bg-white rounded-xl pb-4 pt-3 px-3 border border-[#f0f0f0] overflow-hidden">
                <p className="text-[#828282] text-[12px] font-medium mb-2 whitespace-nowrap">{label}</p>
                <p className={`text-[32px] font-extrabold leading-[1.24] ${color}`}>{value}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-[4px] ${bar}`} />
              </div>
            ))}
          </div>

          {/* Email Notification Banner */}
          <div className="bg-[#dcfce7] rounded-xl px-3 py-3 flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#158079]" strokeWidth={2} />
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="text-[#158079] text-[14px] font-medium leading-tight">
                Verification email invites scheduled for 24 May 2026, 09:00 AM
              </p>
              <p className="text-[#158079] text-[12px] font-normal">
                {pendingCount} unique links will be sent to employees — 24 hours before payday
              </p>
            </div>
            <button className="bg-[#3a6e57] hover:bg-[#2d5745] text-white text-[12px] font-medium h-[28px] px-[10px] py-3 rounded-lg flex items-center transition-colors shrink-0 whitespace-nowrap">
              Preview Invites
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="flex gap-6 min-h-0">
            {/* Employee Table */}
            <div className="flex-1 bg-white rounded-xl overflow-hidden min-w-0 flex flex-col">
              {/* Table header */}
              <div className="px-4 py-2 flex items-center justify-between gap-2 shrink-0">
                <h3 className="text-[#4e4e4e] font-bold text-[14px] whitespace-nowrap">Employees — May 2026</h3>
                <div className="flex items-center gap-2">
                  {/* Filter tabs */}
                  <div className="bg-[#f8f8f8] flex gap-0.5 items-center p-1 rounded-full w-[355px]">
                    {[
                      { label: `All (${stats.totalEmployees})`,     active: true },
                      { label: `Frozen (${stats.frozen})`, active: false },
                      { label: `Review (${stats.review})`,   active: false },
                      { label: `Clear (${stats.cleared})`,    active: false },
                    ].map(({ label, active }) => (
                      <button
                        key={label}
                        className={`flex-1 text-[12px] px-3.5 py-2.5 rounded-full transition-colors ${
                          active
                            ? "bg-white text-[#1f1f1f] font-medium shadow-[0px_1px_5px_rgba(0,0,0,0.1)]"
                            : "text-[#4d4d4d] font-normal"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div className="flex items-center border border-[#ededed] rounded-full px-4 py-3 w-[160px] gap-2 h-[46px]">
                    <Search className="w-4 h-4 text-[#787878] shrink-0" strokeWidth={2} />
                    <input
                      placeholder="Search"
                      className="text-[14px] bg-transparent outline-none text-[#787878] w-full placeholder-[#787878] font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-[#ededed] flex-1 flex flex-col overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8f8f8]">
                      <th className="w-12 px-6 py-3 text-left">
                        <div className="w-4 h-4 border border-[#dfe1e6] rounded bg-white" />
                      </th>
                      <th className="text-left text-[12px] text-[#1f1f1f] font-medium py-3 pr-4">Employee</th>
                      <th className="text-left text-[12px] text-[#1f1f1f] font-medium py-3 pr-4 w-[115px]">DNA Score</th>
                      <th className="text-left text-[12px] text-[#1f1f1f] font-medium py-3 w-[127px]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 9).map((emp) => (
                      <tr
                        key={String(emp._id)}
                        className="border-b border-[#ededed] hover:bg-[#f8f8f8] cursor-pointer transition-colors"
                        onClick={() => router.push(`/hr-admin/employees/${String(emp._id)}`)}
                      >
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <div className="w-4 h-4 border border-[#dfe1e6] rounded bg-white" />
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-[42px] h-[42px] rounded-full bg-[#fed7aa] flex items-center justify-center shrink-0">
                              <span className="text-[#c24a25] text-[13px] font-bold">{getInitials(emp.name)}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[#4d4d4d] text-[12px] font-medium leading-tight overflow-hidden text-ellipsis whitespace-nowrap">{emp.name}</p>
                              <p className="text-[#787878] text-[10px] font-normal leading-tight overflow-hidden text-ellipsis whitespace-nowrap">{String(emp._id).slice(-8).toUpperCase()} · {emp.roleTitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <DnaBadge score={emp.dnaScore ?? 0} />
                        </td>
                        <td className="py-4">
                          <StatusBadge status={emp.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[#ededed] shrink-0 mt-auto">
                  <div className="flex items-center gap-2">
                    <p className="text-[#1f1f1f] text-[14px] font-medium">Page</p>
                    <div className="flex items-center gap-1">
                      <div className="border border-[#ededed] rounded-lg px-2 py-2 flex items-center gap-2">
                        <p className="text-[#1f1f1f] text-[14px] font-medium">1</p>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="#1f1f1f" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <p className="text-[#1f1f1f] text-[14px] font-medium">of 10</p>
                    </div>
                  </div>
                  <p className="text-[#787878] text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                    Showing {Math.min(9, employees.length)} of {stats.totalEmployees} employees · Sorted by DNA Score ascending
                  </p>
                  <div className="flex gap-3 shrink-0">
                    <button className="text-[14px] text-[#1f1f1f] font-medium px-3.5 py-2 border border-[#ededed] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-white">
                      Previous
                    </button>
                    <button className="text-[14px] text-[#1f1f1f] font-medium px-3.5 py-2 border border-[#ededed] rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] bg-white">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payroll Summary Sidebar */}
            <div className="flex flex-col gap-6 shrink-0 w-[325px]">
              {/* Payroll Summary Card */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="h-[56px] px-4 py-2 border-b border-[#e0e3dc] flex items-center justify-between">
                  <h3 className="text-[#4e4e4e] font-bold text-[14px]">Payroll Summary</h3>
                </div>
                <div className="overflow-hidden">
                  {/* Disbursement section */}
                  <div className="border-b border-[#f0f0f0] flex flex-col gap-3 p-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#828282] text-[14px] font-medium">Total disbursement</p>
                      <p className="text-[#1e1e1e] text-[22px] font-semibold leading-[1.24]">₦16,850,000</p>
                      <p className="text-[#4e4e4e] text-[12px] font-normal">across 55 cleared employees</p>
                    </div>
                    <div className="bg-[#fee2e2] rounded-xl p-3 flex items-start justify-center">
                      <p className="flex-1 text-[#b91c1c] text-[12px] font-normal">
                        ₦770,000 frozen — 3 employees pending resolution
                      </p>
                    </div>
                  </div>
                  {/* Status items */}
                  {[
                    { count: String(stats.cleared), label: "Cleared for payment",  sub: "Release automatically on 25 May",       color: "text-[#158079]" },
                    { count: String(stats.review),  label: "Awaiting manual review", sub: "You must approve before payday",        color: "text-[#b45309]" },
                    { count: String(stats.frozen),  label: "Auto-frozen by AI",    sub: "Auditor notified · Under investigation", color: "text-[#b91c1c]" },
                  ].map(({ count, label, sub, color }) => (
                    <div key={label} className="flex gap-2 items-center justify-center p-3">
                      <p className={`${color} text-[22px] font-semibold leading-[1.24] w-[30px] shrink-0`}>{count}</p>
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <p className="text-[#1e1e1e] text-[14px] font-medium leading-tight">{label}</p>
                        <p className="text-[#828282] text-[12px] font-normal leading-tight">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl p-3 flex flex-col gap-2">
                <button className="w-full bg-[#3a6e57] hover:bg-[#2d5745] text-white text-[14px] font-medium h-[50px] rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  Upload New Roster
                  <Plus className="w-5 h-5" strokeWidth={2} />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-[#4e4e4e] text-[14px] font-medium h-[50px] rounded-xl border border-[#e0e3dc] flex items-center justify-center gap-1.5 transition-colors">
                  Edit Payroll Schedule
                  <Pencil className="w-5 h-5" strokeWidth={2} />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-[#4e4e4e] text-[14px] font-medium h-[50px] rounded-xl border border-[#e0e3dc] flex items-center justify-center gap-1.5 transition-colors">
                  Resend email Invites
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
