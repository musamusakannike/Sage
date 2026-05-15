import { apiClient } from './client';
import type { ApiResponse, LoginPayload, RegisterPayload } from '@/lib/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ access_token: string }>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/seed-admin', payload),
};
