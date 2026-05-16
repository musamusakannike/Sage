"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { employeesApi } from "@/lib/api/employees.api";
import type { Employee } from "@/lib/types";
import { ArrowLeft, AlertTriangle, Check, X, Mail, Snowflake } from "lucide-react";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function maskAccount(acc: string | null) {
  if (!acc || acc.length < 4) return "—";
  return `**** **** ${acc.slice(-4)}`;
}

function maskPhone(phone: string | null) {
  if (!phone || phone.length < 7) return "—";
  return `${phone.slice(0, 4)} ****${phone.slice(-4)}`;
}

function formatDate(iso: string | null) {
  if (!iso) return "Not verified yet";
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function riskLabel(score: number | null) {
  if (score === null) return { label: "PENDING", color: "#828282", bg: "#f0f0f0" };
  if (score < 40) return { label: "HIGH RISK", color: "#b91c1c", bg: "#fee2e2" };
  if (score < 65) return { label: "MEDIUM RISK", color: "#b45309", bg: "#fef3c7" };
  return { label: "LOW RISK", color: "#158079", bg: "#dcfce7" };
}

function StatusBadge({ status }: { status: string }) {
  if (status === "FROZEN") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fee2e2] text-[#b91c1c]">Frozen</span>;
  if (status === "REVIEW") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fef3c7] text-[#b45309]">Review</span>;
  if (status === "CLEAR")  return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#dcfce7] text-[#158079]">Clear</span>;
  if (status === "FLAGGED") return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fee2e2] text-[#b91c1c]">Flagged</span>;
  return <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#f0f0f0] text-[#828282]">Pending</span>;
}

export default function EmployeeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [emp, setEmp] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [acting, setActing] = useState(false);

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    try {
      const res = await employeesApi.getById(id);
      setEmp(res.data.data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchEmployee(); }, [fetchEmployee]);

  const handleFreeze = async () => {
    setActing(true);
    try {
      await employeesApi.freeze(id);
      await fetchEmployee();
    } finally {
      setActing(false);
    }
  };

  const handleRelease = async () => {
    setActing(true);
    try {
      await employeesApi.hold(id);
      await fetchEmployee();
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f0f2f6]">
        <Sidebar />
        <div className="ml-[250px] flex-1 flex flex-col min-w-0">
          <Topbar title="Employee Detail" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <p className="text-[#828282] text-[14px]">Loading employee…</p>
          </main>
        </div>
      </div>
    );
  }

  if (notFound || !emp) {
    return (
      <div className="flex min-h-screen bg-[#f0f2f6]">
        <Sidebar />
        <div className="ml-[250px] flex-1 flex flex-col min-w-0">
          <Topbar title="Employee Detail" />
          <main className="flex-1 p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-[#828282] text-[14px]">Employee not found.</p>
            <button
              onClick={() => router.push("/hr-admin/employees")}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors border border-[#f0f0f0]"
            >
              <ArrowLeft className="w-4 h-4 text-[#4e4e4e]" strokeWidth={2} />
              <span className="text-[#4e4e4e] text-[14px]">Back to Employees</span>
            </button>
          </main>
        </div>
      </div>
    );
  }

  const score = emp.dnaScore;
  const risk = riskLabel(score);
  const isFrozen = emp.status === "FROZEN" || emp.status === "FLAGGED";

  return (
    <div className="flex min-h-screen bg-[#f0f2f6]">
      <Sidebar />
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <Topbar title={`Employee Detail — ${emp.name}`} />
        <main className="flex-1 p-6 flex flex-col gap-6">

          {/* Back Button */}
          <div className="shrink-0">
            <button
              onClick={() => router.push("/hr-admin/employees")}
              className="flex items-center gap-2 bg-white rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors border border-[#f0f0f0]"
            >
              <ArrowLeft className="w-5 h-5 text-[#4e4e4e]" strokeWidth={2} />
              <span className="text-[#4e4e4e] text-[14px] font-normal">Back</span>
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-[#f0f0f0] rounded-xl p-6 flex items-start gap-3 shrink-0">
            <div className="w-16 h-16 rounded-full shrink-0 bg-[#fed7aa] flex items-center justify-center border-2 border-[#f0f0f0]">
              <span className="text-[#c24a25] text-[20px] font-bold">{getInitials(emp.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[#1e1e1e] text-[18px] font-bold leading-normal">{emp.name}</h2>
              <p className="text-[#4e4e4e] text-[14px] font-normal leading-normal">
                {emp.roleTitle} · #{String(emp._id).slice(-8).toUpperCase()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={emp.status} />
                {score !== null && score < 65 && (
                  <span className="flex items-center gap-1 text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fef3c7] text-[#b45309]">
                    <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                    Needs attention
                  </span>
                )}
              </div>
            </div>
            <div className="w-px self-stretch bg-[#e0e3dc] mx-2 shrink-0" />
            <div className="text-center w-[172px] shrink-0">
              <p className="text-[50px] font-extrabold leading-none mb-1" style={{ color: risk.color }}>
                {score ?? "—"}
              </p>
              <p className="text-[14px] font-medium" style={{ color: risk.color }}>{risk.label}</p>
              <p className="text-[#4e4e4e] text-[12px] font-normal mt-1">DNA Score · Threshold: 40 / 65</p>
              <p className="text-[#4e4e4e] text-[12px] font-normal">
                {emp.status === "FROZEN" ? "Auto-frozen" : emp.status === "CLEAR" ? "Cleared" : "Awaiting review"}
              </p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1fr_325px] gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">

              {/* DNA Score */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 h-[56px] border-b border-[#e0e3dc]">
                  <h3 className="text-[#4e4e4e] text-[14px] font-bold">Behavioural DNA Score</h3>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: risk.bg }}>
                    <AlertTriangle className="w-4 h-4" strokeWidth={2} style={{ color: risk.color }} />
                    <span className="text-[12px] font-normal" style={{ color: risk.color }}>{risk.label}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-[#ebebeb] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${score ?? 0}%`, backgroundColor: risk.color }}
                      />
                    </div>
                    <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: risk.color }}>
                      {score ?? 0} / 100
                    </span>
                  </div>
                  <p className="text-[#828282] text-[12px]">
                    Score below 40 freezes payment automatically. 40–64 requires manual review. 65+ clears for disbursement.
                  </p>
                </div>
              </div>

              {/* Verification */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center px-4 py-2 h-[56px] border-b border-[#e0e3dc]">
                  <h3 className="text-[#4e4e4e] text-[14px] font-bold">Verification Status</h3>
                </div>
                <div className="p-4 flex items-center gap-3">
                  {emp.lastVerifiedAt
                    ? <Check className="w-5 h-5 text-[#158079] shrink-0" strokeWidth={2.5} />
                    : <X className="w-5 h-5 text-[#b45309] shrink-0" strokeWidth={2.5} />}
                  <div>
                    <p className="text-[#1e1e1e] text-[14px] font-medium">
                      {emp.lastVerifiedAt ? "Liveness verification completed" : "Awaiting liveness verification"}
                    </p>
                    <p className="text-[#828282] text-[12px]">Last verified: {formatDate(emp.lastVerifiedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">

              {/* Employee Info */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="px-4 py-2 h-[56px] border-b border-[#e0e3dc] flex items-center">
                  <h3 className="text-[#4e4e4e] text-[14px] font-bold">Employee Info</h3>
                </div>
                <div>
                  {[
                    { label: "Employee ID",    value: String(emp._id).slice(-8).toUpperCase() },
                    { label: "Role",           value: emp.roleTitle },
                    { label: "Email",          value: emp.email || "—" },
                    { label: "Account number", value: maskAccount(emp.accountNumber) },
                    { label: "Phone",          value: maskPhone(emp.phone) },
                    { label: "Verified at",    value: formatDate(emp.lastVerifiedAt) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center p-3 border-b border-[#f0f0f0]">
                      <span className="flex-1 text-[#828282] text-[14px] font-medium">{label}</span>
                      <span className="flex-1 text-[#1e1e1e] text-[14px] font-medium text-right break-all">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center p-3">
                    <span className="flex-1 text-[#828282] text-[14px] font-medium">Payment status</span>
                    <span className="flex-1 flex justify-end"><StatusBadge status={emp.status} /></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl p-3 flex flex-col gap-2">
                {isFrozen && (
                  <div className="bg-[#fef3c7] rounded-xl p-3">
                    <p className="text-[#b45309] text-[12px] font-normal leading-normal">
                      Payment is currently frozen. Release or confirm the freeze before the next disbursement.
                    </p>
                  </div>
                )}
                <button
                  onClick={handleRelease}
                  disabled={acting}
                  className="w-full bg-[#3a6e57] hover:bg-[#2d5745] disabled:opacity-50 text-white text-[14px] font-medium h-[50px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  Release Payment
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleFreeze}
                  disabled={acting}
                  className="w-full bg-[#fee2e2] hover:bg-[#fecaca] disabled:opacity-50 text-[#b91c1c] text-[14px] font-medium h-[50px] rounded-xl border border-[#b91c1c] flex items-center justify-center gap-1.5 transition-colors"
                >
                  Freeze Payment
                  <Snowflake className="w-5 h-5" strokeWidth={2} />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-[#4e4e4e] text-[14px] font-medium h-[50px] rounded-xl border border-[#e0e3dc] flex items-center justify-center gap-1.5 transition-colors">
                  Resend Verification Email
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
