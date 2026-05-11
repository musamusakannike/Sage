'use client';

interface FilterChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <button
      onClick={onPress}
      style={{
        padding: '8px 18px',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
        color: isActive ? '#fff' : 'var(--color-text-secondary)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
          (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
        }
      }}
    >
      {label}
    </button>
  );
}
