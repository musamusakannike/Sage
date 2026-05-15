'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { employeesApi } from '@/lib/api/employees.api';
import { getApiErrorMessage } from '@/lib/utils';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'upload' | 'preview' | 'uploading' | 'success' | 'error';

export default function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; warnings: string[] } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('upload');
      setSelectedFile(null);
      setImportResult(null);
      setErrorMsg(null);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStep('preview');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStep('preview');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setStep('uploading');
    setErrorMsg(null);
    try {
      const res = await employeesApi.importCsv(selectedFile);
      setImportResult(res.data.data);
      setStep('success');
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2200);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err));
      setStep('error');
    }
  };

  const handleDownloadTemplate = () => {
    const csv = 'name,roleTitle,accountNumber,phone,email\nAmara Eze,HR Manager,0123456789,08012345678,amara@gov.ng\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 50 }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 520, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', zIndex: 51, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Upload Employee Roster</h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>CSV format · Columns: Name, Role, Account Number, Phone</p>
              </div>
              <button onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--color-surface-raised)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
              <AnimatePresence mode="wait">
                {(step === 'success') && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 12 }}>
                    <div style={{ color: 'var(--color-primary)' }}><CheckCircle2 size={72} strokeWidth={1.5} /></div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Import Successful</h3>
                    <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                      {importResult?.imported ?? 0} employees imported
                      {importResult?.skipped ? `, ${importResult.skipped} skipped` : ''}.
                    </p>
                  </motion.div>
                )}

                {step === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: 'var(--color-frozen-bg)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: 14, color: 'var(--color-frozen-text)' }}>
                      {errorMsg}
                    </div>
                    <button onClick={() => setStep('upload')} style={{ height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                      Try again
                    </button>
                  </motion.div>
                )}

                {(step === 'upload' || step === 'preview' || step === 'uploading') && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Drop zone */}
                    <div
                      onClick={() => step !== 'uploading' && inputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={step !== 'uploading' ? handleDrop : undefined}
                      style={{ border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: step !== 'uploading' ? 'pointer' : 'default', background: isDragging ? 'var(--color-primary-dim)' : 'var(--color-surface-raised)', transition: 'all var(--transition-fast)', marginBottom: 16 }}
                    >
                      <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileSelect} />
                      <div style={{ fontSize: 36 }}>📂</div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                        {selectedFile ? selectedFile.name : isDragging ? 'Drop your CSV here' : 'Choose a CSV file'}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>Drag & drop or click to browse</p>
                    </div>

                    {/* Download template */}
                    <button onClick={handleDownloadTemplate} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-sans)', margin: '0 auto 20px', padding: '4px 0' }}>
                      <Download size={15} /> Download template CSV
                    </button>

                    {/* Preview */}
                    <AnimatePresence>
                      {(step === 'preview' || step === 'uploading') && selectedFile && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, background: 'var(--color-info-bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={18} color="var(--color-info-text)" />
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{selectedFile.name}</p>
                              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button
                        onClick={handleImport}
                        disabled={!selectedFile || step === 'uploading'}
                        style={{ height: 48, borderRadius: 'var(--radius-md)', background: !selectedFile || step === 'uploading' ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: !selectedFile || step === 'uploading' ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        onMouseEnter={e => { if (selectedFile && step !== 'uploading') e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
                        onMouseLeave={e => { if (selectedFile && step !== 'uploading') e.currentTarget.style.background = 'var(--color-primary)'; }}
                      >
                        <Upload size={16} />
                        {step === 'uploading' ? 'Importing…' : selectedFile ? 'Import Employees' : 'Select a CSV first'}
                      </button>
                      <button onClick={handleClose} style={{ height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-clear-bg)', color: 'var(--color-primary)', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                        Cancel
                      </button>
                    </div>

                    {step === 'uploading' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'var(--color-text-secondary)', fontSize: 13 }}>
                        <AlertCircle size={15} />
                        Uploading and processing your file…
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
