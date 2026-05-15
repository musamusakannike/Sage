'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { decodeJwt, getApiErrorMessage } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res.data.data.access_token;
      const user = decodeJwt(token);
      if (!user) throw new Error('Invalid token received.');
      setToken(token, user);
      router.push('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left panel — decorative */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          flex: 1,
          background: 'var(--color-sidebar)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden lg:flex"
      >
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(58,110,87,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 80, right: 40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(58,110,87,0.07)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{APP_NAME}</span>
        </div>

        <div>
          <p style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 16 }}>
            "Know who's real<br />before you pay."
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, lineHeight: 1.6 }}>
            Payroll verification for government ministries.<br />
            Prevent ghost workers. Protect public funds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
          {[{ value: '47', label: 'Verified this cycle' }, { value: '₦0', label: 'Fraudulent payouts' }, { value: '99%', label: 'Accuracy rate' }].map(stat => (
            <div key={stat.label}>
              <p style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{stat.value}</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 12, margin: '2px 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px', background: 'var(--color-surface)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="flex lg:hidden">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>{APP_NAME}</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 36 }}>{APP_TAGLINE}</p>

        {error && (
          <div style={{ background: 'var(--color-frozen-bg)', border: '1px solid var(--color-frozen-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20, fontSize: 14, color: 'var(--color-frozen-text)', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Email address</label>
            <input
              type="email"
              placeholder="amara@gov.ng"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              disabled={loading}
              style={{ width: '100%', height: 48, border: `1.5px solid ${focusedField === 'email' ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', padding: '0 16px', fontSize: 15, color: 'var(--color-text)', background: 'var(--color-surface)', outline: 'none', transition: 'border-color var(--transition-fast)', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                disabled={loading}
                style={{ width: '100%', height: 48, border: `1.5px solid ${focusedField === 'password' ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', padding: '0 48px 0 16px', fontSize: 15, color: 'var(--color-text)', background: 'var(--color-surface)', outline: 'none', transition: 'border-color var(--transition-fast)', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={loading ? {} : { scale: 1.01 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            disabled={loading}
            style={{ height: 48, borderRadius: 'var(--radius-md)', background: loading ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'background var(--transition-fast)' }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--color-primary)'; }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            No account needed for employees — they verify via SMS link
          </p>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 28 }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
