import { apiClient } from './client';
import type { ApiResponse } from '@/lib/types';

export interface LeaderboardEntry {
  _id: string;
  name: string;
  roleTitle: string;
  dnaScore: number | null;
  status: string;
  lastVerifiedAt: string | null;
  isFlagged: boolean;
  accountNumber: string;
  phone: string;
  cycle?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
}

export const leaderboardApi = {
  list: (cycle?: string) =>
    apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard', {
      params: cycle ? { cycle } : undefined,
    }),

  freeze: (employeeId: string) =>
    apiClient.patch<ApiResponse<LeaderboardEntry>>(`/leaderboard/${employeeId}/freeze`),
};
