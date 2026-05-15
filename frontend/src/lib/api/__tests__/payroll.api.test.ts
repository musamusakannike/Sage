import { describe, it, expect, vi, beforeEach } from 'vitest';
import { payrollApi } from '../payroll.api';
import { apiClient } from '../client';
import type { PayrollSchedule } from '@/lib/types';

vi.mock('../client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockGet  = vi.mocked(apiClient.get);
const mockPut  = vi.mocked(apiClient.put);
const mockPost = vi.mocked(apiClient.post);

const fakeSchedule: PayrollSchedule = {
  _id: 'sched1',
  orgId: 'org1',
  disbursementDay: 25,
  smsHoursBefore: 24,
  salaryAmounts: [],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

describe('payrollApi', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getSchedule', () => {
    it('fetches the payroll schedule', async () => {
      mockGet.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: fakeSchedule } });

      const res = await payrollApi.getSchedule();
      expect(mockGet).toHaveBeenCalledWith('/payroll/schedule');
      expect(res.data.data.disbursementDay).toBe(25);
    });
  });

  describe('updateSchedule', () => {
    it('puts updated schedule fields', async () => {
      const updated = { ...fakeSchedule, disbursementDay: 28 };
      mockPut.mockResolvedValueOnce({ data: { success: true, statusCode: 200, data: updated } });

      const res = await payrollApi.updateSchedule({ disbursementDay: 28 });
      expect(mockPut).toHaveBeenCalledWith('/payroll/schedule', { disbursementDay: 28 });
      expect(res.data.data.disbursementDay).toBe(28);
    });
  });

  describe('sendInvites', () => {
    it('posts to send-invites', async () => {
      mockPost.mockResolvedValueOnce({ data: { success: true, statusCode: 201, data: { message: 'Invites sent to 58 employees.' } } });

      const res = await payrollApi.sendInvites();
      expect(mockPost).toHaveBeenCalledWith('/payroll/send-invites');
      expect(res.data.data.message).toContain('Invites');
    });
  });
});
