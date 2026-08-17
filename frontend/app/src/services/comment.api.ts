import { httpClient } from './httpClient';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  CreateCommentResponse,
  GetCommentResponse,
  LikeUnlikeCommentResponse,
  ReplyCommentResponse,
  SoftDeleteCommentResponse,
  UpdateCommentResponse,
} from '@/types/comment';

function buildCommentFormData(payload: { text?: string; image?: File }) {
  const formData = new FormData();
  if (payload.text) formData.append('text', payload.text);
  if (payload.image) formData.append('images', payload.image);
  return formData;
}

export const commentApi = {
  getComments: (postId: string) =>
    httpClient.get<GetCommentResponse>(`/post/${postId}/comment`).then((r) => r.data),

  createComment: (postId: string, payload: { text?: string; image?: File }) =>
    httpClient
      .post<CreateCommentResponse>(`/post/${postId}/comment`, buildCommentFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  updateComment: (postId: string, commentId: string, payload: { text?: string; image?: File }) =>
    httpClient
      .patch<UpdateCommentResponse>(`/post/${postId}/comment/${commentId}`, buildCommentFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  softDeleteComment: (postId: string, commentId: string) =>
    httpClient
      .patch<SoftDeleteCommentResponse>(`/post/${postId}/comment/${commentId}/delete`)
      .then((r) => r.data),

  hardDeleteComment: (postId: string, commentId: string) =>
    httpClient.delete<ApiSuccessResponse>(`/post/${postId}/comment/${commentId}`).then((r) => r.data),

  likeUnlikeComment: (postId: string, commentId: string) =>
    httpClient
      .patch<LikeUnlikeCommentResponse>(`/post/${postId}/comment/${commentId}/like-unlike`)
      .then((r) => r.data),

  replyComment: (postId: string, commentId: string, payload: { text?: string; image?: File }) =>
    httpClient
      .post<ReplyCommentResponse>(`/post/${postId}/comment/${commentId}`, buildCommentFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),
};
