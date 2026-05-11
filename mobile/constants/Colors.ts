/**
 * Below are the colors that are used in the app.
 */

const primaryGreen = '#3A6E57';

export const Colors = {
  text: '#1A1A1A',
  textSecondary: '#666666',
  background: '#FFFFFF',
  tint: primaryGreen,
  icon: '#687076',
  tabIconDefault: '#687076',
  tabIconSelected: primaryGreen,
  primary: primaryGreen,
  secondary: '#F5F5F5',
  border: '#E1E1E1',
  error: '#FF3B30',
  
  // Dashboard Specific
  darkCard: '#0F172A', // Navy blue for payroll card
  verified: '#3A6E57',
  pending: '#D47A3A',
  frozen: '#D43A3A',
  
  status: {
    frozen: { bg: '#FDECEC', text: '#D43A3A' },
    review: { bg: '#FFF7E6', text: '#D47A3A' },
    clear: { bg: '#E6F4F0', text: '#3A6E57' },
    approved: { bg: '#E6F4F0', text: '#3A6E57' },
    pending: { bg: '#F5F5F5', text: '#666666' },
  }
};
