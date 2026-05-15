import { describe, it, expect, vi, beforeEach } from 'vitest';
import { employeesApi } from '../employees.api';
import { apiClient } from '../client';
import type { Employee } from '@/lib/types';

vi.mock('../client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockGet   = vi.mocked(apiClient.get);
const mockPatch = vi.mocked(apiClient.patch);
const mockPost  = vi.mocked(apiClient.post);

const fakeEmployee: Employee = {
  _id: 'emp1',
  orgId: 'org1',
  name: 'Chukwuemeka Obi',
  roleTitle: 'Senior Accountant',
  accountNumber: '0123456789',
  phone: '08012345678',
  email: null,
  dnaScore: 28,
  status: 'FROZEN',
  lastVerifiedAt: '2026-05-15T07:43:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-05-15T07:43:00Z',
};

describe('employeesApi', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('list', () => {
    it('fetches employees with no params', async () => {
      mockGet.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: { data: [fakeEmployee], total: 1 } } });

      const res = await employeesApi.list();
      expect(mockGet).toHaveBeenCalledWith('/employees', { params: undefined });
      expect(res.data.data.data).toHaveLength(1);
      expect(res.data.data.total).toBe(1);
    });

    it('passes search and status query params', async () => {
      mockGet.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: { data: [], total: 0 } } });

      await employeesApi.list({ search: 'Obi', status: 'FROZEN', page: 2, limit: 10 });

      expect(mockGet).toHaveBeenCalledWith('/employees', {
        params: { search: 'Obi', status: 'FROZEN', page: 2, limit: 10 },
      });
    });
  });

  describe('getById', () => {
    it('fetches a single employee by id', async () => {
      mockGet.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: fakeEmployee } });

      const res = await employeesApi.getById('emp1');
      expect(mockGet).toHaveBeenCalledWith('/employees/emp1');
      expect(res.data.data._id).toBe('emp1');
    });
  });

  describe('hold', () => {
    it('patches the hold endpoint', async () => {
      mockPatch.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: { ...fakeEmployee, status: 'PENDING' } } });

      const res = await employeesApi.hold('emp1');
      expect(mockPatch).toHaveBeenCalledWith('/employees/emp1/hold');
      expect(res.data.data.status).toBe('PENDING');
    });
  });

  describe('freeze', () => {
    it('patches the freeze endpoint', async () => {
      mockPatch.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: { ...fakeEmployee, status: 'FROZEN' } } });

      await employeesApi.freeze('emp1');
      expect(mockPatch).toHaveBeenCalledWith('/employees/emp1/freeze', {});
    });
  });

  describe('importCsv', () => {
    it('posts a FormData with the CSV file', async () => {
      mockPost.mockResolvedValueOnce({ data: { success: true, statusCode: 201, data: { imported: 56, skipped: 2, warnings: [] } } });

      const file = new File(['name,role\nObi,Acc'], 'roster.csv', { type: 'text/csv' });
      const res = await employeesApi.importCsv(file);

      expect(mockPost).toHaveBeenCalledWith(
        '/employees/import',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      expect(res.data.data.imported).toBe(56);
    });
  });
});
