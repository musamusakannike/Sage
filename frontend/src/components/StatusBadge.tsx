import { EmployeeStatus, STATUS_STYLES } from '@/lib/constants';

interface StatusBadgeProps {
  status: EmployeeStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      style={{
        background: styles.bg,
        color: styles.text,
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 600,
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        minWidth: size === 'sm' ? 56 : 70,
        textAlign: 'center',
      }}
    >
      {status}
    </span>
  );
}
