'use client';

import { useState, useEffect, useCallback } from 'react';
import { employeesApi } from '@/lib/api/employees.api';
import type { Employee, ServerEmployeeStatus } from '@/lib/types';

interface UseEmployeesOptions {
  search?: string;
  status?: ServerEmployeeStatus;
  page?: number;
  limit?: number;
}

export function useEmployees(options: UseEmployeesOptions = {}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await employeesApi.list(options);
      setEmployees(res.data.data.data);
      setTotal(res.data.data.total);
    } catch {
      setError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  }, [options.search, options.status, options.page, options.limit]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { employees, total, loading, error, refetch: fetch };
}

export function useEmployee(id: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    employeesApi
      .getById(id)
      .then((res) => setEmployee(res.data.data))
      .catch(() => setError('Employee not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const hold = useCallback(async () => {
    const res = await employeesApi.hold(id);
    setEmployee(res.data.data);
  }, [id]);

  const freeze = useCallback(async () => {
    const res = await employeesApi.freeze(id);
    setEmployee(res.data.data);
  }, [id]);

  return { employee, loading, error, hold, freeze };
}
