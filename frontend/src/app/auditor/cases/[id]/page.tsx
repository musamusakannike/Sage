"use client";
import { useState } from "react";
import Link from "next/link";
import AuditorSidebar from "@/components/auditor/Sidebar";
import {
  RiBellLine,
  RiArrowLeftLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseLine,
  RiSnowflakeLine,
  RiFlag2Line,
  RiDownloadLine,
  RiShieldLine,
  RiMapPinLine,
} from "react-icons/ri";

const dnaBars = [
  { label: "Liveness Match",      score: 8,  max: 30, pass: false, color: "bg-rose-500"   },
  { label: "Geolocation Cluster", score: 0,  max: 20, pass: false, color: "bg-rose-500"   },
  { label: "Device Fingerprint",  score: 10, max: 20, pass: false, color: "bg-amber-500"  },
  { label: "Check-in Time",       score: 10, max: 15, pass: true,  color: "bg-emerald-500"},
  { label: "Post-pay velocity",   score: 0,  max: 15, pass: false, color: "bg-rose-500"   },
];

const transactions = [
  {
    bank: "GT Bank ****4421",
    amount: "₦280,000",
    flag: "47 sec after receipt — velocity flag",
    sub: "Also received funds from F. Al-Hassan & E. Kalu this cycle",
    time: null,
  },
  {
    bank: "Opay ****9981",
    amount: "₦60,000",
    flag: "2 minutes 12 seconds after receipt — velocity flag",
    sub: "New destination — not seen in prior cycles",
    time: null,
  },
  {
    bank: "Kuda ****1207",
    amount: "₦10,000",
    flag: null,
    sub: "Location matches verified check-in GPS",
    time: "15 May 10:40 AM — ATM withdrawal, Mushin Lagos",
  },
];

