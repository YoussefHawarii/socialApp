import { httpClient } from './httpClient';
import type {
  ForgetPasswordRequest,
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SendOtpRequest,
} from '@/types/auth';
import type { ApiSuccessResponse } from '@/types/api';

export const authApi = {
  sendOtp: (payload: SendOtpRequest) =>
    httpClient.post<ApiSuccessResponse>('/auth/verify', payload).then((r) => r.data),

  register: (payload: RegisterRequest) =>
    httpClient.post<ApiSuccessResponse>('/auth/register', payload).then((r) => r.data),

  activateAccount: (token: string) =>
    httpClient.get<ApiSuccessResponse>(`/auth/activate_account/${token}`).then((r) => r.data),

  login: (payload: LoginRequest) =>
    httpClient.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  forgetPassword: (payload: ForgetPasswordRequest) =>
    httpClient.post<ApiSuccessResponse>('/auth/forget_password', payload).then((r) => r.data),

  resetPassword: (payload: ResetPasswordRequest) =>
    httpClient.post<ApiSuccessResponse>('/auth/reset_password', payload).then((r) => r.data),

  googleLogin: (payload: GoogleLoginRequest) =>
    httpClient.post<LoginResponse>('/auth/google_login', payload).then((r) => r.data),
};
