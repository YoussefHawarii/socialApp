import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { chatApi } from '@/services/chat.api';
import { queryKeys } from '@/lib/queryKeys';
import type { ChatMessage } from '@/types/chat';

export function useChatHistory(friendId: string) {
  return useQuery({
    queryKey: queryKeys.chat(friendId),
    queryFn: async (): Promise<ChatMessage[]> => {
      try {
        const res = await chatApi.getAllChats(friendId);
        return res.data.messages;
      } catch (error) {
        // No prior conversation yet — the backend returns 404 until the first message is sent.
        if (isAxiosError(error) && error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!friendId,
  });
}
