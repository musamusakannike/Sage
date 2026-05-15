'use client';

import { useState, useEffect } from 'react';
import { payrollApi } from '@/lib/api/payroll.api';
import type { PayrollSchedule } from '@/lib/types';

export function usePayroll() {
  const [schedule, setSchedule] = useState<PayrollSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    payrollApi
      .getSchedule()
      .then((res) => setSchedule(res.data.data))
      .catch(() => setError('Failed to load payroll schedule.'))
      .finally(() => setLoading(false));
  }, []);

  return { schedule, loading, error };
}

export function getDaysUntilDisbursement(disbursementDay: number): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let target = new Date(year, month, disbursementDay);
  if (target <= now) {
    target = new Date(year, month + 1, disbursementDay);
  }
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDisbursementDate(disbursementDay: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let target = new Date(year, month, disbursementDay);
  if (target <= now) {
    target = new Date(year, month + 1, disbursementDay);
  }
  return target.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
