import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  orgName: string;
  orgId: string;
}

export const usersApi = {
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),
  registerPushToken: (token: string) =>
    apiClient.patch<{ message: string }>('/users/push-token', { token }),
};
