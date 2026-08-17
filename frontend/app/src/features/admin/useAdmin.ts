import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/admin.api';
import { queryKeys } from '@/lib/queryKeys';
import type { ChangeUserRoleRequest } from '@/types/admin';

export function useAdminOverview() {
  return useQuery({
    queryKey: queryKeys.admin.overview,
    queryFn: () => adminApi.getOverview().then((r) => r.results),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangeUserRoleRequest) => adminApi.changeUserRole(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview }),
  });
}
