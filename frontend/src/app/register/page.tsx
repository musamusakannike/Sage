'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { authApi } from '@/lib/api/auth.api';
import { getApiErrorMessage } from '@/lib/utils';
import type { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', orgName: '', email: '', password: '', role: 'hr_admin' as UserRole });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.register(form);
      router.push('/login');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%', height: 48,
    border: `1.5px solid ${focusedField === field ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '0 16px', fontSize: 15,
    color: 'var(--color-text)', background: 'var(--color-surface)',
    outline: 'none', transition: 'border-color var(--transition-fast)',
    fontFamily: 'var(--font-sans)', boxSizing: 'border-box' as const,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: '40px 40px', boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--color-border-subtle)' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Leaf size={24} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>Get started with {APP_NAME}</h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 6, textAlign: 'center' }}>{APP_TAGLINE}</p>
        </div>

        {error && (
          <div style={{ background: 'var(--color-frozen-bg)', border: '1px solid var(--color-frozen-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--color-frozen-text)', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Full name */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 7 }}>Full name</label>
            <input type="text" placeholder="Amara Eze" value={form.name} onChange={set('name')} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} required disabled={loading} style={inputStyle('name')} />
          </div>

          {/* Organisation name */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 7 }}>Organisation name</label>
            <input type="text" placeholder="Ministry of Finance" value={form.orgName} onChange={set('orgName')} onFocus={() => setFocusedField('orgName')} onBlur={() => setFocusedField(null)} required disabled={loading} style={inputStyle('orgName')} />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 7 }}>Email address</label>
            <input type="email" placeholder="amara@gov.ng" value={form.email} onChange={set('email')} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} required disabled={loading} style={inputStyle('email')} />
          </div>

          {/* Role */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 7 }}>Role</label>
            <select value={form.role} onChange={set('role')} disabled={loading} style={{ ...inputStyle('role'), paddingRight: 12 }}>
              <option value="hr_admin">HR Admin</option>
              <option value="auditor">Auditor</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={form.password}
                onChange={set('password')}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                minLength={8}
                disabled={loading}
                style={{ ...inputStyle('password'), padding: '0 48px 0 16px' }}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>Must be at least 8 characters long</p>
          </div>

          <motion.button
            type="submit"
            whileHover={loading ? {} : { scale: 1.01 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            disabled={loading}
            style={{ height: 48, borderRadius: 'var(--radius-md)', background: loading ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', marginTop: 4 }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 24 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
