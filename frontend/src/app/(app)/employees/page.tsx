'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import EmployeeRow from '@/components/EmployeeRow';
import FilterChip from '@/components/FilterChip';
import UploadModal from '@/components/UploadModal';
import { useEmployees } from '@/lib/hooks/useEmployees';
import type { ServerEmployeeStatus } from '@/lib/types';

type FilterLabel = 'All' | 'Verified' | 'Pending' | 'Frozen';

const FILTER_STATUS: Record<FilterLabel, ServerEmployeeStatus | undefined> = {
  All:      undefined,
  Verified: 'CLEAR',
  Pending:  'PENDING',
  Frozen:   'FROZEN',
};

const PAGE_SIZE = 20;

export default function EmployeesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterLabel>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [focusedSearch, setFocusedSearch] = useState(false);

  const { employees, total, loading, refetch } = useEmployees({
    status: FILTER_STATUS[activeFilter],
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const handleFilterChange = useCallback((f: FilterLabel) => {
    setActiveFilter(f);
    setPage(1);
  }, []);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filters: FilterLabel[] = ['All', 'Verified', 'Pending', 'Frozen'];

  return (
    <div style={{ padding: '32px 40px' }}>
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>Employees</h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Manage and verify your payroll roster</p>
      </motion.div>

      {/* Search + Upload row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div
          style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--color-surface)',
            border: `1.5px solid ${focusedSearch ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-full)', padding: '0 18px', height: 48,
            transition: 'border-color var(--transition-fast)', maxWidth: 480,
          }}
        >
          <Search size={17} color="var(--color-text-secondary)" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setFocusedSearch(true)}
            onBlur={() => setFocusedSearch(false)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--color-text)', background: 'transparent', fontFamily: 'var(--font-sans)' }}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setUploadOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '0 20px', height: 48, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', transition: 'background var(--transition-fast)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
        >
          Upload <Plus size={17} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <FilterChip key={f} label={f} isActive={activeFilter === f} onPress={() => handleFilterChange(f)} />
        ))}
      </div>

      {/* Employee list */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)', overflow: 'hidden', padding: '0 16px' }}>
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading…</div>
        ) : employees.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No employees found</div>
        ) : (
          employees.map((emp, i) => (
            <EmployeeRow
              key={emp._id}
              id={emp._id}
              name={emp.name}
              role={emp.roleTitle}
              status={emp.status === 'CLEAR' ? 'Clear' : emp.status === 'REVIEW' ? 'Review' : emp.status === 'FROZEN' ? 'Frozen' : emp.status === 'PENDING' ? 'Pending' : 'Frozen'}
              badgeCount={emp.dnaScore ?? 0}
              index={i}
              variant="compact"
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Showing {employees.length} of {total} employees
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['Previous', 'Next'] as const).map(label => (
            <button
              key={label}
              disabled={label === 'Previous' ? page === 1 : page >= totalPages}
              onClick={() => setPage(p => label === 'Previous' ? p - 1 : p + 1)}
              style={{
                padding: '8px 20px', borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)', background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 600,
                cursor: (label === 'Previous' ? page === 1 : page >= totalPages) ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-sans)', opacity: (label === 'Previous' ? page === 1 : page >= totalPages) ? 0.4 : 1,
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                if (!(label === 'Previous' ? page === 1 : page >= totalPages)) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={refetch} />
    </div>
  );
}
