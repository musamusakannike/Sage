'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  Icon: LucideIcon;
  color: string;
  delay?: number;
}

export default function StatCard({ value, label, Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      style={{
        background: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 20px 16px',
        minWidth: 120,
        cursor: 'default',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <p
        style={{
          fontSize: 32,
          fontWeight: 700,
          color,
          lineHeight: 1,
          marginBottom: 10,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={13} color="var(--color-text-secondary)" strokeWidth={2} />
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
