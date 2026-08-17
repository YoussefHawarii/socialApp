import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';
import { queryKeys } from '@/lib/queryKeys';
import type { ChangePasswordRequest, UpdateEmailRequest, UpdateProfileRequest } from '@/types/user';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => userApi.updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => userApi.changePassword(payload),
  });
}

export function useUpdateEmail() {
  return useMutation({
    mutationFn: (payload: UpdateEmailRequest) => userApi.updateEmail(payload),
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => userApi.uploadProfilePicture(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useDeleteProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => userApi.deleteProfilePicture(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useDeactivateAccount() {
  return useMutation({
    mutationFn: () => userApi.deactivateAccount(),
  });
}
