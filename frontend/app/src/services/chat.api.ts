import { httpClient } from './httpClient';
import type { GetAllChatsResponse } from '@/types/chat';

export const chatApi = {
  getAllChats: (friendId: string) =>
    httpClient.get<GetAllChatsResponse>(`/chat/${friendId}`).then((r) => r.data),
};
