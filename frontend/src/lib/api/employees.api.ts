import { apiClient } from './client';
import type { ApiResponse, Employee, EmployeeListResponse, ImportResult, ServerEmployeeStatus } from '@/lib/types';

export const employeesApi = {
  list: (params?: {
    status?: ServerEmployeeStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    apiClient.get<ApiResponse<EmployeeListResponse>>('/employees', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Employee>>(`/employees/${id}`),

  hold: (id: string) =>
    apiClient.patch<ApiResponse<Employee>>(`/employees/${id}/hold`),

  freeze: (id: string) =>
    apiClient.patch<ApiResponse<Employee>>(`/employees/${id}/freeze`, {}),

  importCsv: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient.post<ApiResponse<ImportResult>>('/employees/import', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
