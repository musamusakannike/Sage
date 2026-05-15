'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { usePayroll } from '@/lib/hooks/usePayroll';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function CalendarGrid({ disbursementDay }: { disbursementDay: number }) {
  const now = new Date();
  const today = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '8px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          const isToday = day === today;
          const isDisbursement = day === disbursementDay;
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', borderRadius: 'var(--radius-sm)',
                background: isToday ? 'var(--color-primary)' : isDisbursement ? 'var(--color-clear-bg)' : 'transparent',
                cursor: day ? 'pointer' : 'default',
                transition: 'background var(--transition-fast)', padding: 4,
              }}
            >
              {day && (
                <>
                  <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : 'var(--color-text)' }}>{day}</span>
                  {isDisbursement && !isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', marginTop: 2 }} />}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { schedule, loading, error } = usePayroll();

  const now = new Date();
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const disbursementDay = schedule?.disbursementDay ?? 25;

  const disbursementDate = (() => {
    const year = now.getFullYear();
    const month = now.getMonth();
    let target = new Date(year, month, disbursementDay);
    if (target <= now) target = new Date(year, month + 1, disbursementDay);
    return target.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const events = [
    { label: 'Payroll Run',           color: 'var(--color-primary)',      bg: 'var(--color-clear-bg)',   date: disbursementDate },
    { label: 'Verification Deadline', color: 'var(--color-pending)',      bg: 'var(--color-review-bg)',  date: `${disbursementDay - (schedule?.smsHoursBefore ?? 24) / 24} days before payroll` },
  ];

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>Schedule</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Payroll calendar and verification deadlines</p>
      </motion.div>

      {error && <p style={{ color: 'var(--color-frozen-text)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)', padding: '24px', boxShadow: 'var(--shadow-card)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{monthLabel}</h2>
            {schedule && (
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                Payroll day: <strong style={{ color: 'var(--color-primary)' }}>{disbursementDay}</strong>
              </span>
            )}
          </div>
          {loading ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading…</div>
          ) : (
            <CalendarGrid disbursementDay={disbursementDay} />
          )}
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-subtle)', padding: '24px', boxShadow: 'var(--shadow-card)', alignSelf: 'start' }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>Upcoming Events</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: ev.bg, borderRadius: 'var(--radius-md)', border: `1px solid ${ev.color}22` }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: ev.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={16} color={ev.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>{ev.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>{ev.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
