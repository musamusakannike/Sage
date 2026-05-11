'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import EmployeeRow from '@/components/EmployeeRow';
import FilterChip from '@/components/FilterChip';
import UploadModal from '@/components/UploadModal';
import { EMPLOYEES, EmployeeStatus } from '@/lib/constants';

const FILTERS = ['All (58)', 'Verified (47)', 'Pending (8)', 'Frozen (3)'];

export default function EmployeesPage() {
  const [activeFilter, setActiveFilter] = useState('All (58)');
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [focusedSearch, setFocusedSearch] = useState(false);

  const filtered = EMPLOYEES.filter(emp => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Employees
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>
          Manage and verify your payroll roster
        </p>
      </motion.div>

      {/* Search + Upload row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        {/* Search */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--color-surface)',
            border: `1.5px solid ${focusedSearch ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-full)',
            padding: '0 18px',
            height: 48,
            transition: 'border-color var(--transition-fast)',
            maxWidth: 480,
          }}
        >
          <Search size={17} color="var(--color-text-secondary)" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocusedSearch(true)}
            onBlur={() => setFocusedSearch(false)}
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--color-text)',
              background: 'transparent', fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        {/* Upload button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setUploadOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: '0 20px', height: 48,
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            whiteSpace: 'nowrap',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-primary)')}
        >
          Upload
          <Plus size={17} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <FilterChip
            key={f}
            label={f}
            isActive={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
      </div>

      {/* Employee list */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          overflow: 'hidden',
          padding: '0 16px',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            No employees found
          </div>
        ) : (
          filtered.map((emp, i) => (
            <EmployeeRow key={emp.id} {...emp} index={i} variant="compact" />
          ))
        )}
      </div>

      {/* Pagination footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          Showing {filtered.length} of 58 employees
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Previous', 'Next'].map(label => (
            <button
              key={label}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
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

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
