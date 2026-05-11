'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--color-bg)',
      }}
    >
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
        {/* Background circles */}
        <div style={{
          position: 'absolute', bottom: -80, right: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(58,110,87,0.12)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 80, right: 40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(58,110,87,0.07)', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={20} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {APP_NAME}
          </span>
        </div>

        {/* Quote */}
        <div>
          <p style={{
            color: '#fff', fontSize: 32, fontWeight: 700,
            lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            "Know who's real<br />before you pay."
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, lineHeight: 1.6 }}>
            Payroll verification for government ministries.<br />
            Prevent ghost workers. Protect public funds.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { value: '47', label: 'Verified this cycle' },
            { value: '₦0', label: 'Fraudulent payouts' },
            { value: '99%', label: 'Accuracy rate' },
          ].map(stat => (
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
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 48px',
          background: 'var(--color-surface)',
        }}
      >
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}
          className="flex lg:hidden"
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>{APP_NAME}</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 36 }}>
          {APP_TAGLINE}
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="amara@gov.ng"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                height: 48,
                border: `1.5px solid ${focusedField === 'email' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0 16px',
                fontSize: 15,
                color: 'var(--color-text)',
                background: 'var(--color-surface)',
                outline: 'none',
                transition: 'border-color var(--transition-fast)',
                fontFamily: 'var(--font-sans)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%',
                  height: 48,
                  border: `1.5px solid ${focusedField === 'password' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0 48px 0 16px',
                  fontSize: 15,
                  color: 'var(--color-text)',
                  background: 'var(--color-surface)',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-secondary)', padding: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div style={{ marginTop: -8 }}>
            <button
              type="button"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-primary)', fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-sans)', padding: 0,
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
          >
            Sign in
          </motion.button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            No account needed for employees — they verify via SMS link
          </p>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        {/* Google */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-border-subtle)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </motion.button>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 28 }}>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
