import { httpClient } from './httpClient';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  ChangePasswordRequest,
  FriendRequestsResponse,
  ProfileResponse,
  SearchUsersResponse,
  UpdateEmailRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadProfilePictureResponse,
} from '@/types/user';

export const userApi = {
  getProfile: () => httpClient.get<ProfileResponse>('/user/profile').then((r) => r.data),

  updateProfile: (payload: UpdateProfileRequest) =>
    httpClient.patch<UpdateProfileResponse>('/user/profile', payload).then((r) => r.data),

  changePassword: (payload: ChangePasswordRequest) =>
    httpClient.patch<ApiSuccessResponse>('/user/change-password', payload).then((r) => r.data),

  updateEmail: (payload: UpdateEmailRequest) =>
    httpClient.patch<ApiSuccessResponse>('/user/update-email', payload).then((r) => r.data),

  verifyEmailToken: (token: string) =>
    httpClient.get<ApiSuccessResponse>(`/user/verify-email/${token}`).then((r) => r.data),

  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return httpClient
      .post<UploadProfilePictureResponse>('/user/profilePicture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  deleteProfilePicture: () =>
    httpClient.delete<ApiSuccessResponse>('/user/profilePicture').then((r) => r.data),

  deactivateAccount: () =>
    httpClient.delete<ApiSuccessResponse>('/user/deactivate').then((r) => r.data),

  sendFriendRequest: (friendId: string) =>
    httpClient
      .post<ApiSuccessResponse>(`/user/send-friend-request/${friendId}`)
      .then((r) => r.data),

  acceptFriendRequest: (friendId: string) =>
    httpClient
      .post<ApiSuccessResponse>(`/user/friend-request/${friendId}/accept`)
      .then((r) => r.data),

  cancelFriendRequest: (friendId: string) =>
    httpClient
      .post<ApiSuccessResponse>(`/user/friend-request/${friendId}/cancel`)
      .then((r) => r.data),

  declineFriendRequest: (friendId: string) =>
    httpClient
      .post<ApiSuccessResponse>(`/user/friend-request/${friendId}/decline`)
      .then((r) => r.data),

  getFriendRequests: () =>
    httpClient.get<FriendRequestsResponse>('/user/friend-requests').then((r) => r.data),

  searchUsers: (userName: string, page: number) =>
    httpClient
      .get<SearchUsersResponse>('/user/search', { params: { userName, page } })
      .then((r) => r.data),
};
