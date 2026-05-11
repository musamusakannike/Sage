'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, AlertCircle, CheckCircle2, Upload } from 'lucide-react';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'preview' | 'success';

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [step, setStep] = useState<Step>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => setStep('upload'), 300);
  };

  const handleFileSelect = () => {
    setStep('preview');
  };

  const handleImport = () => {
    setStep('success');
    setTimeout(handleClose, 2200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setStep('preview');
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 50,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: 520,
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              zIndex: 51,
              overflow: 'hidden',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px 16px',
                borderBottom: '1px solid var(--color-border-subtle)',
              }}
            >
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  Upload Employee Roster
                </h2>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 3 }}>
                  CSV format · Columns: Name, Role, Account Number, Phone
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--color-surface-raised)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-border)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 24px 24px', overflowY: 'auto', flex: 1 }}>
              <AnimatePresence mode="wait">
                {step === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 0',
                      gap: 12,
                    }}
                  >
                    <div style={{ color: 'var(--color-primary)' }}>
                      <CheckCircle2 size={72} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                      Import Successful
                    </h3>
                    <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                      56 employees have been added to your roster.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Drop zone */}
                    <div
                      onClick={() => inputRef.current?.click()}
                      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      style={{
                        border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '36px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        background: isDragging ? 'var(--color-primary-dim)' : 'var(--color-surface-raised)',
                        transition: 'all var(--transition-fast)',
                        marginBottom: 16,
                      }}
                    >
                      <input
                        ref={inputRef}
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                      <div style={{ fontSize: 36 }}>📂</div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                        {isDragging ? 'Drop your CSV here' : 'Choose a CSV file'}
                      </p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
                        Drag & drop or click to browse
                      </p>
                    </div>

                    {/* Download template */}
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-primary)',
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans)',
                        margin: '0 auto 20px',
                        padding: '4px 0',
                      }}
                    >
                      <Download size={15} />
                      Download template CSV
                    </button>

                    {/* Preview */}
                    <AnimatePresence>
                      {step === 'preview' && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          style={{
                            background: 'var(--color-surface-raised)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 16,
                            marginBottom: 20,
                          }}
                        >
                          {/* File header */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                background: 'var(--color-info-bg)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FileText size={18} color="var(--color-info-text)" />
                            </div>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                                employees_may2026.csv
                              </p>
                              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>
                                58 rows found
                              </p>
                            </div>
                          </div>

                          {/* Table */}
                          <div
                            style={{
                              background: 'var(--color-surface)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-border)',
                              overflow: 'hidden',
                              marginBottom: 12,
                            }}
                          >
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1.4fr 1.4fr',
                                background: '#E2E8F0',
                                padding: '8px 12px',
                              }}
                            >
                              {['NAME', 'ROLE', 'ACCOUNT'].map(col => (
                                <span key={col} style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                                  {col}
                                </span>
                              ))}
                            </div>
                            {[
                              ['C. Obi', 'Sr. Accountant', '012••••7734'],
                              ['C. Obi', 'Budget Analyst', '012••••7734'],
                              ['C. Obi', 'Finance Officer', '012••••7734'],
                            ].map((row, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '1fr 1.4fr 1.4fr',
                                  padding: '10px 12px',
                                  borderBottom: i < 2 ? '1px solid var(--color-border-subtle)' : 'none',
                                }}
                              >
                                {row.map((cell, j) => (
                                  <span key={j} style={{ fontSize: 13, color: 'var(--color-text)' }}>
                                    {cell}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Warning */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              background: 'var(--color-warning-bg)',
                              padding: '10px 12px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            <AlertCircle size={15} color="var(--color-warning-border)" />
                            <span style={{ fontSize: 13, color: 'var(--color-warning-text)', fontWeight: 500 }}>
                              2 rows have missing data and will be skipped
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button
                        onClick={handleImport}
                        style={{
                          height: 48,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-primary)',
                          color: '#fff',
                          border: 'none',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          transition: 'background var(--transition-fast)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
                      >
                        <Upload size={16} />
                        Import 56 Employees
                      </button>
                      <button
                        onClick={handleClose}
                        style={{
                          height: 48,
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-clear-bg)',
                          color: 'var(--color-primary)',
                          border: 'none',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#d4ece4')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-clear-bg)')}
                      >
                        Cancel
                      </button>
                    </div>
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
