'use client';

import { motion } from 'framer-motion';

interface PayrollCardProps {
  daysUntil: number;
  disbursementDate: string;
  isScheduled?: boolean;
}

export default function PayrollCard({ daysUntil, disbursementDate, isScheduled = true }: PayrollCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      style={{
        background: 'var(--color-dark-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(58,110,87,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 60, bottom: -60, width: 120, height: 120, borderRadius: '50%', background: 'rgba(58,110,87,0.07)', pointerEvents: 'none' }} />

      <div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Next payroll in</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            style={{ color: '#fff', fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}
          >
            {daysUntil}
          </motion.span>
          <span style={{ color: '#fff', fontSize: 20, fontWeight: 500 }}>days</span>
        </div>
      </div>

      <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{disbursementDate}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
          <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: isScheduled ? 'var(--color-success)' : 'var(--color-pending)', display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500 }}>
            {isScheduled ? 'Scheduled' : 'Not scheduled'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
