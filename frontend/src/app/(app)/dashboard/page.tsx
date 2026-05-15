'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Snowflake, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import PayrollCard from '@/components/PayrollCard';
import EmployeeRow from '@/components/EmployeeRow';
import { ORG_NAME } from '@/lib/constants';
import { useEmployees } from '@/lib/hooks/useEmployees';
import { usePayroll, getDaysUntilDisbursement, getDisbursementDate } from '@/lib/hooks/usePayroll';
import { useProfile } from '@/lib/hooks/useProfile';

export default function DashboardPage() {
  const { profile } = useProfile();
  const { employees, loading: empLoading } = useEmployees({ limit: 6 });
  const { schedule, loading: payLoading } = usePayroll();

  const verified = employees.filter(e => e.status === 'CLEAR').length;
  const pending  = employees.filter(e => e.status === 'PENDING').length;
  const frozen   = employees.filter(e => e.status === 'FROZEN').length;

  const daysUntil = schedule ? getDaysUntilDisbursement(schedule.disbursementDay) : 0;
  const disbursementDate = schedule ? getDisbursementDate(schedule.disbursementDay) : '—';

  const greeting = profile?.name?.split(' ')[0] ?? 'there';

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Hello, {greeting} 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {profile?.orgName ?? ORG_NAME}
        </p>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard value={empLoading ? '…' : String(verified)} label="Verified"  Icon={Check}     color="var(--color-verified)" delay={0.05} />
        <StatCard value={empLoading ? '…' : String(pending)}  label="Pending"   Icon={Clock}     color="var(--color-pending)"  delay={0.10} />
        <StatCard value={empLoading ? '…' : String(frozen)}   label="Frozen"    Icon={Snowflake} color="var(--color-frozen)"   delay={0.15} />
      </div>

      {/* Payroll card */}
      {payLoading ? (
        <div style={{ height: 120, background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-xl)', marginBottom: 28 }} />
      ) : (
        <PayrollCard daysUntil={daysUntil} disbursementDate={disbursementDate} isScheduled={!!schedule} />
      )}

      {/* Employees section */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>Employees</h2>
          <Link
            href="/employees"
            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500, color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            See all <ChevronRight size={15} />
          </Link>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden', padding: '0 16px' }}>
          {empLoading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>Loading…</div>
          ) : employees.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 14 }}>No employees yet. Upload your roster.</div>
          ) : (
            employees.map((emp, i) => (
              <EmployeeRow
                key={emp._id}
                id={emp._id}
                name={emp.name}
                role={emp.roleTitle}
                status={emp.status === 'CLEAR' ? 'Clear' : emp.status === 'REVIEW' ? 'Review' : emp.status === 'FROZEN' ? 'Frozen' : emp.status === 'PENDING' ? 'Pending' : 'Frozen'}
                badgeCount={emp.dnaScore ?? 0}
                index={i}
                variant="compact"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
