import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/services/comment.api';
import { queryKeys } from '@/lib/queryKeys';
import type { Comment } from '@/types/comment';

function invalidateComments(queryClient: ReturnType<typeof useQueryClient>, postId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.comments(postId) });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { text?: string; image?: File }) => commentApi.createComment(postId, payload),
    onSuccess: () => invalidateComments(queryClient, postId),
  });
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { commentId: string; text?: string; image?: File }) =>
      commentApi.updateComment(postId, args.commentId, args),
    onSuccess: () => invalidateComments(queryClient, postId),
  });
}

export function useSoftDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.softDeleteComment(postId, commentId),
    onSuccess: () => invalidateComments(queryClient, postId),
  });
}

export function useHardDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.hardDeleteComment(postId, commentId),
    onSuccess: () => invalidateComments(queryClient, postId),
  });
}

export function useReplyComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { commentId: string; text?: string; image?: File }) =>
      commentApi.replyComment(postId, args.commentId, args),
    onSuccess: () => invalidateComments(queryClient, postId),
  });
}

function toggleCommentLike(comment: Comment, userId: string): Comment {
  const likeIds = comment.likes.map((l) => (typeof l === 'string' ? l : l._id));
  const hasLiked = likeIds.includes(userId);
  return {
    ...comment,
    likes: hasLiked ? likeIds.filter((id) => id !== userId) : [...likeIds, userId],
  };
}

function patchCommentTree(comments: Comment[], commentId: string, userId: string): Comment[] {
  return comments.map((c) => {
    if (c._id === commentId) return toggleCommentLike(c, userId);
    if (c.replies?.length) return { ...c, replies: patchCommentTree(c.replies, commentId, userId) };
    return c;
  });
}

export function useLikeUnlikeComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.likeUnlikeComment(postId, commentId),
    onMutate: async (commentId: string) => {
      const me = queryClient.getQueryData<{ _id: string }>(queryKeys.me);
      if (!me) return;

      await queryClient.cancelQueries({ queryKey: queryKeys.comments(postId) });
      const previous = queryClient.getQueryData<Comment[]>(queryKeys.comments(postId));
      if (previous) {
        queryClient.setQueryData(queryKeys.comments(postId), patchCommentTree(previous, commentId, me._id));
      }
      return { previous };
    },
    onError: (_err, _commentId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.comments(postId), context.previous);
      }
    },
    onSettled: () => invalidateComments(queryClient, postId),
  });
}
