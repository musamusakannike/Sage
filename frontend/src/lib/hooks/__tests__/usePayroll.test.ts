import { describe, it, expect } from 'vitest';
import { getDaysUntilDisbursement, getDisbursementDate } from '../usePayroll';

describe('getDaysUntilDisbursement', () => {
  it('returns a positive number of days', () => {
    const days = getDaysUntilDisbursement(28);
    expect(days).toBeGreaterThanOrEqual(0);
  });

  it('rolls to next month if disbursement day already passed', () => {
    const today = new Date();
    const pastDay = today.getDate() - 1;
    if (pastDay < 1) return; // skip on 1st of month

    const days = getDaysUntilDisbursement(pastDay);
    expect(days).toBeGreaterThan(0);
  });
});

describe('getDisbursementDate', () => {
  it('returns a non-empty formatted date string', () => {
    const result = getDisbursementDate(25);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(5);
  });

  it('includes the disbursement day number in the output', () => {
    const result = getDisbursementDate(15);
    expect(result).toContain('15');
  });
});
