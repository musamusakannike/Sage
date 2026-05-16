import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { LoginPayload, RegisterPayload } from '../types/auth.types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ access_token: string }>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/seed-admin', payload),

  requestOtp: (email: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/request-otp', { email }),

  verifyOtp: (email: string, code: string) =>
    apiClient.post<ApiResponse<{ access_token: string }>>('/auth/verify-otp', { email, code }),
};
