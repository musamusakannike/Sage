import { apiClient } from './client';
import type { ApiResponse, LoginPayload, RegisterPayload, InvitePayload, RequestOtpPayload, VerifyOtpPayload } from '@/lib/types';

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ access_token: string }>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/seed-admin', payload),

  // Creates an account for an employee/auditor and emails them a welcome + sign-in link
  invite: (payload: InvitePayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/invite', payload),

  // Sends a one-time confirmation code to the given email
  requestOtp: (payload: RequestOtpPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/request-otp', payload),

  // Verifies the code and returns a JWT
  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<ApiResponse<{ access_token: string }>>('/auth/verify-otp', payload),
};
