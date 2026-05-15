import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { PayrollSchedule, UpdateSchedulePayload } from '../types/payroll.types';

export const payrollApi = {
  getSchedule: () =>
    apiClient.get<ApiResponse<PayrollSchedule>>('/payroll/schedule'),

  updateSchedule: (payload: UpdateSchedulePayload) =>
    apiClient.put<ApiResponse<PayrollSchedule>>('/payroll/schedule', payload),

  sendInvites: () =>
    apiClient.post<ApiResponse<{ message: string }>>('/payroll/send-invites'),
};
