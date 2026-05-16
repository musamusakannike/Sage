'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Leaf, ArrowLeft, Mail } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { decodeJwt, getApiErrorMessage } from '@/lib/utils';

type Flow = 'admin' | 'otp';
type OtpStep = 'email' | 'code';

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: '100%', height: 48,
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  padding: '0 16px', fontSize: 15,
  color: 'var(--color-text)',
  background: 'var(--color-surface)',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
  fontFamily: 'var(--font-sans)',
  boxSizing: 'border-box' as const,
};

// ─── Admin flow ───────────────────────────────────────────────────────────────

function AdminLoginForm() {
  const router = useRouter();
  const setToken = useAuthStore((s: any) => s.setToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res.data.data.access_token;
      const user = decodeJwt(token);
      if (!user) throw new Error('Invalid token received.');
      setToken(token, user);
      router.push(user.role === 'auditor' ? '/auditor/dashboard' : '/hr-admin/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {error && (
        <div style={{ background: 'var(--color-frozen-bg)', border: '1px solid var(--color-frozen-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 14, color: 'var(--color-frozen-text)', fontWeight: 500 }}>
          {error}
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Email address</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
          placeholder="amara@gov.ng" required disabled={loading}
          style={{ ...inputBase, borderColor: focused === 'email' ? 'var(--color-primary)' : 'var(--color-border)' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Password</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
            placeholder="••••••••••••" required disabled={loading}
            style={{ ...inputBase, padding: '0 48px 0 16px', borderColor: focused === 'password' ? 'var(--color-primary)' : 'var(--color-border)' }}
          />
          <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 0, display: 'flex' }}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <motion.button
        type="submit" whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.98 }} disabled={loading}
        style={{ height: 48, borderRadius: 'var(--radius-md)', background: loading ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'background var(--transition-fast)' }}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </motion.button>
    </form>
  );
}

// ─── Employee / Auditor OTP flow ──────────────────────────────────────────────

function OtpLoginForm() {
  const router = useRouter();
  const setToken = useAuthStore((s: any) => s.setToken);

  const [step, setStep] = useState<OtpStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.requestOtp({ email });
      setStep('code');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.verifyOtp({ email, code });
      const token = res.data.data.access_token;
      const user = decodeJwt(token);
      if (!user) throw new Error('Invalid token received.');
      setToken(token, user);
      router.push(user.role === 'auditor' ? '/auditor/dashboard' : '/hr-admin/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'email' ? (
        <motion.form
          key="email-step"
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
          onSubmit={handleRequestOtp}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {error && (
            <div style={{ background: 'var(--color-frozen-bg)', border: '1px solid var(--color-frozen-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 14, color: 'var(--color-frozen-text)', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>Your email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
              placeholder="you@gov.ng" required disabled={loading}
              style={{ ...inputBase, borderColor: focused === 'email' ? 'var(--color-primary)' : 'var(--color-border)' }}
            />
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6 }}>
              We&apos;ll send a 6-digit confirmation code to this address.
            </p>
          </div>

          <motion.button
            type="submit" whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.98 }} disabled={loading}
            style={{ height: 48, borderRadius: 'var(--radius-md)', background: loading ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Sending code…' : 'Send confirmation code'}
          </motion.button>
        </motion.form>
      ) : (
        <motion.form
          key="code-step"
          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
          onSubmit={handleVerifyOtp}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Sent-to banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
            <Mail size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Code sent to {email}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Check your inbox — it expires in 10 minutes.</p>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-frozen-bg)', border: '1px solid var(--color-frozen-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 14, color: 'var(--color-frozen-text)', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>6-digit confirmation code</label>
            <input
              type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onFocus={() => setFocused('code')} onBlur={() => setFocused(null)}
              placeholder="000000" required disabled={loading} maxLength={6} inputMode="numeric"
              style={{ ...inputBase, letterSpacing: '0.3em', fontSize: 22, fontWeight: 700, textAlign: 'center', borderColor: focused === 'code' ? 'var(--color-primary)' : 'var(--color-border)' }}
            />
          </div>

          <motion.button
            type="submit" whileHover={loading ? {} : { scale: 1.01 }} whileTap={loading ? {} : { scale: 0.98 }} disabled={loading || code.length < 6}
            style={{ height: 48, borderRadius: 'var(--radius-md)', background: (loading || code.length < 6) ? 'var(--color-border)' : 'var(--color-primary)', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: (loading || code.length < 6) ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            {loading ? 'Verifying…' : 'Verify & sign in'}
          </motion.button>

          <button
            type="button" onClick={() => { setStep('email'); setCode(''); setError(null); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-sans)' }}
          >
            <ArrowLeft size={14} /> Back — use a different email
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [flow, setFlow] = useState<Flow>('admin');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ flex: 1, background: 'var(--color-sidebar)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}
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
            "Know who&apos;s real<br />before you pay."
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

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}
        style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 48px', background: 'var(--color-surface)' }}
      >
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="flex lg:hidden">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>{APP_NAME}</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6, letterSpacing: '-0.02em' }}>Welcome back</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 28 }}>{APP_TAGLINE}</p>

        {/* Flow switcher */}
        <div style={{ display: 'flex', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 28, gap: 4 }}>
          {([['admin', 'HR Admin'], ['otp', 'Employee / Auditor']] as [Flow, string][]).map(([f, label]) => (
            <button
              key={f} onClick={() => setFlow(f)}
              style={{
                flex: 1, height: 38, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)', transition: 'all 0.15s',
                background: flow === f ? 'var(--color-surface)' : 'transparent',
                color: flow === f ? 'var(--color-text)' : 'var(--color-text-secondary)',
                boxShadow: flow === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={flow}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {flow === 'admin' ? <AdminLoginForm /> : <OtpLoginForm />}
          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 24, lineHeight: 1.5 }}>
          {flow === 'admin'
            ? <>Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link></>
            : 'Your account is created by your HR admin — contact them if you need access.'
          }
        </p>
      </motion.div>
    </div>
  );
}
