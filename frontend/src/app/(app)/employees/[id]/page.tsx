'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';
import { EmployeeStatus } from '@/lib/constants';

interface ScoreRowProps {
  label: string;
  score: number;
  total: number;
  color: string;
  status?: 'success' | 'fail';
}

function ScoreRow({ label, score, total, color, status }: ScoreRowProps) {
  const pct = (score / total) * 100;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', minWidth: 160 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color, width: 52, textAlign: 'right' }}>
          {score} / {total}
        </span>
        <div
          style={{
            width: 80, height: 6,
            background: 'var(--color-border-subtle)',
            borderRadius: 3, overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ height: '100%', background: color, borderRadius: 3 }}
          />
        </div>
        {status === 'success'
          ? <Check size={15} color="#3A6E57" strokeWidth={2.5} />
          : <X size={15} color="#D43A3A" strokeWidth={2.5} />
        }
      </div>
    </div>
  );
}

const HISTORY = [
  { month: 'May 2026', score: 28, status: 'Frozen'   as EmployeeStatus },
  { month: 'Apr 2026', score: 52, status: 'Review'   as EmployeeStatus },
  { month: 'Mar 2026', score: 28, status: 'Approved' as EmployeeStatus },
];

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <div style={{ padding: '32px 40px', maxWidth: 760, margin: '0 auto' }}>
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500,
          fontFamily: 'var(--font-sans)', padding: '0 0 24px',
          transition: 'color var(--transition-fast)',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <ArrowLeft size={16} />
        Back to employees
      </motion.button>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <Avatar name="Chukwuemeka Obi" image="https://i.pravatar.cc/150?u=1" size={80} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            Chukwuemeka Obi
          </h1>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>
            Senior Accountant · ID #LAG-00214
          </p>
          <StatusBadge status="Frozen" size="md" />
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
            Identity
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Account No.</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>**** **** 7734</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Phone number</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>080****2261</span>
          </div>
        </motion.div>

        {/* DNA Score summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
            June 2026 — DNA Score
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              style={{ fontSize: 56, fontWeight: 700, color: 'var(--color-risk-high)', lineHeight: 1, letterSpacing: '-0.03em' }}
            >
              28
            </motion.span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-risk-high)', margin: '0 0 2px' }}>
                HIGH RISK
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 2px' }}>
                Verified 15 May 2026, 07:43
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>
                Lagos, Nigeria
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Score breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '24px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
          Score Breakdown
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>
          Individual verification metrics
        </p>
        <ScoreRow label="Liveness Match"       score={8}  total={30} color="var(--color-risk-high)"   />
        <ScoreRow label="Geolocation Cluster"  score={0}  total={20} color="var(--color-risk-high)"   />
        <ScoreRow label="Device Fingerprint"   score={10} total={20} color="var(--color-risk-medium)" />
        <ScoreRow label="Check-in Time"        score={10} total={15} color="var(--color-risk-low)"    status="success" />
        <div style={{ paddingTop: 12 }}>
          <ScoreRow label="Post-pay Velocity"  score={0}  total={15} color="var(--color-risk-high)"   />
        </div>
      </motion.div>

      {/* Verification history */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '24px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
          Verification History
        </h2>
        {HISTORY.map((h, i) => (
          <div
            key={h.month}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: i < HISTORY.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)' }}>{h.month}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  background: h.score < 40 ? 'var(--color-frozen-bg)' : 'var(--color-clear-bg)',
                  color: h.score < 40 ? 'var(--color-frozen-text)' : 'var(--color-clear-text)',
                  fontSize: 12, fontWeight: 600,
                  padding: '2px 8px', borderRadius: 10,
                }}
              >
                {h.score}
              </span>
              <StatusBadge status={h.status} size="sm" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        style={{ display: 'flex', gap: 12 }}
      >
        {[
          { label: 'Hold Payment',   bg: 'var(--color-hold-bg)',   text: 'var(--color-hold-text)'   },
          { label: 'Freeze Payment', bg: 'var(--color-freeze-bg)', text: 'var(--color-freeze-text)' },
        ].map(btn => (
          <motion.button
            key={btn.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, height: 48,
              borderRadius: 'var(--radius-md)',
              background: btn.bg, color: btn.text,
              border: 'none', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            {btn.label}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
