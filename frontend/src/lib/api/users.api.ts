import { apiClient } from './client';
import type { ApiResponse, UserProfile } from '@/lib/types';

export const usersApi = {
  getMe: () => apiClient.get<ApiResponse<UserProfile>>('/users/me'),
};