const verificationLocations = [
  { cycle: "May 2026", coords: "6.533°N, 3.352°E", label: "Mushin, Lagos", tag: "Shared", tagStyle: "bg-orange-50 text-orange-600 border border-orange-200", sub: "2 other employees verified within 200m", accent: "border-l-orange-400" },
  { cycle: "Apr 2026", coords: "6.531°N, 3.355°E", label: "Mushin, Lagos", tag: "Near match", tagStyle: "bg-yellow-50 text-yellow-700 border border-yellow-200", sub: "320m from May — same area, different street", accent: "border-l-yellow-400" },
  { cycle: "March 2026", coords: "6.60°N, 3.34°E", label: "Ikeja, Lagos", tag: "Unique", tagStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200", sub: "No other employees verified near this location", accent: "border-l-emerald-400" },
];

const fraudFlow = [
  { initials: "CO", color: "bg-amber-200 text-amber-700", name: "C. Obi", time: "−47 sec",  account: "GT ****4421" },
  { initials: "FR", color: "bg-rose-200 text-rose-700",   name: "F. Robinson", time: "1 min", account: "GT ****4421" },
  { initials: "SA", color: "bg-sky-200 text-sky-700",     name: "S. Adams", time: "2 min",   account: "GT ****4421" },
];

const moneyTrailEmployees = [
  { initials: "CO", color: "bg-amber-200 text-amber-700",   name: "Chukwuemeka Obi", role: "Senior Accountant", score: 28, amount: "₦280,000 sent", timing: "47 seconds after receiving salary", destination: "GT Bank ****4421", destLabel: "Suspected controller account" },
  { initials: "JA", color: "bg-purple-200 text-purple-700", name: "Jasmine Albright",  role: "Project Manager",    score: 11, amount: "₦321,000 sent", timing: "1 min 12 sec after receiving salary", destination: "GT Bank ****4421", destLabel: "Suspected controller account" },
  { initials: "MI", color: "bg-teal-200 text-teal-700",     name: "Mira Iyer",         role: "Revenue collector",  score: 32, amount: "₦80,000 sent",  timing: "2 min 40 sec after receiving salary", destination: "GT Bank ****4421", destLabel: "Suspected controller account" },
];

const forwardedAccounts = [
  { account: "Opay ****9981",   time: "08:31 AM", amount: "₦320,000" },
  { account: "Palmpay ****1234",time: "09:15 AM", amount: "₦150,000" },
  { account: "Kuda ****5678",   time: "10:45 AM", amount: "₦200,000" },
];

export default function CaseProfilePage() {
  const [tab, setTab] = useState<"overview" | "trail">("overview");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuditorSidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-gray-900 font-semibold text-base">Case Profile — Chukwuemeka Obi</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">Federal Republic of Nigeria · Payroll Integrity System</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200">May 2026 cycle</span>
            <button className="relative text-gray-400 hover:text-gray-700 transition-colors">
              <RiBellLine className="text-lg" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-4">
          {/* Back */}
          <Link href="/auditor" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <RiArrowLeftLine /> Back
          </Link>

          {tab === "overview" ? (
            <div className="grid grid-cols-[1fr_300px] gap-5">
              {/* ── LEFT COLUMN ── */}
              <div className="space-y-4">
                {/* Employee Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-lg font-bold flex-shrink-0">CO</div>
                      <div>
                        <h2 className="text-gray-900 font-bold text-lg leading-tight">Chukwuemeka Obi</h2>
                        <p className="text-gray-500 text-sm">Senior Accountant · #LAG-00214</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-200">Frozen</span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1">
                            <RiAlertLine className="text-xs" /> Score declining
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center gap-1">
                            <RiFlag2Line className="text-xs" /> Flagged
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl font-black text-rose-500 leading-none">28</p>
                      <p className="text-rose-500 font-bold text-sm mt-1">HIGH RISK</p>
                      <p className="text-gray-400 text-[11px] mt-1">Auto-frozen · Threshold: 40</p>
                      <p className="text-gray-400 text-[11px]">4 of 5 signals failed</p>
                    </div>
                  </div>
                </div>

                {/* DNA Score Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold text-sm">DNA Score Breakdown</h3>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <RiAlertLine /> −43 pts in 2 months
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dnaBars.map(({ label, score, max, pass, color }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-gray-600 text-xs w-40 flex-shrink-0">{label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${(score / max) * 100}%` }} />
                        </div>
                        <span className="text-gray-500 text-xs w-12 text-right">{score} / {max}</span>
                        {pass
                          ? <RiCheckLine className="text-emerald-500 text-sm flex-shrink-0" />
                          : <RiCloseLine className="text-rose-500 text-sm flex-shrink-0" />
                        }
                      </div>
                    ))}
                  </div>
                  {/* Bar chart */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-end gap-6 h-16 px-4">
                      {[{ month: "Mar", val: 71, color: "bg-emerald-400" }, { month: "Apr", val: 41, color: "bg-amber-400" }, { month: "May", val: 28, color: "bg-rose-400" }].map(({ month, val, color }) => (
                        <div key={month} className="flex flex-col items-center gap-1 flex-1">
                          <span className="text-xs font-semibold text-gray-600">{val}</span>
                          <div className={`w-full rounded-t-md ${color}`} style={{ height: `${(val / 71) * 48}px` }} />
                          <span className="text-[10px] text-gray-400">{month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Liveness Session */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-semibold text-sm">Liveness Session</h3>
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      <RiCloseLine /> Face mismatch · Both attempts failed
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-sm mb-4">
                    {[
                      { label: "Attempted at", value: "15 May 2026, 07:43 AM" },
                      { label: "Challenge issued", value: "Blink twice · Tilt head right" },
                      { label: "Face match score", value: "31% confidence (threshold: 80%)" },
                      { label: "Retries", value: "2 of 2 used — both failed" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-gray-400 text-[11px] mb-0.5">{label}</p>
                        <p className="text-gray-700 text-xs font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {["Attempt 1", "Attempt 1", "Onboarding reference"].map((label, i) => (
                      <div key={i} className="rounded-xl bg-gray-100 overflow-hidden">
                        <div className="h-20 flex items-center justify-center bg-gray-200">
                          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                          </svg>
                        </div>
                        <div className={`px-2 py-1.5 flex items-center gap-1 ${i < 2 ? "bg-rose-50" : "bg-gray-50"}`}>
                          {i < 2
                            ? <><RiCloseLine className="text-rose-500 text-xs" /><span className="text-[10px] text-rose-600 font-medium">{label} · Mismatch</span></>
                            : <span className="text-[10px] text-gray-500 font-medium">{label}</span>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post Payment Transactions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-gray-800 font-semibold text-sm mb-4">Post Payment Transactions</h3>
                  <div className="space-y-3">
                    {transactions.map(({ bank, amount, flag, sub, time }, i) => (
                      <div key={i} className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex-1">
                          <p className="text-gray-800 text-sm font-semibold">{bank}</p>
                          {time && <p className="text-gray-500 text-[11px] mt-0.5">{time}</p>}
                          {flag && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                              <p className="text-rose-600 text-[11px]">{flag}</p>
                            </div>
                          )}
                          <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>
                        </div>
                        <span className="text-rose-600 font-bold text-sm ml-4 flex-shrink-0">{amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5">
                    <p className="text-rose-700 text-xs font-medium">₦340,000 of ₦350,000 salary swept within 5 minutes of receipt — 97% of salary moved immediately</p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="space-y-4">
                {/* Device & Location */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <h3 className="text-gray-800 font-semibold text-sm mb-3">Device and Location</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 mb-3">
                    <p className="text-amber-800 text-xs font-semibold">Same device used by 2 other employees</p>
                    <p className="text-amber-700 text-[11px] mt-0.5">F. Al-Hassan and E. Kalu verified on this device this cycle</p>
                  </div>
                  <div className="space-y-2 mb-3">
                    {[
                      { label: "Device ID", value: "a7f3c9d2...b4e1" },
                      { label: "Device type", value: "Android · Tecno Spark 10" },
                      { label: "First seen", value: "Apr 2026 (last cycle)" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px]">{label}</span>
                        <span className="text-gray-700 text-[11px] font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-[11px]">Employees on device</span>
                      <span className="text-amber-600 text-[11px] font-semibold flex items-center gap-1"><RiAlertLine /> 3 this cycle</span>
                    </div>
                  </div>
                  {/* Map placeholder */}
                  <div className="h-28 bg-emerald-50 rounded-xl mb-3 overflow-hidden relative border border-emerald-100">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <RiMapPinLine className="text-5xl text-emerald-600" />
                    </div>
                    <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(0,0,0,0.03) 20px,rgba(0,0,0,0.03) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(0,0,0,0.03) 20px,rgba(0,0,0,0.03) 21px)" }} />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2">
                      <div className="w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div className="absolute top-10 left-[45%]">
                      <div className="w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow-sm" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-[11px] font-medium mb-2">Verification Locations — Last 3 Cycles</p>
                  <div className="space-y-2">
                    {verificationLocations.map(({ cycle, coords, label, tag, tagStyle, sub, accent }) => (
                      <div key={cycle} className={`border-l-2 ${accent} pl-3 py-1`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-gray-700 text-xs font-semibold">{cycle}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tagStyle}`}>{tag}</span>
                        </div>
                        <p className="text-gray-500 text-[11px]">{label} · {coords}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fraud Ring Analysis */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <h3 className="text-gray-800 font-semibold text-sm mb-3 flex items-center gap-1.5">
                    <RiShieldLine className="text-rose-500" /> Fraud Ring Analysis
                  </h3>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5 mb-3">
                    <p className="text-rose-800 text-xs font-semibold">3 employees sent money to the same account within 4 hours of receiving their salary</p>
                    <p className="text-rose-600 text-[11px] mt-0.5">₦540,000 collected by a single controller, forwarded onward within 15 minutes</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 bg-rose-200 text-rose-800 rounded-full">High confidence</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {fraudFlow.map(({ initials, color, name, time, account }) => (
                      <div key={name} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>{initials}</div>
                        <span className="text-gray-600 text-xs flex-1">{name}</span>
                        <span className="text-gray-400 text-[11px]">{time}</span>
                        <span className="text-gray-500 text-xs font-mono">{account}</span>
                        <RiArrowRightSmall />
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <button
                      onClick={() => setTab("trail")}
                      className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-emerald-700 font-medium transition-colors"
                    >
                      <span>₦540,000 collected by suspected controller</span>
                      <span className="text-emerald-600 text-xs font-semibold">Full trail →</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                    <RiFlag2Line /> Flag
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                    <RiSnowflakeLine /> Freeze
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                    <RiDownloadLine /> Export
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── MONEY TRAIL TAB ── */
            <div>
              {/* Alert Banner */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-3.5 flex items-center justify-between mb-5">
                <div className="flex items-start gap-3">
                  <RiAlertLine className="text-rose-500 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-rose-800 text-sm font-semibold">3 employees sent money to the same account within 4 hours of receiving their salary</p>
                    <p className="text-rose-600 text-xs mt-0.5">₦540,000 collected by a single controller, forwarded onward within 15 minutes</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-rose-200 text-rose-800 rounded-full flex-shrink-0 ml-4">High confidence</span>
              </div>

              <div className="grid grid-cols-[1fr_280px] gap-5">
                {/* Trail Cards */}
                <div>
                  <h2 className="text-gray-800 font-semibold text-sm mb-4">Money trail · May 2026 disbursement</h2>
                  <div className="space-y-3">
                    {moneyTrailEmployees.map(({ initials, color, name, role, score, amount, timing, destination, destLabel }, i) => (
                      <div key={name}>
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{initials}</div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm leading-tight">{name}</p>
                                <p className="text-gray-400 text-xs">{role}</p>
                              </div>
                            </div>
                            <span className="text-rose-500 text-sm font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg">{score}</span>
                          </div>
                          <p className="text-rose-600 font-bold text-base mb-0.5">{amount}</p>
                          <p className="text-gray-400 text-xs mb-3">↓ {timing}</p>
                          <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                            <p className="text-gray-500 text-[11px] uppercase tracking-wide font-medium mb-1">Destination</p>
                            <p className="text-rose-600 font-semibold text-sm">{destination}</p>
                            <p className="text-rose-500 text-xs mt-0.5">{destLabel}</p>
                          </div>
                        </div>
                        {i < moneyTrailEmployees.length - 1 && (
                          <div className="flex items-center gap-3 py-2 px-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-gray-400 text-[11px] whitespace-nowrap">same account also received from</span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Summary */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-2xl font-black text-gray-900">₦540k</p>
                        <p className="text-gray-400 text-xs mt-0.5">Total collected by controller</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-rose-500">&lt;3 min</p>
                        <p className="text-gray-400 text-xs mt-0.5">Average time to transfer</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">Controller then forwarded funds to these accounts within 15 minutes</p>
                    <div className="space-y-2.5">
                      {forwardedAccounts.map(({ account, time, amount }) => (
                        <div key={account} className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-800 text-xs font-semibold">{account}</p>
                            <p className="text-gray-400 text-[11px]">Transfer at {time}</p>
                          </div>
                          <span className="text-gray-700 text-xs font-bold">{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                        <RiFlag2Line /> Flag
                      </button>
                      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                        <RiSnowflakeLine /> Freeze
                      </button>
                      <button className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                        <RiDownloadLine /> Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Tab switcher (floating bottom bar) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-3 flex items-center gap-2">
          <button
            onClick={() => setTab("overview")}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${tab === "overview" ? "bg-[#0D2B1F] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setTab("trail")}
            className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors ${tab === "trail" ? "bg-[#0D2B1F] text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            Money Trail
          </button>
        </div>
      </div>
    </div>
  );
}

function RiArrowRightSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
