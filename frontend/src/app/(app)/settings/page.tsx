'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Building2, ChevronRight } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24,
        borderRadius: 12,
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        border: 'none', cursor: 'pointer', padding: 0,
        position: 'relative',
        transition: 'background var(--transition-base)',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute', top: 2,
          width: 20, height: 20, borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: (v: boolean) => void;
  action?: string;
}

function SettingRow({ label, description, toggle, checked, onToggle, action }: SettingRowProps) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{label}</p>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>{description}</p>
        )}
      </div>
      {toggle && onToggle !== undefined && (
        <Toggle checked={!!checked} onChange={onToggle} />
      )}
      {action && (
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-primary)', fontSize: 13, fontWeight: 600,
            fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

function Section({ title, icon, children, delay = 0 }: SectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: '20px 24px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 'var(--radius-sm)',
          background: 'var(--color-primary-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ payroll: true, verification: true, alerts: false });
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: true });

  return (
    <div style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Manage your account and preferences
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Profile */}
        <Section title="Profile" icon={<User size={16} color="var(--color-primary)" />} delay={0.05}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <Avatar name="Amara" size={56} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Amara</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>amara@gov.ng</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Ministry of Finance · Admin</p>
            </div>
            <button
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
              }}
            >
              Edit profile
            </button>
          </div>
          <SettingRow label="Change password" description="Last changed 3 months ago" action="Update" />
          <SettingRow label="Email address" description="amara@gov.ng" action="Change" />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={<Bell size={16} color="var(--color-primary)" />} delay={0.1}>
          <SettingRow
            label="Payroll reminders"
            description="Get notified 3 days before payroll runs"
            toggle checked={notifs.payroll}
            onToggle={v => setNotifs(n => ({ ...n, payroll: v }))}
          />
          <SettingRow
            label="Verification alerts"
            description="Notify when employees complete verification"
            toggle checked={notifs.verification}
            onToggle={v => setNotifs(n => ({ ...n, verification: v }))}
          />
          <SettingRow
            label="Risk alerts"
            description="Immediate alerts for high-risk scores"
            toggle checked={notifs.alerts}
            onToggle={v => setNotifs(n => ({ ...n, alerts: v }))}
          />
        </Section>

        {/* Security */}
        <Section title="Security" icon={<Shield size={16} color="var(--color-primary)" />} delay={0.15}>
          <SettingRow
            label="Two-factor authentication"
            description="Add an extra layer of security"
            toggle checked={security.twoFactor}
            onToggle={v => setSecurity(s => ({ ...s, twoFactor: v }))}
          />
          <SettingRow
            label="Session timeout"
            description="Auto sign-out after 30 minutes of inactivity"
            toggle checked={security.sessionTimeout}
            onToggle={v => setSecurity(s => ({ ...s, sessionTimeout: v }))}
          />
          <SettingRow label="Active sessions" description="2 devices currently signed in" action="Manage" />
        </Section>

        {/* Organization */}
        <Section title="Organization" icon={<Building2 size={16} color="var(--color-primary)" />} delay={0.2}>
          <SettingRow label="Ministry name" description="Lagos State Government · Ministry of Finance" action="Edit" />
          <SettingRow label="Payroll cycle" description="Monthly — 25th of each month" action="Configure" />
          <SettingRow label="Team members" description="4 admins, 12 reviewers" action="Manage" />
        </Section>
      </div>
    </div>
  );
}
