import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';
import { queryKeys } from '@/lib/queryKeys';
import type { ApiSuccessResponse } from '@/types/api';

function useFriendActionMutation(
  mutationFn: (friendId: string) => Promise<ApiSuccessResponse>,
): UseMutationResult<ApiSuccessResponse, unknown, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.friendRequests });
      // search results embed relationship status per row; drop every cached page/query
      queryClient.invalidateQueries({ queryKey: ['user', 'search'] });
    },
  });
}

export function useSendFriendRequest() {
  return useFriendActionMutation(userApi.sendFriendRequest);
}

export function useAcceptFriendRequest() {
  return useFriendActionMutation(userApi.acceptFriendRequest);
}

export function useCancelFriendRequest() {
  return useFriendActionMutation(userApi.cancelFriendRequest);
}

export function useDeclineFriendRequest() {
  return useFriendActionMutation(userApi.declineFriendRequest);
}
