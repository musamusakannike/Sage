'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import Avatar from '@/components/Avatar';
import StatusBadge from '@/components/StatusBadge';
import { useEmployee } from '@/lib/hooks/useEmployees';
import type { EmployeeStatus } from '@/lib/constants';

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', minWidth: 160 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color, width: 52, textAlign: 'right' }}>{score} / {total}</span>
        <div style={{ width: 80, height: 6, background: 'var(--color-border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ height: '100%', background: color, borderRadius: 3 }}
          />
        </div>
        {status === 'success' ? <Check size={15} color="#3A6E57" strokeWidth={2.5} /> : <X size={15} color="#D43A3A" strokeWidth={2.5} />}
      </div>
    </div>
  );
}

function serverStatusToDisplay(status: string): EmployeeStatus {
  const map: Record<string, EmployeeStatus> = {
    CLEAR: 'Clear', REVIEW: 'Review', FROZEN: 'Frozen', PENDING: 'Pending', FLAGGED: 'Frozen',
  };
  return map[status] ?? 'Pending';
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { employee, loading, error, hold, freeze } = useEmployee(id);

  if (loading) {
    return (
      <div style={{ padding: '32px 40px', textAlign: 'center', color: 'var(--color-text-secondary)', paddingTop: 80 }}>
        Loading employee…
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div style={{ padding: '32px 40px', textAlign: 'center', color: 'var(--color-frozen-text)', paddingTop: 80 }}>
        {error ?? 'Employee not found.'}
      </div>
    );
  }

  const displayStatus = serverStatusToDisplay(employee.status);
  const dnaScore = employee.dnaScore ?? 0;
  const riskColor = dnaScore < 40 ? 'var(--color-risk-high)' : dnaScore < 70 ? 'var(--color-risk-medium)' : 'var(--color-risk-low)';
  const riskLabel = dnaScore < 40 ? 'HIGH RISK' : dnaScore < 70 ? 'MEDIUM RISK' : 'LOW RISK';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 760, margin: '0 auto' }}>
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-sans)', padding: '0 0 24px', transition: 'color var(--transition-fast)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
      >
        <ArrowLeft size={16} /> Back to employees
      </motion.button>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)', padding: '32px', display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, boxShadow: 'var(--shadow-card)' }}
      >
        <Avatar name={employee.name} size={80} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{employee.name}</h1>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>{employee.roleTitle}</p>
          <StatusBadge status={displayStatus} size="md" />
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Identity */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>Identity</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--color-border-subtle)' }}>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Account No.</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
              {'*'.repeat(Math.max(0, employee.accountNumber.length - 4)) + employee.accountNumber.slice(-4)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Phone number</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
              {employee.phone.slice(0, 3) + '****' + employee.phone.slice(-4)}
            </span>
          </div>
        </motion.div>

        {/* DNA Score */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>DNA Score</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300 }} style={{ fontSize: 56, fontWeight: 700, color: riskColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {dnaScore}
            </motion.span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: riskColor, margin: '0 0 2px' }}>{riskLabel}</p>
              {employee.lastVerifiedAt && (
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>
                  Verified {new Date(employee.lastVerifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Score breakdown (placeholder weights — real breakdown comes from verification session) */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', padding: '24px', marginBottom: 24, boxShadow: 'var(--shadow-card)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>Score Breakdown</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '0 0 16px' }}>Estimated signal distribution based on total score</p>
        {[
          { label: 'Liveness Match',       weight: 30 },
          { label: 'Geolocation Cluster',  weight: 20 },
          { label: 'Device Fingerprint',   weight: 20 },
          { label: 'Check-in Time',        weight: 15 },
          { label: 'Post-pay Velocity',    weight: 15 },
        ].map(({ label, weight }) => {
          const portion = Math.round((dnaScore / 100) * weight);
          const passed = portion >= weight * 0.5;
          return (
            <ScoreRow key={label} label={label} score={portion} total={weight} color={riskColor} status={passed ? 'success' : 'fail'} />
          );
        })}
      </motion.div>

      {/* Action buttons */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: 'flex', gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={hold}
          style={{ flex: 1, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-hold-bg)', color: 'var(--color-hold-text)', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
        >
          Hold Payment
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={freeze}
          style={{ flex: 1, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-freeze-bg)', color: 'var(--color-freeze-text)', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
        >
          Freeze Payment
        </motion.button>
      </motion.div>
    </div>
  );
}
