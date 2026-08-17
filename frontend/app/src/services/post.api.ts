import { httpClient } from './httpClient';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  CreatePostResponse,
  GetAllActivePostsResponse,
  GetAllNonActivePostsResponse,
  GetPostResponse,
  LikeUnlikePostResponse,
} from '@/types/post';

function buildPostFormData(payload: { text?: string; images?: File[] }) {
  const formData = new FormData();
  if (payload.text) formData.append('text', payload.text);
  for (const image of payload.images ?? []) {
    formData.append('images', image);
  }
  return formData;
}

export const postApi = {
  createPost: (payload: { text?: string; images?: File[] }) =>
    httpClient
      .post<CreatePostResponse>('/post/createPost', buildPostFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  updatePost: (id: string, payload: { text?: string; images?: File[] }) =>
    httpClient
      .patch<ApiSuccessResponse>(`/post/updatePost/${id}`, buildPostFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  softDeletePost: (id: string) =>
    httpClient.patch<ApiSuccessResponse>(`/post/softDeletePost/${id}`).then((r) => r.data),

  restorePost: (id: string) =>
    httpClient.patch<ApiSuccessResponse>(`/post/restorePost/${id}`).then((r) => r.data),

  getPost: (id: string) => httpClient.get<GetPostResponse>(`/post/getPost/${id}`).then((r) => r.data),

  getAllActivePosts: (page: number) =>
    httpClient
      .get<GetAllActivePostsResponse>('/post/getAllActivePosts', { params: { page } })
      .then((r) => r.data),

  getAllNonActivePosts: () =>
    httpClient.get<GetAllNonActivePostsResponse>('/post/getAllnonActivePosts').then((r) => r.data),

  likeUnlikePost: (id: string) =>
    httpClient.patch<LikeUnlikePostResponse>(`/post/${id}/like-unlike`).then((r) => r.data),
};
