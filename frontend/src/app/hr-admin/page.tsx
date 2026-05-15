'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, Building2, Calendar, LayoutDashboard, FileUp, Users, Settings, LogOut,
  Bell, Search, Plus, Download, ChevronRight, Check, AlertTriangle, Snowflake, 
  Pause, Eye, ArrowLeft, UploadCloud, XCircle, CheckCircle2, ChevronLeft
} from 'lucide-react';

const EMPLOYEES_DATA = [
  { id: 'LAG-00198', initials: 'LA', name: 'Liam Anderson', role: 'Records Officer', score: 28, status: 'Frozen', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00199', initials: 'MA', name: 'Maya Thompson', role: 'Data Analyst', score: 28, status: 'Frozen', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00200', initials: 'KA', name: 'Kevin Adams', role: 'Project Manager', score: 28, status: 'Frozen', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00201', initials: 'JA', name: 'Jessica Allen', role: 'UX Designer', score: 52, status: 'Review', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00202', initials: 'RA', name: 'Ravi Kumar', role: 'Software Engineer', score: 67, status: 'Review', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00203', initials: 'NA', name: 'Nina Patel', role: 'Marketing Specialist', score: 28, status: 'Frozen', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00204', initials: 'SA', name: 'Samuel Lee', role: 'Sales Associate', score: 82, status: 'Clear', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00205', initials: 'TA', name: 'Tina Chen', role: 'Customer Support', score: 82, status: 'Clear', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
  { id: 'LAG-00206', initials: 'PA', name: 'Peter Brown', role: 'Financial Analyst', score: 82, status: 'Clear', account: '**** 7734', invite: 'Sent', bg: '#fcd34d' },
];

export default function HRAdminPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const viewTitles: any = {
    dashboard: 'Dashboard',
    employees: 'Employees',
    employee_detail: `Employee Detail — ${selectedEmployee?.name || 'Chukwuemeka Obi'}`,
    upload_roster: 'Upload Employee Roster'
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F7F9] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 flex flex-col h-full bg-[#0D291D] text-white overflow-y-auto">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Sage</span>
        </div>

        <div className="px-4 py-4 space-y-3 border-b border-white/10">
          <div className="bg-white/5 rounded-lg p-3 flex items-start gap-3 border border-white/10">
            <Building2 size={18} className="text-white/70 mt-0.5" />
            <div>
              <p className="text-sm font-semibold leading-tight">Lagos State Government</p>
              <p className="text-xs text-white/50 mt-1">Ministry of Finance</p>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/10">
            <Calendar size={18} className="text-white/70" />
            <div>
              <p className="text-xs text-white/50">Active cycle</p>
              <p className="text-sm font-semibold">May 2026</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <p className="text-xs font-semibold text-white/40 mb-3 tracking-wider">MAIN</p>
          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
            <SidebarItem icon={FileUp} label="Upload Roster" active={activeView === 'upload_roster'} onClick={() => setActiveView('upload_roster')} />
            <div className="relative">
              <SidebarItem icon={Users} label="Employees" active={activeView === 'employees' || activeView === 'employee_detail'} onClick={() => setActiveView('employees')} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-[#0D291D] text-[10px] font-bold px-2 py-0.5 rounded-full">5 Frozen</span>
            </div>
            <SidebarItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => {}} />
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Amara Okon" className="w-10 h-10 rounded-full border border-white/20" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Amara Okon</p>
              <p className="text-xs text-white/50 truncate">HR Manager · Payroll</p>
            </div>
            <button className="p-1.5 text-white/50 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-20">
          <h1 className="text-[20px] font-bold text-gray-900">{viewTitles[activeView]}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="hidden xl:inline">Federal Republic of Nigeria · Payroll Integrity System</span>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="font-semibold text-gray-700">May 2026 cycle</span>
            </div>
            <button 
              onClick={() => setActiveView('upload_roster')}
              className="bg-[#3A6E57] hover:bg-[#2d5744] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              Upload Roster <Plus size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center relative bg-gray-50 hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView setActiveView={setActiveView} />}
          {activeView === 'employees' && <EmployeesView setActiveView={setActiveView} setSelectedEmployee={setSelectedEmployee} />}
          {activeView === 'employee_detail' && <EmployeeDetailView employee={selectedEmployee} setActiveView={setActiveView} />}
          {activeView === 'upload_roster' && <UploadRosterView />}
        </main>
      </div>
    </div>
  );
}

