'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import { EmployeeStatus } from '@/lib/constants';

interface EmployeeRowProps {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  badgeCount: number;
  image?: string;
  index?: number;
  variant?: 'row' | 'compact';
}

export default function EmployeeRow({
  id,
  name,
  role,
  status,
  badgeCount,
  image,
  index = 0,
  variant = 'row',
}: EmployeeRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <Link
        href={`/employees/${id}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="group"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: variant === 'compact' ? '10px 0' : '12px 16px',
            borderBottom: '1px solid var(--color-border-subtle)',
            borderRadius: variant === 'row' ? 'var(--radius-md)' : 0,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-raised)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={name} image={image} size={40} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                {name}
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                {role}
              </p>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: 'var(--color-badge-bg)',
                color: 'var(--color-badge-text)',
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: 10,
              }}
            >
              {badgeCount}
            </span>
            <StatusBadge status={status} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
