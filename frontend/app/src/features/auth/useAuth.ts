import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { disconnectSocket } from '@/services/socket';
import type {
  ForgetPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SendOtpRequest,
} from '@/types/auth';

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),
    onSuccess: (data) => setTokens(data.access_token, data.refresh_token),
  });
}

export function useGoogleLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  return useMutation({
    mutationFn: (payload: GoogleLoginRequest) => authApi.googleLogin(payload),
    onSuccess: (data) => setTokens(data.access_token, data.refresh_token),
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (payload: SendOtpRequest) => authApi.sendOtp(payload),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (payload: ForgetPasswordRequest) => authApi.forgetPassword(payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authApi.resetPassword(payload),
  });
}

export function useActivateAccount() {
  return useMutation({
    mutationFn: (token: string) => authApi.activateAccount(token),
  });
}

export function useLogout() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const queryClient = useQueryClient();
  return () => {
    clearTokens();
    queryClient.clear();
    disconnectSocket();
  };
}
