import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/auth.store';

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => userApi.getProfile().then((r) => r.results),
    enabled: !!accessToken,
    staleTime: 60_000,
    retry: false,
  });
}
