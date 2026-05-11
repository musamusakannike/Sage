'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Snowflake, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import PayrollCard from '@/components/PayrollCard';
import EmployeeRow from '@/components/EmployeeRow';
import { EMPLOYEES, ORG_NAME } from '@/lib/constants';

const PREVIEW_EMPLOYEES = EMPLOYEES.slice(0, 6);

export default function DashboardPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Hello, Amara 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          {ORG_NAME}
        </p>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <StatCard value="47" label="Verified"  Icon={Check}     color="var(--color-verified)" delay={0.05} />
        <StatCard value="8"  label="Pending"   Icon={Clock}     color="var(--color-pending)"  delay={0.10} />
        <StatCard value="3"  label="Frozen"    Icon={Snowflake} color="var(--color-frozen)"   delay={0.15} />
      </div>

      {/* Payroll card */}
      <PayrollCard />

      {/* Employees section */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>
            Employees
          </h2>
          <Link
            href="/employees"
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 14, fontWeight: 500, color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
          >
            See all <ChevronRight size={15} />
          </Link>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            overflow: 'hidden',
            padding: '0 16px',
          }}
        >
          {PREVIEW_EMPLOYEES.map((emp, i) => (
            <EmployeeRow key={emp.id} {...emp} index={i} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}