// Sub-components

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#3A6E57]/30 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Frozen') return <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded text-xs font-semibold border border-red-100">Frozen</span>;
  if (status === 'Review') return <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded text-xs font-semibold border border-yellow-100">Review</span>;
  if (status === 'Clear') return <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-xs font-semibold border border-emerald-100">Clear</span>;
  return null;
}

// ---- DASHBOARD VIEW ----
function DashboardView({ setActiveView }: { setActiveView: (v: string) => void }) {
  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-[#0F172A] rounded-2xl p-6 md:p-8 text-white mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium mb-1">Next Payroll Disbursement</p>
          <h2 className="text-3xl font-bold mb-2">May 2026 Salary Cycle</h2>
          <p className="text-gray-300 mb-4 text-sm">Scheduled for 25 May 2026 — via Squad Disburse</p>
          <div className="inline-flex items-center gap-2 bg-[#3A6E57] text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Active · 47 employees verified
          </div>
        </div>
        <div className="flex items-center gap-4 mt-6 md:mt-0 relative z-10">
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[70px] border border-white/10">
            <p className="text-3xl font-bold">05</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Days</p>
          </div>
          <span className="text-3xl font-light text-white/30">:</span>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[70px] border border-white/10">
            <p className="text-3xl font-bold">14</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Hours</p>
          </div>
          <span className="text-3xl font-light text-white/30">:</span>
          <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[70px] border border-white/10">
            <p className="text-3xl font-bold">22</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Minutes</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Employees', value: '90', color: 'border-b-[#3A6E57]', text: 'text-[#3A6E57]' },
          { label: 'Verified & Cleared', value: '47', color: 'border-b-[#3A6E57]', text: 'text-[#3A6E57]' },
          { label: 'Pending Review', value: '8', color: 'border-b-[#D97706]', text: 'text-[#D97706]' },
          { label: 'Frozen - Action Needed', value: '3', color: 'border-b-[#DC2626]', text: 'text-[#DC2626]' }
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 border-b-4 ${stat.color}`}>
            <p className="text-gray-500 text-sm font-medium mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-emerald-600"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-emerald-800 font-semibold text-sm">Verification SMS invites scheduled for 24 May 2026, 09:00 AM</p>
            <p className="text-emerald-600/80 text-xs mt-0.5">58 unique links will be sent to employees — 24 hours before payday</p>
          </div>
        </div>
        <button className="bg-[#3A6E57] hover:bg-[#2d5744] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Preview Invites
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900">Employees — May 2026</h3>
            <div className="flex items-center gap-4">
              <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm text-sm font-medium">
                <button className="px-4 py-1.5 bg-white shadow rounded-full text-gray-900 border border-gray-100">All (433)</button>
                <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900">Frozen (214)</button>
                <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900">Review(56)</button>
                <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900">Clear(90)</button>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search" className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6E57]/20 shadow-sm" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-gray-500 bg-gray-50/50">
                <tr>
                  <th className="py-4 px-6 font-medium w-10"><input type="checkbox" className="rounded text-[#3A6E57] focus:ring-[#3A6E57]" /></th>
                  <th className="py-4 px-6 font-medium">Employee</th>
                  <th className="py-4 px-6 font-medium">DNA Score</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {EMPLOYEES_DATA.slice(0, 7).map((emp, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setActiveView('employees')}>
                    <td className="py-3 px-6"><input type="checkbox" className="rounded text-[#3A6E57] focus:ring-[#3A6E57]" onClick={e => e.stopPropagation()} /></td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#996b22] font-semibold bg-[#fde68a]">{emp.initials}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.id} · {emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`font-bold ${emp.score < 50 ? 'text-red-500' : emp.score < 75 ? 'text-yellow-600' : 'text-green-600'}`}>{emp.score}</span>
                    </td>
                    <td className="py-3 px-6"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>Showing 7 of 58 employees · Sorted by DNA Score ascending</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 font-medium shadow-sm text-gray-700">Previous</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 font-medium shadow-sm text-gray-700">Next</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Payroll Summary</h3>
              <p className="text-sm text-gray-500 mb-1">Total disbursement</p>
              <p className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">₦16,850,000</p>
              <p className="text-xs text-gray-500">across 55 cleared employees</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100 shadow-sm">
                ₦770,000 frozen — 3 employees pending resolution
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-100">47</div>
                  <div>
                    <p className="font-semibold text-gray-900">Cleared for payment</p>
                    <p className="text-xs text-gray-500 mt-1">Release automatically on 25 May</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-lg shrink-0 border border-yellow-100">8</div>
                  <div>
                    <p className="font-semibold text-gray-900">Awaiting manual review</p>
                    <p className="text-xs text-gray-500 mt-1">You must approve before payday</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg shrink-0 border border-red-100">3</div>
                  <div>
                    <p className="font-semibold text-gray-900">Auto-frozen by AI</p>
                    <p className="text-xs text-gray-500 mt-1">Auditor notified · Under investigation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
              <button onClick={() => setActiveView('upload_roster')} className="w-full bg-[#3A6E57] hover:bg-[#2d5744] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm">
                Upload New Roster <Plus size={16} />
              </button>
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
                Edit Payroll Schedule <LayoutDashboard size={16} className="rotate-90" />
              </button>
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
                Resend SMS Invites <Bell size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- EMPLOYEES VIEW ----
function EmployeesView({ setActiveView, setSelectedEmployee }: { setActiveView: (v: string) => void, setSelectedEmployee: (e: any) => void }) {
  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex-1 flex items-center gap-4 min-w-[600px]">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6E57]/20 shadow-sm" />
          </div>
          <div className="flex bg-white rounded-full p-1 border border-gray-200 shadow-sm text-sm font-medium">
            <button className="px-5 py-1.5 bg-white shadow rounded-full text-gray-900 border border-gray-100">All (433)</button>
            <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900">Frozen (214)</button>
            <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900">Review(56)</button>
            <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900">Clear(90)</button>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          Export CSV <Download size={16} />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-gray-100 text-gray-500 bg-gray-50/50">
              <tr>
                <th className="py-4 px-6 font-medium w-10"><input type="checkbox" className="rounded text-[#3A6E57] focus:ring-[#3A6E57]" /></th>
                <th className="py-4 px-6 font-medium">Employee</th>
                <th className="py-4 px-6 font-medium">DNA Score</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Account No.</th>
                <th className="py-4 px-6 font-medium">SMS Invite</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {EMPLOYEES_DATA.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6"><input type="checkbox" className="rounded text-[#3A6E57] focus:ring-[#3A6E57]" /></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#996b22] font-semibold bg-[#fde68a]">{emp.initials}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.id} · {emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold ${emp.score < 50 ? 'text-red-500' : emp.score < 75 ? 'text-yellow-600' : 'text-green-600'}`}>{emp.score}</span>
                  </td>
                  <td className="py-4 px-6"><StatusBadge status={emp.status} /></td>
                  <td className="py-4 px-6 font-mono text-gray-600 text-xs">{emp.account}</td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded text-xs font-semibold">Sent</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {emp.status === 'Frozen' && (
                        <button className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-red-100 transition-colors shadow-sm">
                          Freeze <Snowflake size={14} />
                        </button>
                      )}
                      {emp.status === 'Review' && (
                        <button className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-yellow-100 transition-colors shadow-sm">
                          Hold <Pause size={14} />
                        </button>
                      )}
                      {emp.status === 'Clear' && (
                        <div className="w-[84px]"></div>
                      )}
                      <button 
                        onClick={() => { setSelectedEmployee(emp); setActiveView('employee_detail'); }}
                        className="bg-[#3A6E57] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#2d5744] transition-colors shadow-sm"
                      >
                        View <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Page</span>
            <select className="bg-white border border-gray-200 rounded px-2 py-1 shadow-sm"><option>1</option></select>
            <span>of 10</span>
          </div>
          <span>Showing 7 of 58 employees · Sorted by DNA Score ascending</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 font-medium shadow-sm text-gray-700 transition-colors">Previous</button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 font-medium shadow-sm text-gray-700 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- EMPLOYEE DETAIL VIEW ----
