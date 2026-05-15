"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import Link from "next/link";
import { RiArrowLeftLine, RiAlertLine, RiCheckLine, RiCloseLine, RiMessage2Line, RiSnowflakeLine } from "react-icons/ri";

const signals = [
  { label: "Liveness Match", score: 8, max: 30, pct: 27, pass: false },
  { label: "Geolocation Cluster", score: 0, max: 20, pct: 0, pass: false },
  { label: "Device Fingerprint", score: 10, max: 20, pct: 50, pass: false },
  { label: "Check-in Time", score: 10, max: 15, pct: 67, pass: true },
  { label: "Post-pay velocity", score: 0, max: 15, pct: 0, pass: false },
];

const barColor = (pass: boolean, pct: number) => {
  if (pass) return "bg-emerald-500";
  if (pct > 40) return "bg-amber-500";
  return "bg-rose-500";
};

export default function EmployeeDetailPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        <Topbar title="Employee Detail — Chukwuemeka Obi" />
        <main className="flex-1 p-6">
          {/* Back */}
          <Link href="/employees">
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
              <RiArrowLeftLine className="text-base" /> Back
            </button>
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-700 overflow-hidden flex-shrink-0">
                CO
              </div>
              <div>
                <h2 className="text-gray-900 text-xl font-bold">Chukwuemeka Obi</h2>
                <p className="text-gray-400 text-sm">Senior Accountant · #LAG-00214</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                    <RiAlertLine className="text-xs" /> Score declining
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-red-500 text-5xl font-black">28</p>
              <p className="text-rose-500 text-sm font-bold mt-0.5">HIGH RISK</p>
              <p className="text-gray-400 text-xs">Auto-frozen · Threshold: 40</p>
              <p className="text-gray-400 text-xs">4 of 5 signals failed</p>
            </div>
          </div>

          {/* Two-col layout */}
          <div className="grid grid-cols-[1fr_300px] gap-5">
            {/* Left — DNA + History */}
            <div className="space-y-5">
              {/* DNA Score Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-800 font-semibold">DNA Score Breakdown</h3>
                  <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <RiAlertLine className="text-sm" /> -45 pts in 2 months
                  </span>
                </div>
                <div className="space-y-4">
                  {signals.map(({ label, score, max, pct, pass }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-gray-700 text-sm font-medium">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">{score} / {max}</span>
                          {pass
                            ? <RiCheckLine className="text-emerald-500 text-base" />
                            : <RiCloseLine className="text-rose-500 text-base" />
                          }
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor(pass, pct)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score History Chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-gray-800 font-semibold">Score History</h3>
                  <span className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <RiCloseLine className="text-sm" /> Face mismatch · Both attempts failed
                  </span>
                </div>
                <div className="flex items-end gap-6 h-36">
                  {[
                    { month: "Mar", val: 71, color: "bg-emerald-200", text: "text-emerald-700" },
                    { month: "Apr", val: 41, color: "bg-amber-200", text: "text-amber-700" },
                    { month: "May", val: 28, color: "bg-rose-200", text: "text-rose-600" },
                  ].map(({ month, val, color, text }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${text}`}>{val}</span>
                      <div
                        className={`w-full rounded-t-lg ${color}`}
                        style={{ height: `${(val / 80) * 100}%` }}
                      />
                      <span className="text-gray-400 text-xs">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Employee Info + Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold mb-4">Employee Info</h3>
                <dl className="space-y-3">
                  {[
                    { label: "Employee ID", value: "LAG-00214" },
                    { label: "Account number", value: "**** **** 7734" },
                    { label: "Phone", value: "0802 ****2261" },
                    { label: "May salary", value: "₦350,000", bold: true },
                    { label: "Verified at", value: "15 May 2026 · 07:43 AM" },
                  ].map(({ label, value, bold }) => (
                    <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                      <dt className="text-gray-400 text-xs">{label}</dt>
                      <dd className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-700 font-medium"}`}>{value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-1">
                    <dt className="text-gray-400 text-xs">Payment status</dt>
                    <dd><span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span></dd>
                  </div>
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-700 text-xs font-medium">Payment is currently frozen. You must manually release or confirm freeze before 25 May.</p>
              </div>

              <div className="space-y-2.5">
                <button className="w-full bg-[#0D2B1F] hover:bg-emerald-900 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  Release Payment <RiCheckLine className="text-base" />
                </button>
                <button className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-rose-400">
                  Confirm Freeze <RiSnowflakeLine className="text-base" />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3 rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-colors">
                  Resend SMS Invites <RiMessage2Line className="text-base" />
                </button>
              </div>

              {/* Auditor Note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-emerald-700 text-xs font-bold mb-1">Auditor Investigation Active</p>
                <p className="text-emerald-600 text-xs">Kemi Adeyemi (Senior Auditor) is reviewing this case. A case file export is pending. You will be notified when the investigation is complete.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
