"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Check, X, Mail, Snowflake } from "lucide-react";

const signals = [
  { label: "Liveness Match",      score: 8,  max: 30, pass: false, color: "bg-[#b91c1c]",  textColor: "text-[#b91c1c]"  },
  { label: "Geolocation Cluster", score: 0,  max: 20, pass: false, color: "bg-[#b91c1c]",  textColor: "text-[#b91c1c]"  },
  { label: "Device Fingerprint",  score: 10, max: 20, pass: false, color: "bg-[#b45309]",  textColor: "text-[#b45309]"  },
  { label: "Check-in Time",       score: 10, max: 15, pass: true,  color: "bg-[#158079]",  textColor: "text-[#158079]"  },
  { label: "Post-pay velocity",   score: 0,  max: 15, pass: false, color: "bg-[#b91c1c]",  textColor: "text-[#b91c1c]"  },
];

const scoreHistory = [
  { month: "Mar", val: 71, barColor: "bg-[#dcfce7]", textColor: "text-[#158079]" },
  { month: "Apr", val: 41, barColor: "bg-[#fef3c7]", textColor: "text-[#b45309]" },
  { month: "May", val: 28, barColor: "bg-[#fee2e2]", textColor: "text-[#b91c1c]" },
];

const maxScore = 80;

export default function EmployeeDetailPage() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f6]">
      <Sidebar />
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <Topbar title="Employee Detail — Chukwuemeka Obi" />
        <main className="flex-1 p-6 flex flex-col gap-6">

          {/* Back Button */}
          <div className="shrink-0">
            <Link href="/hr-admin/employees">
              <button className="flex items-center gap-2 bg-white rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors border border-[#f0f0f0]">
                <ArrowLeft className="w-5 h-5 text-[#4e4e4e]" strokeWidth={2} />
                <span className="text-[#4e4e4e] text-[14px] font-normal">Back</span>
              </button>
            </Link>
          </div>

          {/* Profile Card */}
          <div className="bg-white border border-[#f0f0f0] rounded-xl p-6 flex items-start gap-3 shrink-0">
            <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden border-2 border-[#f0f0f0]">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Chukwuemeka Obi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[#1e1e1e] text-[18px] font-bold leading-normal">Chukwuemeka Obi</h2>
              <p className="text-[#4e4e4e] text-[14px] font-normal leading-normal">Senior Accountant · #LAG-00214</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fee2e2] text-[#b91c1c]">
                  Frozen
                </span>
                <span className="flex items-center gap-1 text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fef3c7] text-[#b45309]">
                  <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                  Score declining
                </span>
              </div>
            </div>
            <div className="w-px self-stretch bg-[#e0e3dc] mx-2 shrink-0" />
            <div className="text-center w-[172px] shrink-0">
              <p className="text-[#b91c1c] text-[50px] font-extrabold leading-none mb-1">28</p>
              <p className="text-[#b91c1c] text-[14px] font-medium">HIGH RISK</p>
              <p className="text-[#4e4e4e] text-[12px] font-normal mt-1">Auto-frozen · Threshold: 40</p>
              <p className="text-[#4e4e4e] text-[12px] font-normal">4 of 5 signals failed</p>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-[1fr_325px] gap-6">
            {/* Left column */}
            <div className="flex flex-col gap-6">

              {/* DNA Score Breakdown */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 h-[56px] border-b border-[#e0e3dc]">
                  <h3 className="text-[#4e4e4e] text-[14px] font-bold">DNA Score Breakdown</h3>
                  <div className="flex items-center gap-2 bg-[#fef3c7] rounded-xl px-3 py-2">
                    <AlertTriangle className="w-4 h-4 text-[#b45309]" strokeWidth={2} />
                    <span className="text-[#b45309] text-[12px] font-normal">−45 pts in 2 months</span>
                  </div>
                </div>
                <div>
                  {signals.map(({ label, score, max, pass, color, textColor }) => {
                    const pct = max > 0 ? (score / max) * 100 : 0;
                    return (
                      <div key={label} className="flex items-center p-3 border-b border-[#f0f0f0] last:border-0 gap-3">
                        <span className="text-[#1e1e1e] text-[14px] font-normal w-[200px] shrink-0">{label}</span>
                        <div className="flex flex-1 items-center gap-3 min-w-0">
                          <div className="flex-1 h-1.5 bg-[#ebebeb] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`${textColor} text-[14px] font-medium whitespace-nowrap shrink-0`}>
                            {score} / {max}
                          </span>
                          {pass
                            ? <Check className="w-4 h-4 text-[#158079] shrink-0" strokeWidth={2.5} />
                            : <X className="w-4 h-4 text-[#b91c1c] shrink-0" strokeWidth={2.5} />
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Score History */}
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 h-[56px] border-b border-[#e0e3dc]">
                  <h3 className="text-[#4e4e4e] text-[14px] font-bold">Score History</h3>
                  <div className="flex items-center gap-2 bg-[#fee2e2] rounded-xl px-3 py-2">
                    <X className="w-4 h-4 text-[#b91c1c]" strokeWidth={2.5} />
                    <span className="text-[#b91c1c] text-[12px] font-normal">Face mismatch · Both attempts failed</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-end gap-2 h-40">
                    {scoreHistory.map(({ month, val, barColor, textColor }) => (
                      <div key={month} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[12px] font-normal ${textColor}`}>{val}</span>
                        <div
                          className={`w-full rounded-t ${barColor}`}
                          style={{ height: `${(val / maxScore) * 100}%` }}
                        />
                        <span className="text-[#4e4e4e] text-[12px] font-normal">{month}</span>
                      </div>
                    ))}
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
                    { label: "Employee ID",   value: "LAG-00214"             },
                    { label: "Account number", value: "**** **** 7734"       },
                    { label: "Phone",          value: "0802 ****2261"        },
                    { label: "May salary",     value: "₦350,000"             },
                    { label: "Verified at",    value: "15 May 2026 · 07:43 AM" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center p-3 border-b border-[#f0f0f0]">
                      <span className="flex-1 text-[#828282] text-[14px] font-medium">{label}</span>
                      <span className="flex-1 text-[#1e1e1e] text-[14px] font-medium">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center p-3 border-b border-[#f0f0f0]">
                    <span className="flex-1 text-[#828282] text-[14px] font-medium">Payment status</span>
                    <span className="text-[12px] font-medium px-[6px] py-1 rounded-full bg-[#fee2e2] text-[#b91c1c]">
                      Frozen
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl p-3 flex flex-col gap-2">
                <div className="bg-[#fef3c7] rounded-xl p-3">
                  <p className="text-[#b45309] text-[12px] font-normal leading-normal">
                    Payment is currently frozen. You must manually release or confirm freeze before 25 May.
                  </p>
                </div>
                <button className="w-full bg-[#3a6e57] hover:bg-[#2d5745] text-white text-[14px] font-medium h-[50px] rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  Release Payment
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <button className="w-full bg-[#fee2e2] hover:bg-[#fecaca] text-[#b91c1c] text-[14px] font-medium h-[50px] rounded-xl border border-[#b91c1c] flex items-center justify-center gap-1.5 transition-colors">
                  Confirm Freeze
                  <Snowflake className="w-5 h-5" strokeWidth={2} />
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-[#4e4e4e] text-[14px] font-medium h-[50px] rounded-xl border border-[#e0e3dc] flex items-center justify-center gap-1.5 transition-colors">
                  Resend email Invites
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* Auditor Note */}
              <div className="bg-[#dcfce7] rounded-xl p-3">
                <p className="text-[#158079] text-[14px] font-medium leading-normal mb-1">Auditor Investigation Active</p>
                <p className="text-[#158079] text-[12px] font-normal leading-normal">
                  Kemi Adeyemi (Senior Auditor) is reviewing this case. A case file export is pending. You will be notified when the investigation is complete.
                </p>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
