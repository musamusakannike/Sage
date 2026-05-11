'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Calendar, Settings, LogOut, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, APP_NAME, ORG_NAME } from '@/lib/constants';

const ICON_MAP = { Home, Users, Calendar, Settings } as const;

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: collapsed ? 72 : 240,
        background: 'var(--color-sidebar)',
        boxShadow: 'var(--shadow-sidebar)',
        transition: 'width var(--transition-base)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: 'var(--color-primary)',
          }}
        >
          <Leaf size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p
                className="font-bold leading-none"
                style={{ color: '#fff', fontSize: 18, letterSpacing: '-0.02em' }}
              >
                {APP_NAME}
              </p>
              <p
                className="mt-0.5 leading-none"
                style={{ color: 'var(--color-text-muted)', fontSize: 11 }}
              >
                Payroll Verification
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Org badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-4 rounded-lg px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ color: 'var(--color-text-muted)', fontSize: 11, lineHeight: 1.5 }}>
              {ORG_NAME}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-6 space-y-1">
        {NAV_ITEMS.map((item, i) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 group relative',
                  'transition-all duration-200',
                )}
                style={{
                  background: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                  color: isActive ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.55)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--color-sidebar-item)';
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                    style={{ width: 3, height: 20, background: 'var(--color-primary-light)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{ flexShrink: 0, marginLeft: 4 }}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div
        className="px-3 pb-6 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0 font-semibold"
            style={{
              width: 32,
              height: 32,
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: 13,
            }}
          >
            A
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
                  Amara
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 11, lineHeight: 1.3 }}>
                  amara@gov.ng
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-shrink-0 rounded-lg p-1.5 transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                title="Log out"
              >
                <LogOut size={15} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
