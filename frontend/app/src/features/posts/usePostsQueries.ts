import { useQuery } from '@tanstack/react-query';
import { postApi } from '@/services/post.api';
import { queryKeys } from '@/lib/queryKeys';

export function useActivePosts(page: number) {
  return useQuery({
    queryKey: queryKeys.posts.active(page),
    queryFn: () => postApi.getAllActivePosts(page).then((r) => r.posts),
    placeholderData: (prev) => prev,
  });
}

export function useNonActivePosts() {
  return useQuery({
    queryKey: queryKeys.posts.nonActive,
    queryFn: () => postApi.getAllNonActivePosts().then((r) => r.posts),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postApi.getPost(id).then((r) => r.post),
    enabled: !!id,
  });
}
