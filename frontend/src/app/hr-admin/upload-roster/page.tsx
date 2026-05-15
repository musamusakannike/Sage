"use client";
import Sidebar from "@/components/hr-admin/Sidebar";
import Topbar from "@/components/hr-admin/Topbar";
import { useState } from "react";
import { RiUploadCloud2Line, RiDownloadLine, RiCheckLine, RiAlertLine, RiFileLine } from "react-icons/ri";

const previewRows = [
  { name: "C. Obi", role: "Sr. Accountant", account: "012••••7734", phone: "0802••••61" },
  { name: "C. Obi", role: "Budget Analyst", account: "012••••7734", phone: "0802••••61" },
  { name: "C. Obi", role: "Finance Officer", account: "012••••7734", phone: "0802••••61" },
];

export default function UploadRosterPage() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(true); // show result state

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-[210px] flex-1 flex flex-col">
        <Topbar title="Upload Roster" />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-[1fr_300px] gap-5">
            {/* Main Upload Area */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-gray-800 font-semibold mb-5">Upload Employee Roster</h2>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); }}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-14 transition-colors cursor-pointer ${
                    dragging
                      ? "border-emerald-400 bg-emerald-50"
                      : uploaded
                      ? "border-emerald-300 bg-emerald-50/40"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                  }`}
                >
                  {uploaded ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
                        <RiFileLine className="text-emerald-600 text-2xl" />
                      </div>
                      <p className="text-gray-700 font-semibold text-sm">employees_may2026.csv</p>
                      <p className="text-gray-400 text-xs mt-1">58 rows · 2 skipped</p>
                      <button className="mt-3 text-xs text-emerald-600 hover:text-emerald-800 font-medium underline underline-offset-2">
                        Replace file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
                        <RiUploadCloud2Line className="text-amber-600 text-2xl" />
                      </div>
                      <p className="text-gray-700 font-medium text-sm">Drop your CSV file here</p>
                      <p className="text-emerald-600 text-xs font-medium mt-0.5">Or browse your files</p>
                      <p className="text-gray-400 text-xs mt-1">Accepted format: .csv · Max size: 10MB</p>
                    </>
                  )}
                </div>

                <button className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors">
                  <RiDownloadLine className="text-sm" /> Download template CSV
                </button>
              </div>

              {/* Column Mapping */}
              {uploaded && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-gray-800 font-semibold mb-4">Column Mapping — employees_may2026.csv</h3>
                  <div className="space-y-3">
                    {[
                      { field: "Employee Name", mapped: 'Column A: "Full Name"' },
                      { field: "Role/Job Title", mapped: 'Column B: "Position"' },
                      { field: "Account Number", mapped: 'Column C: "Bank Account"' },
                      { field: "Phone Number", mapped: 'Column D: "Phone"' },
                    ].map(({ field, mapped }) => (
                      <div key={field} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-sm">{field}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 text-sm font-medium">{mapped}</span>
                          <RiCheckLine className="text-emerald-500 text-base flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation */}
              {uploaded && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="text-gray-800 font-semibold mb-4">Validation Results</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <RiCheckLine className="text-emerald-600 text-base flex-shrink-0" />
                      <p className="text-emerald-700 text-sm font-semibold">56 rows validated successfully — ready to import</p>
                    </div>
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <RiAlertLine className="text-amber-600 text-base flex-shrink-0" />
                      <p className="text-amber-700 text-sm font-semibold">2 rows have missing data and will be skipped</p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Preview */}
              {uploaded && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-gray-800 font-semibold">File Preview — First 3 Rows</h3>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/60 border-b border-gray-100">
                        {["NAME", "ROLE", "ACCOUNT", "PHONE"].map((h) => (
                          <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="px-6 py-3 text-gray-700 text-sm font-medium">{row.name}</td>
                          <td className="px-6 py-3 text-gray-600 text-sm">{row.role}</td>
                          <td className="px-6 py-3 text-gray-500 text-sm font-mono">{row.account}</td>
                          <td className="px-6 py-3 text-gray-500 text-sm font-mono">{row.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              {/* Import Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-gray-800 font-semibold mb-4">Import Summary</h3>
                <div className="text-center py-4 border-b border-gray-100 mb-4">
                  <p className="text-5xl font-black text-[#0D2B1F]">56</p>
                  <p className="text-gray-400 text-xs mt-1">employees ready to import</p>
                </div>
                <dl className="space-y-2.5">
                  {[
                    { label: "File name", value: "employees_may2026.csv" },
                    { label: "Total rows", value: "58" },
                    { label: "Valid rows", value: "56", highlight: "text-emerald-600" },
                    { label: "Skipped rows", value: "2 – missing data", highlight: "text-amber-600" },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                      <dt className="text-gray-400 text-xs">{label}</dt>
                      <dd className={`text-xs font-semibold ${highlight || "text-gray-700"}`}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Action Buttons */}
              <button className="w-full bg-[#0D2B1F] hover:bg-emerald-900 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors shadow-sm">
                Import 56 Employees
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-600 text-sm font-semibold py-3.5 rounded-xl border border-gray-200 transition-colors">
                Cancel
              </button>

              {/* CSV Format Guide */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-gray-800 font-semibold text-sm mb-3">CSV Format Guide</h4>
                <p className="text-gray-400 text-xs mb-2">Required columns in order:</p>
                <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                  <p className="text-gray-600 text-xs font-mono font-medium">Full Name, Position, Bank Account, Phone</p>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Account numbers and phone numbers are stored encrypted. Only the last 4 digits are displayed in the interface.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
