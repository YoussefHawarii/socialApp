import { httpClient } from './httpClient';
import type { ApiSuccessResponse } from '@/types/api';
import type { AdminOverviewResponse, ChangeUserRoleRequest } from '@/types/admin';

export const adminApi = {
  getOverview: () => httpClient.get<AdminOverviewResponse>('/admin').then((r) => r.data),

  changeUserRole: (payload: ChangeUserRoleRequest) =>
    httpClient.patch<ApiSuccessResponse>('/admin/role', payload).then((r) => r.data),
};
