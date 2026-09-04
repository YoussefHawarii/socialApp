import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';
import { queryKeys } from '@/lib/queryKeys';

export const MIN_SEARCH_LENGTH = 2;

export function useFriendRequests() {
  return useQuery({
    queryKey: queryKeys.friendRequests,
    queryFn: () => userApi.getFriendRequests().then((r) => r.results),
  });
}

export function useSearchUsers(userName: string, page: number) {
  const query = userName.trim();
  return useQuery({
    queryKey: queryKeys.userSearch(query, page),
    queryFn: () => userApi.searchUsers(query, page).then((r) => r.results),
    enabled: query.length >= MIN_SEARCH_LENGTH,
    placeholderData: (prev) => prev,
  });
}
