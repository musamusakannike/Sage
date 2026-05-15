import { apiClient } from './client';
import type { ApiResponse } from '../types/api.types';
import type { Employee, EmployeeListResponse, ServerEmployeeStatus } from '../types/employee.types';

export const employeesApi = {
  list: (params?: {
    status?: ServerEmployeeStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get<ApiResponse<EmployeeListResponse>>('/employees', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Employee>>(`/employees/${id}`),

  hold: (id: string) =>
    apiClient.patch<ApiResponse<Employee>>(`/employees/${id}/hold`),

  freeze: (id: string) =>
    apiClient.patch<ApiResponse<Employee>>(`/employees/${id}/freeze`, {}),

  importCsv: (formData: FormData) =>
    apiClient.post<ApiResponse<{ imported: number; skipped: number; warnings: string[] }>>(
      '/employees/import',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    ),
};
