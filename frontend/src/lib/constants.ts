export type EmployeeStatus = 'Frozen' | 'Review' | 'Clear' | 'Pending' | 'Approved';

export const STATUS_STYLES: Record<EmployeeStatus, { bg: string; text: string; dot: string }> = {
  Frozen:   { bg: 'var(--color-frozen-bg)',   text: 'var(--color-frozen-text)',   dot: '#D43A3A' },
  Review:   { bg: 'var(--color-review-bg)',   text: 'var(--color-review-text)',   dot: '#D47A3A' },
  Clear:    { bg: 'var(--color-clear-bg)',    text: 'var(--color-clear-text)',    dot: '#3A6E57' },
  Pending:  { bg: 'var(--color-pending-bg)',  text: 'var(--color-pending-text)',  dot: '#666666' },
  Approved: { bg: 'var(--color-approved-bg)', text: 'var(--color-approved-text)', dot: '#3A6E57' },
};

export const EMPLOYEES = [
  { id: '1',  name: 'Chukwuemeka Obi',  role: 'Senior Accountant',    status: 'Frozen'   as EmployeeStatus, badgeCount: 28, image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2',  name: 'Chukwuemeka Obi',  role: 'Senior Accountant',    status: 'Review'   as EmployeeStatus, badgeCount: 52 },
  { id: '3',  name: 'Jasmine Albright', role: 'Project Manager',       status: 'Review'   as EmployeeStatus, badgeCount: 34 },
  { id: '4',  name: 'Tristan Reed',     role: 'Finance Officer',       status: 'Clear'    as EmployeeStatus, badgeCount: 28 },
  { id: '5',  name: 'Kamal Ahmed',      role: 'Accountant',            status: 'Clear'    as EmployeeStatus, badgeCount: 45, image: 'https://i.pravatar.cc/150?u=2' },
  { id: '6',  name: 'Mira Iyer',        role: 'Revenue Collector',     status: 'Clear'    as EmployeeStatus, badgeCount: 30, image: 'https://i.pravatar.cc/150?u=3' },
  { id: '7',  name: 'Jared Smith',      role: 'Marketing Specialist',  status: 'Pending'  as EmployeeStatus, badgeCount: 25, image: 'https://i.pravatar.cc/150?u=4' },
  { id: '8',  name: 'Aisha Patel',      role: 'Software Engineer',     status: 'Approved' as EmployeeStatus, badgeCount: 28, image: 'https://i.pravatar.cc/150?u=5' },
];

export const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: 'Home'     },
  { href: '/employees',  label: 'Employees',  icon: 'Users'    },
  { href: '/schedule',   label: 'Schedule',   icon: 'Calendar' },
  { href: '/settings',   label: 'Settings',   icon: 'Settings' },
] as const;

export const APP_NAME = 'Sage';
export const APP_TAGLINE = "Know who's real before you pay.";
export const ORG_NAME = 'Lagos State Government · Ministry of Finance';
