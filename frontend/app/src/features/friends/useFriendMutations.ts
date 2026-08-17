import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';
import { queryKeys } from '@/lib/queryKeys';

export function useSendFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => userApi.sendFriendRequest(friendId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: string) => userApi.acceptFriendRequest(friendId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}