function EmployeeDetailView({ employee, setActiveView }: { employee: any, setActiveView: (v: string) => void }) {
  const e = employee || EMPLOYEES_DATA[0];
  
  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <button 
        onClick={() => setActiveView('employees')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium mb-8 w-fit shadow-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex items-start justify-between mb-8">
        <div className="flex items-center gap-6">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt={e.name} className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{e.name}</h2>
            <p className="text-gray-500 mt-1">{e.role} · #{e.id.split('-')[1]}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Frozen</span>
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100 flex items-center gap-1.5">
                <AlertTriangle size={12} /> Score declining
              </span>
            </div>
          </div>
        </div>
        <div className="text-right border-l border-gray-100 pl-8 py-2">
          <p className="text-5xl font-bold text-red-500 mb-2 tracking-tight">{e.score}</p>
          <p className="text-red-600 font-bold text-sm tracking-wide">HIGH RISK</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">Auto-frozen · Threshold: 40<br/>4 of 5 signals failed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Breakdown */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-gray-900">DNA Score Breakdown</h3>
              <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-100 flex items-center gap-1.5 shadow-sm">
                <AlertTriangle size={12} /> -45 pts in 2 months
              </span>
            </div>
            
            <div className="space-y-6">
              {[
                { label: 'Liveness Match', val: 8, max: 30, color: 'bg-red-500', icon: <XCircle size={16} className="text-red-500" /> },
                { label: 'Geolocation Cluster', val: 0, max: 20, color: 'bg-gray-200', icon: <XCircle size={16} className="text-red-500" /> },
                { label: 'Device Fingerprint', val: 10, max: 20, color: 'bg-yellow-600', icon: <XCircle size={16} className="text-red-500" /> },
                { label: 'Check-in Time', val: 10, max: 15, color: 'bg-[#3A6E57]', icon: <Check size={16} className="text-[#3A6E57]" /> },
                { label: 'Post-pay velocity', val: 0, max: 15, color: 'bg-red-500', icon: <XCircle size={16} className="text-red-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-48 text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.val / item.max) * 100}%` }}></div>
                  </div>
                  <div className="w-16 text-right text-sm font-semibold text-gray-600">{item.val} / {item.max}</div>
                  <div className="w-6">{item.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-gray-900">Score History</h3>
              <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1.5 shadow-sm">
                <XCircle size={12} /> Face mismatch · Both attempts failed
              </span>
            </div>
            
            <div className="flex items-end h-48 gap-4 pb-8 border-b border-gray-100 relative mt-12">
              <div className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <span className="text-sm font-bold text-[#3A6E57] mb-2">71</span>
                <div className="w-full bg-[#E6F4F0] rounded-t-sm transition-all" style={{ height: '71%' }}></div>
                <span className="absolute -bottom-7 text-xs font-medium text-gray-500">Mar</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <span className="text-sm font-bold text-yellow-600 mb-2">41</span>
                <div className="w-full bg-[#FEF9C3] rounded-t-sm transition-all" style={{ height: '41%' }}></div>
                <span className="absolute -bottom-7 text-xs font-medium text-gray-500">Apr</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <span className="text-sm font-bold text-red-500 mb-2">28</span>
                <div className="w-full bg-[#FEE2E2] rounded-t-sm transition-all" style={{ height: '28%' }}></div>
                <span className="absolute -bottom-7 text-xs font-medium text-gray-500">May</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Employee Info</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                ['Employee ID', e.id],
                ['Account number', e.account],
                ['Phone', '0802 **** 2261'],
                ['May salary', '₦350,000'],
                ['Verified at', '15 May 2026 · 07:43 AM'],
                ['Payment status', <span key="s" className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Frozen</span>]
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between items-center p-6">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 text-yellow-800 p-5 rounded-xl text-sm border border-yellow-200 leading-relaxed shadow-sm font-medium">
            Payment is currently frozen. You must manually release or confirm freeze before 25 May.
          </div>

          <div className="space-y-3">
            <button className="w-full bg-[#3A6E57] hover:bg-[#2d5744] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
              Release Payment <Check size={18} />
            </button>
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
              Confirm Freeze <Snowflake size={18} />
            </button>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm">
              Resend SMS Invites <Bell size={16} />
            </button>
          </div>

          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
            <h4 className="font-semibold text-emerald-800 mb-2">Auditor Investigation Active</h4>
            <p className="text-sm text-emerald-700/80 leading-relaxed">
              Kemi Adeyemi (Senior Auditor) is reviewing this case. A case file export is pending. You will be notified when the investigation is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- UPLOAD ROSTER VIEW ----
function UploadRosterView() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="font-bold text-lg mb-6 text-gray-900">Upload Employee Roster</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-12 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer mb-6">
              <div className="w-14 h-14 bg-yellow-400 rounded-xl flex items-center justify-center mb-4 text-white shadow-sm">
                <FileUp size={28} />
              </div>
              <p className="font-bold text-gray-900 mb-1">Drop your CSV file here</p>
              <p className="text-sm text-gray-500">Or <span className="text-[#3A6E57] font-medium underline underline-offset-2">browse your files</span></p>
              <p className="text-xs text-gray-400 mt-4">Accepted format: .csv · Max size: 10MB</p>
            </div>
            
            <div className="text-center">
              <button className="text-[#3A6E57] font-semibold text-sm flex items-center justify-center gap-2 mx-auto hover:text-[#2d5744]">
                <Download size={16} /> Download template CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="font-bold text-lg mb-6 text-gray-900">Column Mapping — employees_may2026.csv</h3>
            <div className="space-y-4">
              {[
                { label: 'Employee Name', mapped: 'Column A: "Full Name"' },
                { label: 'Role/Job Title', mapped: 'Column B: "Position"' },
                { label: 'Account Number', mapped: 'Column C: "Bank Account"' },
                { label: 'Phone Number', mapped: 'Column D: "Phone"' }
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1/3 text-sm font-medium text-gray-700">{row.label}</div>
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
                    <span className="font-mono text-gray-600 text-xs">{row.mapped}</span>
                    <Check size={16} className="text-[#3A6E57]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h3 className="font-bold text-lg mb-6 text-gray-900">Validation Results</h3>
            <div className="space-y-3">
              <div className="bg-[#E6F4F0] text-[#3A6E57] p-4 rounded-xl text-sm font-semibold border border-[#3A6E57]/20 flex items-center gap-3 shadow-sm">
                <Check size={18} /> 56 rows validated successfully — ready to import
              </div>
              <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl text-sm font-semibold border border-yellow-100 flex items-center gap-3 shadow-sm">
                <AlertTriangle size={18} /> 2 rows have missing data and will be skipped
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">File Preview — First 3 Rows</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b border-gray-100 text-gray-500 bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider">NAME</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider">ROLE</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider">ACCOUNT</th>
                    <th className="py-4 px-6 font-semibold text-xs tracking-wider">PHONE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['C. Obi', 'Sr. Accountant', '012****7734', '0802****61'],
                    ['C. Obi', 'Budget Analyst', '012****7734', '0802****61'],
                    ['C. Obi', 'Finance Officer', '012****7734', '0802****61']
                  ].map((row, i) => (
                    <tr key={i} className="text-gray-600">
                      <td className="py-4 px-6">{row[0]}</td>
                      <td className="py-4 px-6">{row[1]}</td>
                      <td className="py-4 px-6 font-mono text-xs">{row[2]}</td>
                      <td className="py-4 px-6 font-mono text-xs">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Import Summary</h3>
            </div>
            <div className="p-8 text-center border-b border-gray-100">
              <div className="text-5xl font-bold text-[#3A6E57] mb-2 tracking-tight">56</div>
              <p className="text-sm text-gray-500 font-medium">employees ready to import</p>
            </div>
            <div className="divide-y divide-gray-100 p-6">
              {[
                ['File name', 'employees_may2026.csv'],
                ['Total rows', '58'],
                ['Valid rows', 'Valid rows'],
                ['Skipped rows', '2 - missing data']
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-3">
              <button className="w-full bg-[#3A6E57] hover:bg-[#2d5744] text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm">
                Import 56 Employees
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3.5 rounded-xl font-semibold transition-colors shadow-sm">
                Cancel
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">CSV Format Guide</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Required columns in order:</p>
                <div className="bg-white border border-gray-200 px-3 py-2.5 rounded-lg text-sm font-mono text-gray-800 shadow-sm">
                  Full Name, Position, Bank Account, Phone
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Account numbers and phone numbers are stored encrypted. Only the last 4 digits are displayed in the interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
