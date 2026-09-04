export const queryKeys = {
  me: ['user', 'me'] as const,
  posts: {
    active: (page: number) => ['posts', 'active', page] as const,
    nonActive: ['posts', 'nonActive'] as const,
    detail: (id: string) => ['posts', 'detail', id] as const,
  },
  comments: (postId: string) => ['comments', postId] as const,
  chat: (friendId: string) => ['chat', friendId] as const,
  friendRequests: ['user', 'friend-requests'] as const,
  userSearch: (userName: string, page: number) => ['user', 'search', userName, page] as const,
  admin: {
    overview: ['admin', 'overview'] as const,
  },
};
