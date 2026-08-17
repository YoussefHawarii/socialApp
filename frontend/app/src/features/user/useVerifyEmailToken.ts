import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/services/user.api';

export function useVerifyEmailToken() {
  return useMutation({
    mutationFn: (token: string) => userApi.verifyEmailToken(token),
  });
}
