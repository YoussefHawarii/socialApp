import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/services/post.api';
import { queryKeys } from '@/lib/queryKeys';
import type { PaginatedPosts, Post } from '@/types/post';
import { useAuthStore } from '@/store/auth.store';

function invalidatePostLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['posts', 'active'] });
  queryClient.invalidateQueries({ queryKey: queryKeys.posts.nonActive });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { text?: string; images?: File[] }) => postApi.createPost(payload),
    onSuccess: () => invalidatePostLists(queryClient),
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { text?: string; images?: File[] }) => postApi.updatePost(id, payload),
    onSuccess: () => {
      invalidatePostLists(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(id) });
    },
  });
}

export function useSoftDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postApi.softDeletePost(id),
    onSuccess: () => invalidatePostLists(queryClient),
  });
}

export function useRestorePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postApi.restorePost(id),
    onSuccess: () => invalidatePostLists(queryClient),
  });
}

function toggleLike(post: Post, userId: string): Post {
  const likeIds = post.likes.map((l) => (typeof l === 'string' ? l : l._id));
  const hasLiked = likeIds.includes(userId);
  return {
    ...post,
    likes: hasLiked ? likeIds.filter((id) => id !== userId) : [...likeIds, userId],
  };
}

/** Optimistically toggles the post's like state across the detail cache and every cached active-posts page, rolling back on error. */
export function useLikeUnlikePost() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  return useMutation({
    mutationFn: (postId: string) => postApi.likeUnlikePost(postId),
    onMutate: async (postId: string) => {
      if (!accessToken) return;
      const me = queryClient.getQueryData<{ _id: string }>(queryKeys.me);
      const userId = me?._id;
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: queryKeys.posts.detail(postId) });

      const previousDetail = queryClient.getQueryData<Post>(queryKeys.posts.detail(postId));
      if (previousDetail) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), toggleLike(previousDetail, userId));
      }

      const previousLists = queryClient.getQueriesData<PaginatedPosts>({ queryKey: ['posts', 'active'] });
      for (const [key, data] of previousLists) {
        if (!data) continue;
        queryClient.setQueryData(key, {
          ...data,
          data: data.data.map((p) => (p._id === postId ? toggleLike(p, userId) : p)),
        });
      }

      return { previousDetail, previousLists };
    },
    onError: (_err, postId, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(queryKeys.posts.detail(postId), context.previousDetail);
      }
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_data, _err, postId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(postId) });
      queryClient.invalidateQueries({ queryKey: ['posts', 'active'] });
    },
  });
}
