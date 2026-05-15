import { apiClient } from './client';
import type { ApiResponse, PayrollSchedule, UpdateSchedulePayload } from '@/lib/types';

export const payrollApi = {
  getSchedule: () =>
    apiClient.get<ApiResponse<PayrollSchedule>>('/payroll/schedule'),

  updateSchedule: (payload: UpdateSchedulePayload) =>
    apiClient.put<ApiResponse<PayrollSchedule>>('/payroll/schedule', payload),

  sendInvites: () =>
    apiClient.post<ApiResponse<{ message: string }>>('/payroll/send-invites'),
};
