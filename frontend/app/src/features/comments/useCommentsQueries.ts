import { useQuery } from '@tanstack/react-query';
import { commentApi } from '@/services/comment.api';
import { queryKeys } from '@/lib/queryKeys';

export function useComments(postId: string) {
  return useQuery({
    queryKey: queryKeys.comments(postId),
    queryFn: () => commentApi.getComments(postId).then((r) => r.results.comments),
    enabled: !!postId,
  });
}
