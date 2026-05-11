'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
          style={{
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border-subtle)',
            height: 60,
          }}
        >
          <button
            onClick={() => setCollapsed(c => !c)}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-raised)';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
            }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </header>

        {/* Page content */}
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--color-bg)' }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
