"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import { useState } from "react";
import { Building2, Bell, Lock, Users, Calendar, ChevronRight, Check } from "lucide-react";

type Section = "organisation" | "payroll" | "notifications" | "users" | "security";

const sections: { id: Section; label: string; Icon: React.ElementType; description: string }[] = [
  { id: "organisation", label: "Organisation",       Icon: Building2, description: "Ministry name, logo, and contact details" },
  { id: "payroll",      label: "Payroll Schedule",   Icon: Calendar,  description: "Disbursement dates, thresholds, and cycle settings" },
  { id: "notifications",label: "Notifications",      Icon: Bell,      description: "Email alerts, invite timing, and system events" },
  { id: "users",        label: "User Management",    Icon: Users,     description: "HR staff accounts and auditor access" },
  { id: "security",     label: "Security",           Icon: Lock,      description: "Password policy, 2FA, and session settings" },
];

function OrganisationSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Ministry name",    value: "Ministry of Finance" },
          { label: "State",            value: "Lagos State" },
          { label: "Contact email",    value: "finance@lagosstate.gov.ng" },
          { label: "Phone number",     value: "+234 801 234 5678" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-[#4e4e4e] text-[13px] font-medium">{label}</label>
            <input
              defaultValue={value}
              className="h-[42px] border border-[#e0e3dc] rounded-xl px-3 text-[14px] text-[#1e1e1e] bg-white outline-none focus:border-[#3a6e57] transition-colors"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[#4e4e4e] text-[13px] font-medium">Ministry address</label>
        <textarea
          defaultValue="The Secretariat, Alausa, Ikeja, Lagos"
          rows={2}
          className="border border-[#e0e3dc] rounded-xl px-3 py-2.5 text-[14px] text-[#1e1e1e] bg-white outline-none focus:border-[#3a6e57] transition-colors resize-none"
        />
      </div>
    </div>
  );
}

function PayrollSection() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Disbursement day",       value: "25" },
          { label: "Invite send time (hrs before payday)", value: "24" },
          { label: "Freeze threshold (DNA score)", value: "40" },
          { label: "Review threshold (DNA score)",  value: "65" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-[#4e4e4e] text-[13px] font-medium">{label}</label>
            <input
              defaultValue={value}
              type="number"
              className="h-[42px] border border-[#e0e3dc] rounded-xl px-3 text-[14px] text-[#1e1e1e] bg-white outline-none focus:border-[#3a6e57] transition-colors"
            />
          </div>
        ))}
      </div>
      <div className="bg-[#fef3c7] rounded-xl p-3">
        <p className="text-[#b45309] text-[13px] font-normal leading-relaxed">
          Changes to thresholds apply from the <strong>next</strong> payroll cycle. Employees already frozen will not be automatically unfrozen.
        </p>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Verification invite emails":    true,
    "Freeze alert emails":           true,
    "Score decline alerts":          true,
    "Auditor investigation updates": false,
    "Payroll disbursement summary":  true,
    "Weekly DNA score digest":       false,
  });

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(toggles).map(([label, on]) => (
        <div key={label} className="flex items-center justify-between p-3 border border-[#f0f0f0] rounded-xl bg-white">
          <span className="text-[14px] text-[#1e1e1e] font-medium">{label}</span>
          <button
            onClick={() => setToggles(t => ({ ...t, [label]: !t[label] }))}
            className={`relative w-[44px] h-[24px] rounded-full transition-colors ${on ? "bg-[#3a6e57]" : "bg-[#e0e3dc]"}`}
          >
            <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${on ? "translate-x-[23px]" : "translate-x-[3px]"}`} />
          </button>
        </div>
      ))}
    </div>
  );
}

function UsersSection() {
  const users = [
    { name: "Amara Okon",      role: "HR Manager · Payroll",    initials: "AO", active: true },
    { name: "Kemi Adeyemi",    role: "Senior Auditor",          initials: "KA", active: true },
    { name: "Tunde Balogun",   role: "HR Officer",              initials: "TB", active: false },
  ];

  return (
    <div className="flex flex-col gap-3">
      {users.map(({ name, role, initials, active }) => (
        <div key={name} className="flex items-center gap-3 p-3 border border-[#f0f0f0] rounded-xl bg-white">
          <div className="w-9 h-9 rounded-full bg-[#e0f2ea] flex items-center justify-center shrink-0">
            <span className="text-[#3a6e57] text-[12px] font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#1e1e1e] font-medium leading-tight">{name}</p>
            <p className="text-[12px] text-[#828282] leading-tight">{role}</p>
          </div>
          <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${active ? "bg-[#dcfce7] text-[#158079]" : "bg-[#f0f0f0] text-[#828282]"}`}>
            {active ? "Active" : "Inactive"}
          </span>
          <button className="text-[12px] text-[#4e4e4e] border border-[#e0e3dc] rounded-lg px-2.5 py-1 hover:bg-gray-50 transition-colors">
            Edit
          </button>
        </div>
      ))}
      <button className="flex items-center justify-center gap-2 h-[42px] border border-dashed border-[#3a6e57] rounded-xl text-[#3a6e57] text-[14px] font-medium hover:bg-[#f0faf5] transition-colors">
        + Invite user
      </button>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4e4e4e] text-[13px] font-medium">Current password</label>
          <input type="password" placeholder="••••••••" className="h-[42px] border border-[#e0e3dc] rounded-xl px-3 text-[14px] bg-white outline-none focus:border-[#3a6e57] transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[#4e4e4e] text-[13px] font-medium">New password</label>
          <input type="password" placeholder="••••••••" className="h-[42px] border border-[#e0e3dc] rounded-xl px-3 text-[14px] bg-white outline-none focus:border-[#3a6e57] transition-colors" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[
          "Two-factor authentication (2FA)",
          "Require password reset every 90 days",
          "Auto-logout after 30 minutes of inactivity",
        ].map(label => (
          <div key={label} className="flex items-center justify-between p-3 border border-[#f0f0f0] rounded-xl bg-white">
            <span className="text-[14px] text-[#1e1e1e] font-medium">{label}</span>
            <div className="w-5 h-5 rounded border-2 border-[#3a6e57] bg-[#3a6e57] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionContent: Record<Section, React.ReactNode> = {
  organisation:  <OrganisationSection />,
  payroll:       <PayrollSection />,
  notifications: <NotificationsSection />,
  users:         <UsersSection />,
  security:      <SecuritySection />,
};

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("organisation");
  const current = sections.find(s => s.id === active)!;

  return (
    <div className="flex min-h-screen bg-[#f0f2f6]">
      <Sidebar />
      <div className="ml-[250px] flex-1 flex flex-col min-w-0">
        <Topbar title="Settings" />
        <main className="flex-1 p-6 flex gap-6">

          {/* Left nav */}
          <div className="w-[220px] shrink-0 flex flex-col gap-1">
            {sections.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 h-[40px] px-3 rounded-xl text-left text-[13px] font-medium transition-colors ${
                  active === id
                    ? "bg-white text-[#1e1e1e] border border-[#f0f0f0] shadow-sm"
                    : "text-[#4e4e4e] hover:bg-white/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active === id ? "text-[#3a6e57]" : "text-[#828282]"}`} strokeWidth={2} />
                <span className="flex-1">{label}</span>
                {active === id && <ChevronRight className="w-3.5 h-3.5 text-[#828282] shrink-0" strokeWidth={2} />}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="flex-1 bg-white rounded-xl border border-[#f0f0f0] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#e0e3dc]">
              <h2 className="text-[#1e1e1e] text-[16px] font-bold">{current.label}</h2>
              <p className="text-[#828282] text-[13px] font-normal mt-0.5">{current.description}</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {sectionContent[active]}
            </div>

            <div className="px-6 py-4 border-t border-[#e0e3dc] flex justify-end gap-2">
              <button className="h-[40px] px-5 rounded-xl border border-[#e0e3dc] text-[#4e4e4e] text-[14px] font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="h-[40px] px-5 rounded-xl bg-[#3a6e57] hover:bg-[#2d5745] text-white text-[14px] font-medium transition-colors">
                Save changes
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
