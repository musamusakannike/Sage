'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENTS = [
  { day: 5,  label: 'Payroll Run',         color: 'var(--color-primary)',      bg: 'var(--color-clear-bg)' },
  { day: 12, label: 'Verification Deadline', color: 'var(--color-pending)',    bg: 'var(--color-review-bg)' },
  { day: 20, label: 'Audit Review',         color: 'var(--color-frozen-text)', bg: 'var(--color-frozen-bg)' },
  { day: 25, label: 'Next Payroll',         color: 'var(--color-primary)',      bg: 'var(--color-clear-bg)' },
];

function CalendarGrid() {
  const today = 11; // May 11
  const firstDay = 5; // June 2026 starts on Monday (index 1 in Sun-based)
  const daysInMonth = 30;
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', padding: '8px 0' }}>
            {d}
          </div>
        ))}
      </div>
      {/* Cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          const event = day ? EVENTS.find(e => e.day === day) : null;
          const isToday = day === today;
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                background: isToday ? 'var(--color-primary)' : event ? event.bg : 'transparent',
                cursor: day ? 'pointer' : 'default',
                transition: 'background var(--transition-fast)',
                position: 'relative',
                padding: 4,
              }}
              onMouseEnter={e => {
                if (day && !isToday) (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-raised)';
              }}
              onMouseLeave={e => {
                if (day && !isToday) (e.currentTarget as HTMLElement).style.background = event ? event.bg : 'transparent';
              }}
            >
              {day && (
                <>
                  <span style={{
                    fontSize: 13, fontWeight: isToday ? 700 : 400,
                    color: isToday ? '#fff' : 'var(--color-text)',
                  }}>
                    {day}
                  </span>
                  {event && !isToday && (
                    <div style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: event.color, marginTop: 2,
                    }} />
                  )}
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
  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Schedule
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Payroll calendar and verification deadlines
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              June 2026
            </h2>
            <div style={{ display: 'flex', gap: 4 }}>
              {[ChevronLeft, ChevronRight].map((Icon, i) => (
                <button
                  key={i}
                  style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-secondary)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-raised)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          <CalendarGrid />
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)',
            alignSelf: 'start',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 16px' }}>
            Upcoming Events
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EVENTS.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: ev.bg,
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${ev.color}22`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: ev.color + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Calendar size={16} color={ev.color} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                    {ev.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                    June {ev.day}, 2026
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
